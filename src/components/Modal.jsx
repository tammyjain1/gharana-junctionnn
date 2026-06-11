import { X } from 'lucide-react';

export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="mx-auto max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-lg bg-white shadow-soft dark:bg-slate-950 sm:rounded-lg">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-950">
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{title}</h2>
          <button className="btn-secondary h-9 w-9 p-0" type="button" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
