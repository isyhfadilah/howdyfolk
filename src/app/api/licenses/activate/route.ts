import {NextResponse,type NextRequest} from 'next/server';
import {authConfigured,supabaseServer} from '@/lib/supabase/server';
import {activateLicense} from '@/features/licensing/server/activate';
export async function POST(request:NextRequest){
 const origin=process.env.APP_URL??request.nextUrl.origin;
 if(request.headers.get('origin')!==new URL(origin).origin)return NextResponse.json({error:'Invalid origin'},{status:403});
 if(!authConfigured())return NextResponse.json({error:'Sign-in unavailable'},{status:503});
 const client=await supabaseServer();const {data:{user}}=await client.auth.getUser();
 if(!user)return NextResponse.json({error:'Sign in first'},{status:401});
 try{const form=await request.formData();const license=String(form.get('license')??'').trim();if(!license||license.length>200)return NextResponse.redirect(new URL('/activate?status=invalid',origin),303);
 const result=await activateLicense(user,license);return NextResponse.redirect(new URL(`/activate?status=${result.status===200?'ready':result.status===429?'limited':'invalid'}`,origin),303);
 }catch{return NextResponse.redirect(new URL('/activate?status=unavailable',origin),303);}
}
