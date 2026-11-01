import 'server-only';
import {supabaseAdmin} from '@/lib/supabase/admin';
import {verifyLicense,encryptLicense} from '@/lib/gumroad/server';
import {purchaseMatches} from '@/lib/gumroad/policy';
export async function activateLicense(user:{id:string;email?:string},license:string){
 const product=process.env.GUMROAD_PRODUCT_ID;
 if(!product||!process.env.LICENSE_ENCRYPTION_KEY)return {status:503,message:'Purchases are not connected yet.'};
 const db=supabaseAdmin();
 const {data:allowed,error:limitError}=await db.rpc('consume_rate_limit',{p_key:`activate:${user.id}`,p_limit:5});
 if(limitError||!allowed)return {status:429,message:'Please wait before trying another license.'};
 const purchase=await verifyLicense(license,product);
 if(!purchase||!user.email||!purchaseMatches(purchase,user.email,product))return {status:400,message:'This license is not valid for this account and collection.'};
 const {error}=await db.rpc('activate_purchase',{p_user:user.id,p_sale:purchase.sale_id,p_product:product,p_license:encryptLicense(license)});
 if(error)return {status:409,message:'This purchase could not be activated. It may belong to another account.'};
 return {status:200,message:'Your collection is ready.'};
}
