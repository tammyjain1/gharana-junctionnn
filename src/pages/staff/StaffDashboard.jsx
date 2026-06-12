import { useCallback, useEffect, useState } from 'react';
import { CalendarDays, CreditCard, PieChart, Plus, ReceiptText } from 'lucide-react';
import toast from 'react-hot-toast';
import ExpenseForm from '../../components/ExpenseForm.jsx';
import ExpenseTable from '../../components/ExpenseTable.jsx';
import Modal from '../../components/Modal.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import StatCard from '../../components/StatCard.jsx';
import { CategoryPie, MonthlyBar } from '../../components/Charts.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { createExpense, listExpenses } from '../../lib/api.js';
import { currentMonthExpenses, currentWeekExpenses, groupByCategory, monthlySeries, totalAmount, unpaidExpenses } from '../../lib/analytics.js';
import { currency } from '../../lib/format.js';

export default function StaffDashboard() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const loadExpenses = useCallback(async () => {
    try {
      setExpenses(await listExpenses({ userId: user.id }));
    } catch (error) {
      toast.error(error.message);
    }
  }, [user.id]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  async function saveExpense(payload) {
    try {
      await createExpense(payload);
      toast.success('Expense added');
      setShowForm(false);
      await loadExpenses();
    } catch (error) {
      toast.error(error.message);
    }
  }

  const month = currentMonthExpenses(expenses);
  const week = currentWeekExpenses(expenses);
  const pending = unpaidExpenses(expenses);
  const categories = groupByCategory(expenses);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff Dashboard"
        eyebrow="My Expenses"
        actions={<button className="btn-primary" type="button" onClick={() => setShowForm(true)}><Plus className="h-4 w-4" /> Add Expense</button>}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Personal Total" value={currency(totalAmount(expenses))} icon={ReceiptText} />
        <StatCard label="Monthly Total" value={currency(totalAmount(month))} icon={CreditCard} tone="amber" />
        <StatCard label="Weekly Total" value={currency(totalAmount(week))} icon={CalendarDays} tone="blue" />
        <StatCard label="Pending Payment" value={currency(totalAmount(pending))} detail={`${pending.length} unpaid`} icon={PieChart} tone="rose" />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <section className="card p-5">
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Monthly Summary</h2>
          <MonthlyBar data={monthlySeries(expenses)} />
        </section>
        <section className="card p-5">
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Category Breakdown</h2>
          <CategoryPie data={categories} />
        </section>
      </div>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Recent Expenses</h2>
        <ExpenseTable expenses={expenses.slice(0, 6)} showStaff={false} />
      </section>

      {showForm && (
        <Modal title="Add Expense" onClose={() => setShowForm(false)}>
          <ExpenseForm userId={user.id} onSubmit={saveExpense} onCancel={() => setShowForm(false)} />
        </Modal>
      )}
    </div>
  );
}
