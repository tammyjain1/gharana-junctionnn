import { useCallback, useEffect, useState } from 'react';
import { Download, FileSpreadsheet, RefreshCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import DateFilters from '../../components/DateFilters.jsx';
import ExpenseForm from '../../components/ExpenseForm.jsx';
import ExpenseTable from '../../components/ExpenseTable.jsx';
import Modal from '../../components/Modal.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import StatCard from '../../components/StatCard.jsx';
import { deleteExpense, listExpenses, updateExpense } from '../../lib/api.js';
import { totalAmount, unpaidExpenses } from '../../lib/analytics.js';
import { currency } from '../../lib/format.js';
import { exportExpensesExcel, exportExpensesPdf } from '../../lib/exports.js';

export default function OwnerExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [filters, setFilters] = useState({ from: '', to: '' });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

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

  const pending = unpaidExpenses(expenses);

  async function saveExpense(payload) {
    try {
      await updateExpense(editing.id, payload);
      toast.success('Expense updated');
      setEditing(null);
      await load();
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function removeExpense(expense) {
    if (!confirm('Delete this expense record?')) return;
    try {
      await deleteExpense(expense.id);
      toast.success('Expense deleted');
      await load();
    } catch (error) {
      toast.error(error.message);
    }
  }

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
        <StatCard label="Pending Payments" value={currency(totalAmount(pending))} detail={`${pending.length} unpaid`} tone="amber" />
        <StatCard label="Records" value={loading ? '...' : expenses.length} tone="blue" />
      </div>
      <ExpenseTable expenses={expenses} canManage onEdit={setEditing} onDelete={removeExpense} showStaff />
      {editing && (
        <Modal title="Edit Expense Payment" onClose={() => setEditing(null)}>
          <ExpenseForm expense={editing} userId={editing.user_id} onSubmit={saveExpense} onCancel={() => setEditing(null)} />
        </Modal>
      )}
    </div>
  );
}
