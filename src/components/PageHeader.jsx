export default function PageHeader({ title, eyebrow, actions }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">{eyebrow}</p>}
        <h1 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white sm:text-3xl">{title}</h1>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
