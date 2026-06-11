import { useEffect, useMemo, useState } from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import { endOfMonth, endOfWeek, format, isWithinInterval, parseISO, startOfMonth, startOfWeek } from 'date-fns';
import toast from 'react-hot-toast';
import ExpenseTable from '../../components/ExpenseTable.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import StatCard from '../../components/StatCard.jsx';
import { CategoryPie, MonthlyBar } from '../../components/Charts.jsx';
import { REPORT_PERIODS } from '../../lib/constants.js';
import { listExpenses } from '../../lib/api.js';
import { groupByCategory, monthlySeries, totalAmount } from '../../lib/analytics.js';
import { currency } from '../../lib/format.js';
import { exportExpensesExcel, exportExpensesPdf } from '../../lib/exports.js';

function filterByPeriod(expenses, period) {
  const now = new Date();
  return expenses.filter((expense) => {
    const date = parseISO(expense.expense_date);
    if (period === 'daily') return format(date, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');
    if (period === 'weekly') return isWithinInterval(date, { start: startOfWeek(now), end: endOfWeek(now) });
    return isWithinInterval(date, { start: startOfMonth(now), end: endOfMonth(now) });
  });
}

export default function Reports() {
  const [expenses, setExpenses] = useState([]);
  const [period, setPeriod] = useState('monthly');

  useEffect(() => {
    listExpenses().then(setExpenses).catch((error) => toast.error(error.message));
  }, []);

  const reportExpenses = useMemo(() => filterByPeriod(expenses, period), [expenses, period]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        eyebrow="Daily, Weekly and Monthly"
        actions={
          <>
            <button className="btn-secondary" type="button" onClick={() => exportExpensesExcel(reportExpenses)}><FileSpreadsheet className="h-4 w-4" /> Excel</button>
            <button className="btn-primary" type="button" onClick={() => exportExpensesPdf(reportExpenses, `Gharana Junction ${period} Report`)}><Download className="h-4 w-4" /> PDF</button>
          </>
        }
      />
      <div className="card p-2">
        <div className="grid grid-cols-3 gap-2">
          {REPORT_PERIODS.map((item) => (
            <button
              key={item.value}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${period === item.value ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'}`}
              type="button"
              onClick={() => setPeriod(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Report Total" value={currency(totalAmount(reportExpenses))} />
        <StatCard label="Records" value={reportExpenses.length} tone="blue" />
        <StatCard label="Average Record" value={currency(reportExpenses.length ? totalAmount(reportExpenses) / reportExpenses.length : 0)} tone="amber" />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <section className="card p-5">
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Monthly Trend</h2>
          <MonthlyBar data={monthlySeries(expenses)} />
        </section>
        <section className="card p-5">
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Category Breakdown</h2>
          <CategoryPie data={groupByCategory(reportExpenses)} />
        </section>
      </div>
      <ExpenseTable expenses={reportExpenses} showStaff />
    </div>
  );
}
