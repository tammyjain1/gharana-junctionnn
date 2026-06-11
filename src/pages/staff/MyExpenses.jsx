import { useCallback, useEffect, useState } from 'react';
import { Plus, RefreshCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import DateFilters from '../../components/DateFilters.jsx';
import ExpenseForm from '../../components/ExpenseForm.jsx';
import ExpenseTable from '../../components/ExpenseTable.jsx';
import Modal from '../../components/Modal.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import StatCard from '../../components/StatCard.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { createExpense, deleteExpense, listExpenses, updateExpense } from '../../lib/api.js';
import { currentMonthExpenses, totalAmount } from '../../lib/analytics.js';
import { currency } from '../../lib/format.js';

export default function MyExpenses() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [filters, setFilters] = useState({ from: '', to: '' });
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setExpenses(await listExpenses({ ...filters, userId: user.id }));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [filters, user.id]);

  useEffect(() => {
    load();
  }, [load]);

  async function saveExpense(payload) {
    try {
      if (editing) await updateExpense(editing.id, payload);
      else await createExpense(payload);
      toast.success('Expense saved');
      setEditing(null);
      setShowForm(false);
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
        title="My Expense Records"
        eyebrow="Staff"
        actions={
          <>
            <button className="btn-secondary" type="button" onClick={load}><RefreshCcw className="h-4 w-4" /> Refresh</button>
            <button className="btn-primary" type="button" onClick={() => setShowForm(true)}><Plus className="h-4 w-4" /> Add Expense</button>
          </>
        }
      />
      <DateFilters filters={filters} setFilters={setFilters} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Filtered Total" value={currency(totalAmount(expenses))} />
        <StatCard label="Monthly Total" value={currency(totalAmount(currentMonthExpenses(expenses)))} tone="amber" />
        <StatCard label="Records" value={loading ? '...' : expenses.length} tone="blue" />
      </div>
      <ExpenseTable expenses={expenses} canManage onEdit={(expense) => { setEditing(expense); setShowForm(true); }} onDelete={removeExpense} showStaff={false} />

      {showForm && (
        <Modal title={editing ? 'Edit Expense' : 'Add Expense'} onClose={() => { setEditing(null); setShowForm(false); }}>
          <ExpenseForm expense={editing} userId={user.id} onSubmit={saveExpense} onCancel={() => { setEditing(null); setShowForm(false); }} />
        </Modal>
      )}
    </div>
  );
}
