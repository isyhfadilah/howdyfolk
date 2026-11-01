import AccountShell from '@/components/ui/AccountShell';
import {sendLoginLink} from '@/features/auth/actions';
import {authConfigured} from '@/lib/supabase/server';
export const dynamic='force-dynamic';
export default async function Login({searchParams}:{searchParams:Promise<{status?:string}>}){
 const {status}=await searchParams;
 const ready=authConfigured()&&Boolean(process.env.APP_URL&&process.env.SUPABASE_SECRET_KEY);
 const messages:Record<string,string>={sent:'If your email can receive a link, check your inbox to continue.',invalid:'Enter a valid email address.',limited:'Please wait before requesting another link.',unavailable:'Sign-in is temporarily unavailable. Please try again later.',expired:'This link has expired or was already used. Request a new one.'};
 return <AccountShell title="Welcome, good company."><p>Sign in with your purchase email. No password needed.</p>{!ready&&<p role="status">Email sign-in is not connected yet. The free studio is available.</p>}{status&&<p role="status">{messages[status]??'Please try again.'}</p>}<form action={sendLoginLink} className="space-y-4"><label className="block text-sm font-medium" htmlFor="email">Email address</label><input className="w-full rounded-lg border border-stone-300 px-4 py-3" id="email" name="email" type="email" required autoComplete="email" maxLength={254}/><button disabled={!ready} className="w-full rounded-lg bg-ink px-5 py-3 text-white disabled:opacity-40">Email me a sign-in link</button></form></AccountShell>;
}
