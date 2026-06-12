import { endOfMonth, endOfWeek, format, isWithinInterval, parseISO, startOfMonth, startOfWeek } from 'date-fns';

export function totalAmount(expenses) {
  return expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
}

export function unpaidExpenses(expenses) {
  return expenses.filter((expense) => expense.payment_status === 'unpaid');
}

export function paidExpenses(expenses) {
  return expenses.filter((expense) => expense.payment_status === 'paid');
}

export function currentMonthExpenses(expenses) {
  const now = new Date();
  return expenses.filter((expense) => {
    const date = parseISO(expense.expense_date);
    return isWithinInterval(date, { start: startOfMonth(now), end: endOfMonth(now) });
  });
}

export function currentWeekExpenses(expenses) {
  const now = new Date();
  return expenses.filter((expense) => {
    const date = parseISO(expense.expense_date);
    return isWithinInterval(date, { start: startOfWeek(now), end: endOfWeek(now) });
  });
}

export function groupByCategory(expenses) {
  return Object.values(
    expenses.reduce((acc, expense) => {
      const category = expense.category || 'Other';
      acc[category] ??= { name: category, value: 0 };
      acc[category].value += Number(expense.amount || 0);
      return acc;
    }, {}),
  ).sort((a, b) => b.value - a.value);
}

export function monthlySeries(expenses) {
  const buckets = {};
  expenses.forEach((expense) => {
    const key = format(parseISO(expense.expense_date), 'MMM yyyy');
    buckets[key] ??= { month: key, total: 0 };
    buckets[key].total += Number(expense.amount || 0);
  });
  return Object.values(buckets).slice(-12);
}

export function staffTotals(expenses) {
  const buckets = {};
  expenses.forEach((expense) => {
    const name = expense.profiles?.full_name || expense.profiles?.email || 'Unknown';
    buckets[name] ??= { name, total: 0 };
    buckets[name].total += Number(expense.amount || 0);
  });
  return Object.values(buckets).sort((a, b) => b.total - a.total);
}
