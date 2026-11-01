import {redirect} from 'next/navigation';
import AccountShell from '@/components/ui/AccountShell';
import {authConfigured,supabaseServer} from '@/lib/supabase/server';
export const dynamic='force-dynamic';
export default async function Activate({searchParams}:{searchParams:Promise<{status?:string}>}){
 if(!authConfigured())redirect('/login');
 const client=await supabaseServer();const {data:{user}}=await client.auth.getUser();if(!user)redirect('/login');
 const {status}=await searchParams;
 const messages:Record<string,string>={ready:'Your collection is activated. Find it in your account.',invalid:'This license could not be activated. Use the same email as your purchase.',limited:'Please wait before trying again.',unavailable:'Verification is unavailable. Please try again later.'};
 const ready=Boolean(process.env.GUMROAD_PRODUCT_ID&&process.env.LICENSE_ENCRYPTION_KEY&&process.env.SUPABASE_SECRET_KEY);
 return <AccountShell title="Make it yours."><p>Activate the license from your Gumroad receipt using your purchase account.</p>{!ready&&<p>Purchase activation is not connected yet.</p>}{status&&<p role="status">{messages[status]??'Please try again.'}</p>}<form action="/api/licenses/activate" method="post" className="space-y-4"><label htmlFor="license" className="block">License key</label><input id="license" name="license" required maxLength={200} autoComplete="off" className="w-full rounded-lg border border-stone-300 px-4 py-3"/><button disabled={!ready} className="rounded-lg bg-ink px-5 py-3 text-white disabled:opacity-40">Activate collection</button></form><a href="/account" className="underline">Your account</a></AccountShell>;
}
