import Link from 'next/link';
export default function AccountShell({title,children}:{title:string;children:React.ReactNode}){
 return <main className="mx-auto min-h-screen max-w-xl px-6 py-16"><Link href="/" className="logo">howdyfolk ☺</Link><h1 className="mt-12 text-4xl font-bold tracking-tight">{title}</h1><div className="mt-8 space-y-6 rounded-2xl border border-stone-300 bg-white p-8">{children}</div><Link className="mt-8 inline-block underline underline-offset-4" href="/">Back to the studio</Link></main>;
}
