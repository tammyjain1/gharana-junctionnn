import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { EXPENSE_CATEGORIES } from '../lib/constants.js';

const initialState = {
  amount: '',
  category: 'Travel',
  description: '',
  expense_date: new Date().toISOString().slice(0, 10),
};

export default function ExpenseForm({ expense, userId, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (expense) {
      setForm({
        amount: expense.amount,
        category: expense.category,
        description: expense.description || '',
        expense_date: expense.expense_date,
      });
    } else {
      setForm(initialState);
    }
  }, [expense]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!Number(form.amount) || Number(form.amount) <= 0) return;
    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        amount: Number(form.amount),
        user_id: userId,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="space-y-1">
        <span className="label">Amount</span>
        <input className="input" type="number" min="1" step="0.01" required value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} />
      </label>
      <label className="space-y-1">
        <span className="label">Category</span>
        <select className="input" value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}>
          {EXPENSE_CATEGORIES.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </label>
      <label className="space-y-1">
        <span className="label">Description</span>
        <textarea className="input min-h-24" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
      </label>
      <label className="space-y-1">
        <span className="label">Date</span>
        <input className="input" type="date" required value={form.expense_date} onChange={(event) => setForm((current) => ({ ...current, expense_date: event.target.value }))} />
      </label>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button className="btn-secondary" type="button" onClick={onCancel}>Cancel</button>
        <button className="btn-primary" type="submit" disabled={submitting}>
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Save expense
        </button>
      </div>
    </form>
  );
}
