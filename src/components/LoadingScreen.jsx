import { Loader2 } from 'lucide-react';

export default function LoadingScreen({ label = 'Loading' }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
      <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <Loader2 className="h-5 w-5 animate-spin text-brand-600" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}
