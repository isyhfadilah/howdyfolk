import {NextResponse,type NextRequest} from 'next/server';
import {authConfigured,supabaseServer} from '@/lib/supabase/server';
import {supabaseAdmin} from '@/lib/supabase/admin';
import {decryptLicense,verifyLicense} from '@/lib/gumroad/server';
import {purchaseActive} from '@/lib/gumroad/policy';
const headers={'Cache-Control':'private, no-store'};
export async function GET(_request:NextRequest,{params}:{params:Promise<{assetId:string}>}){
 const {assetId}=await params;
 if(!/^[0-9a-f-]{36}$/i.test(assetId))return NextResponse.json({error:'Asset not found'},{status:404,headers});
 if(!authConfigured())return NextResponse.json({error:'Service unavailable'},{status:503,headers});
 try{
  const client=await supabaseServer();const {data:{user}}=await client.auth.getUser();
  if(!user)return NextResponse.json({error:'Sign in first'},{status:401,headers});
  const db=supabaseAdmin();
  const {data:asset}=await db.from('assets').select('collection_id,storage_path').eq('id',assetId).single();
  if(!asset)return NextResponse.json({error:'Asset not found'},{status:404,headers});
  const {data:entitlement}=await db.from('entitlements').select('purchase_id').eq('user_id',user.id).eq('collection_id',asset.collection_id).eq('active',true).single();
  if(!entitlement)return NextResponse.json({error:'Collection access required'},{status:403,headers});
  const {data:purchase}=await db.from('purchases').select('*').eq('id',entitlement.purchase_id).eq('user_id',user.id).eq('active',true).single();
  if(!purchase)return NextResponse.json({error:'Collection access required'},{status:403,headers});
  if(Date.now()-new Date(purchase.verified_at).getTime()>86400000){
   const {data:collection}=await db.from('collections').select('gumroad_product_id').eq('id',asset.collection_id).single();
   if(!collection)throw new Error('Collection unavailable');
   const verified=await verifyLicense(decryptLicense(purchase.encrypted_license),collection.gumroad_product_id);
   if(!verified||verified.sale_id!==purchase.sale_id||!purchaseActive(verified)){
    await db.from('purchases').update({active:false}).eq('id',purchase.id);
    await db.from('entitlements').update({active:false}).eq('purchase_id',purchase.id);
    return NextResponse.json({error:'Purchase is no longer active'},{status:403,headers});
   }
   const {error}=await db.from('purchases').update({verified_at:new Date().toISOString()}).eq('id',purchase.id);if(error)throw error;
  }
  const {data,error}=await db.storage.from('premium-assets').createSignedUrl(asset.storage_path,60);
  if(error)throw error;
  return NextResponse.json({url:data.signedUrl,expiresIn:60},{headers});
 }catch{return NextResponse.json({error:'Access verification unavailable. Please try again.'},{status:503,headers});}
}
