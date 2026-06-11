import { motion } from 'framer-motion';

export default function StatCard({ label, value, icon: Icon, tone = 'emerald', detail }) {
  const tones = {
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    blue: 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    rose: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{value}</p>
          {detail && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{detail}</p>}
        </div>
        {Icon && (
          <span className={`rounded-lg p-2 ${tones[tone]}`}>
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
    </motion.div>
  );
}
