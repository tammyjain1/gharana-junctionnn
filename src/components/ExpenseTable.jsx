import { Edit, Trash2 } from 'lucide-react';
import { currency, shortDate } from '../lib/format.js';
import EmptyState from './EmptyState.jsx';

export default function ExpenseTable({ expenses, canManage, onEdit, onDelete, showStaff = true }) {
  if (!expenses.length) return <EmptyState title="No expenses found" message="Expense records will appear here." />;

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-900">
            <tr>
              <th className="table-th">Expense ID</th>
              {showStaff && <th className="table-th">Staff Name</th>}
              <th className="table-th">Amount</th>
              <th className="table-th">Category</th>
              <th className="table-th">Description</th>
              <th className="table-th">Date</th>
              {canManage && <th className="table-th">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/70">
                <td className="table-td font-mono text-xs">{expense.id.slice(0, 8)}</td>
                {showStaff && <td className="table-td">{expense.profiles?.full_name || expense.profiles?.email || 'Unknown'}</td>}
                <td className="table-td font-semibold">{currency(expense.amount)}</td>
                <td className="table-td">{expense.category}</td>
                <td className="table-td max-w-xs truncate">{expense.description || '-'}</td>
                <td className="table-td">{shortDate(expense.expense_date)}</td>
                {canManage && (
                  <td className="table-td">
                    <div className="flex gap-2">
                      <button className="btn-secondary h-9 w-9 p-0" type="button" onClick={() => onEdit(expense)} aria-label="Edit expense">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="btn-danger h-9 w-9 p-0" type="button" onClick={() => onDelete(expense)} aria-label="Delete expense">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
