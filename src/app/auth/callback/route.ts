import {NextResponse,type NextRequest} from 'next/server';
import {authConfigured,supabaseServer} from '@/lib/supabase/server';
export async function GET(request:NextRequest){
 const origin=process.env.APP_URL??request.nextUrl.origin;
 if(!authConfigured())return NextResponse.redirect(new URL('/login?status=unavailable',origin));
 const code=request.nextUrl.searchParams.get('code');
 if(code){const client=await supabaseServer();const {error}=await client.auth.exchangeCodeForSession(code);if(!error)return NextResponse.redirect(new URL('/account',origin));}
 return NextResponse.redirect(new URL('/login?status=expired',origin));
}
