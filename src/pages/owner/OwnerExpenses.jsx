import { useCallback, useEffect, useState } from 'react';
import { Download, FileSpreadsheet, RefreshCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import DateFilters from '../../components/DateFilters.jsx';
import ExpenseTable from '../../components/ExpenseTable.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import StatCard from '../../components/StatCard.jsx';
import { listExpenses } from '../../lib/api.js';
import { staffTotals, totalAmount } from '../../lib/analytics.js';
import { currency } from '../../lib/format.js';
import { exportExpensesExcel, exportExpensesPdf } from '../../lib/exports.js';

export default function OwnerExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [filters, setFilters] = useState({ from: '', to: '' });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setExpenses(await listExpenses(filters));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const top = staffTotals(expenses)[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="All Expense Records"
        eyebrow="Owner"
        actions={
          <>
            <button className="btn-secondary" type="button" onClick={load}><RefreshCcw className="h-4 w-4" /> Refresh</button>
            <button className="btn-secondary" type="button" onClick={() => exportExpensesExcel(expenses)}><FileSpreadsheet className="h-4 w-4" /> Excel</button>
            <button className="btn-primary" type="button" onClick={() => exportExpensesPdf(expenses)}><Download className="h-4 w-4" /> PDF</button>
          </>
        }
      />
      <DateFilters filters={filters} setFilters={setFilters} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Filtered Total" value={currency(totalAmount(expenses))} />
        <StatCard label="Records" value={loading ? '...' : expenses.length} tone="blue" />
        <StatCard label="Highest Staff Total" value={top?.name || '-'} detail={top ? currency(top.total) : 'No data'} tone="amber" />
      </div>
      <ExpenseTable expenses={expenses} showStaff />
    </div>
  );
}
