import { Database, FileKey2 } from 'lucide-react';

export default function SetupRequired() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center">
        <div className="w-full rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-soft sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-600">
            <Database className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-3xl font-black">Gharana Junction setup pending</h1>
          <p className="mt-3 text-slate-300">
            App blank isliye aa raha tha kyunki Supabase credentials abhi add nahi hue. Pehle `.env` file banao, phir app login screen dikhayega.
          </p>

          <div className="mt-6 rounded-lg border border-slate-700 bg-slate-950 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
              <FileKey2 className="h-4 w-4" />
              Project folder me `.env` file banao
            </div>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-black p-4 text-sm text-slate-100">
{`VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key`}
            </pre>
          </div>

          <ol className="mt-6 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-300">
            <li>Supabase project banao.</li>
            <li>Project Settings → API se Project URL aur anon public key copy karo.</li>
            <li>`.env.example` ki copy banao aur naam `.env` rakho.</li>
            <li>Upar wali values `.env` me paste karo.</li>
            <li>Terminal me server stop karke dobara `npm run dev -- --port 5173 --host 127.0.0.1` chalao.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
