import { FileSearch } from 'lucide-react';

export default function EmptyState({ title = 'No records found', message = 'Try changing filters or adding a new record.' }) {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-12 text-center">
      <FileSearch className="h-10 w-10 text-slate-400" />
      <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
}
