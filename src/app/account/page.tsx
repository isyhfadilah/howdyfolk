import {redirect} from 'next/navigation';
import AccountShell from '@/components/ui/AccountShell';
import {authConfigured,supabaseServer} from '@/lib/supabase/server';
import {signOut} from '@/features/auth/actions';
export const dynamic='force-dynamic';
export default async function Account(){
 if(!authConfigured())redirect('/login');
 const client=await supabaseServer();const {data:{user}}=await client.auth.getUser();if(!user)redirect('/login');
 const {data,error}=await client.from('entitlements').select('id,collections(name)').eq('user_id',user.id).eq('active',true);
 return <AccountShell title="Your little collection."><p>Signed in as {user.email}</p>{error?<p>Your collections couldn’t be loaded. Please try again.</p>:data?.length?<ul>{data.map(item=><li key={item.id}>{(item.collections as unknown as {name:string})?.name??'Collection'}</li>)}</ul>:<p>No paid collections yet. You can keep creating in the free studio.</p>}<a className="inline-block underline" href="/activate">Activate a purchase</a><form action={signOut}><button className="rounded-lg border border-stone-300 px-4 py-2">Sign out</button></form></AccountShell>;
}
