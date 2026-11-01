'use server';
import {redirect} from 'next/navigation';
import {createHash} from 'node:crypto';
import {z} from 'zod';
import {authConfigured,supabaseServer} from '@/lib/supabase/server';
import {supabaseAdmin} from '@/lib/supabase/admin';
export async function sendLoginLink(form:FormData){
 if(!authConfigured()||!process.env.APP_URL||!process.env.SUPABASE_SECRET_KEY)redirect('/login?status=unavailable');
 const email=z.email().max(254).safeParse(form.get('email'));
 if(!email.success)redirect('/login?status=invalid');
 let status='sent';
 try{
  const key=createHash('sha256').update(email.data.toLowerCase()).digest('hex');
  const {data:allowed,error:rateError}=await supabaseAdmin().rpc('consume_rate_limit',{p_key:`login:${key}`,p_limit:3});
  if(rateError||!allowed)status='limited';
  else{const client=await supabaseServer();const {error}=await client.auth.signInWithOtp({email:email.data,options:{emailRedirectTo:new URL('/auth/callback',process.env.APP_URL).href}});if(error)status='unavailable';}
 }catch{status='unavailable';}
 redirect(`/login?status=${status}`);
}
export async function signOut(){if(authConfigured()){const client=await supabaseServer();await client.auth.signOut();}redirect('/');}
