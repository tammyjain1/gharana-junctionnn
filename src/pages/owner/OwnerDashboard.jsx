import { useEffect, useState } from 'react';
import { CreditCard, ReceiptText, TrendingUp, Users } from 'lucide-react';
import PageHeader from '../../components/PageHeader.jsx';
import StatCard from '../../components/StatCard.jsx';
import { CategoryPie, MonthlyBar } from '../../components/Charts.jsx';
import ExpenseTable from '../../components/ExpenseTable.jsx';
import { currentMonthExpenses, groupByCategory, monthlySeries, staffTotals, totalAmount } from '../../lib/analytics.js';
import { listExpenses, listProfiles } from '../../lib/api.js';
import { currency } from '../../lib/format.js';

export default function OwnerDashboard() {
  const [profiles, setProfiles] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([listProfiles(), listExpenses()])
      .then(([profileData, expenseData]) => {
        setProfiles(profileData);
        setExpenses(expenseData);
      })
      .finally(() => setLoading(false));
  }, []);

  const staff = profiles.filter((profile) => profile.role === 'staff');
  const month = currentMonthExpenses(expenses);
  const categories = groupByCategory(expenses);
  const topStaff = staffTotals(expenses)[0];

  return (
    <div className="space-y-6">
      <PageHeader title="Owner Dashboard" eyebrow="Control Center" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Staff" value={loading ? '...' : staff.length} icon={Users} tone="blue" />
        <StatCard label="Total Expenses" value={currency(totalAmount(expenses))} icon={ReceiptText} />
        <StatCard label="Monthly Expenses" value={currency(totalAmount(month))} icon={CreditCard} tone="amber" />
        <StatCard label="Top Spender" value={topStaff?.name || '-'} detail={topStaff ? currency(topStaff.total) : 'No expenses yet'} icon={TrendingUp} tone="rose" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="card p-5">
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Expense Analytics</h2>
          <MonthlyBar data={monthlySeries(expenses)} />
        </section>
        <section className="card p-5">
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Top Spending Categories</h2>
          <CategoryPie data={categories} />
        </section>
      </div>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Recent Transactions</h2>
        <ExpenseTable expenses={expenses.slice(0, 6)} showStaff />
      </section>
    </div>
  );
}
