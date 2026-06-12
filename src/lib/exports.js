import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { currency, shortDate } from './format.js';

function reportRows(expenses) {
  return expenses.map((expense) => ({
    'Expense ID': expense.id,
    'Staff Name': expense.profiles?.full_name || expense.profiles?.email || 'Me',
    Amount: Number(expense.amount || 0),
    Category: expense.category,
    Description: expense.description || '',
    Date: shortDate(expense.expense_date),
    'Created At': shortDate(expense.created_at),
    'Updated At': shortDate(expense.updated_at),
    'Payment Receiver': expense.payment_receiver || '',
    'Payment Status': expense.payment_status || 'unpaid',
    'Paid At': shortDate(expense.paid_at),
  }));
}

export function exportExpensesPdf(expenses, title = 'Gharana Junction Expense Report') {
  const doc = new jsPDF({ orientation: 'landscape' });
  doc.setFontSize(16);
  doc.text(title, 14, 16);
  autoTable(doc, {
    startY: 24,
    head: [['Expense ID', 'Staff Name', 'Amount', 'Category', 'Description', 'Date', 'Payment Receiver', 'Payment Status', 'Paid At']],
    body: reportRows(expenses).map((row) => [
      row['Expense ID'],
      row['Staff Name'],
      currency(row.Amount),
      row.Category,
      row.Description,
      row.Date,
      row['Payment Receiver'],
      row['Payment Status'],
      row['Paid At'],
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [5, 150, 105] },
  });
  doc.save('gharana-junction-expenses.pdf');
}

function escapeCell(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function exportExpensesExcel(expenses) {
  const rows = reportRows(expenses);
  const headers = ['Expense ID', 'Staff Name', 'Amount', 'Category', 'Description', 'Date', 'Payment Receiver', 'Payment Status', 'Paid At', 'Created At', 'Updated At'];
  const html = `
    <html>
      <head><meta charset="UTF-8" /></head>
      <body>
        <table>
          <thead><tr>${headers.map((header) => `<th>${escapeCell(header)}</th>`).join('')}</tr></thead>
          <tbody>
            ${rows
              .map((row) => `<tr>${headers.map((header) => `<td>${escapeCell(row[header])}</td>`).join('')}</tr>`)
              .join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;
  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'gharana-junction-expenses.xls';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
