import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { currency } from '../lib/format.js';

const COLORS = ['#059669', '#0284c7', '#f59e0b', '#e11d48', '#7c3aed', '#0f766e', '#475569', '#dc2626'];

export function CategoryPie({ data }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={3}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => currency(value)} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MonthlyBar({ data }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis tickFormatter={(value) => `₹${value / 1000}k`} tickLine={false} axisLine={false} fontSize={12} />
          <Tooltip formatter={(value) => currency(value)} />
          <Bar dataKey="total" fill="#059669" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
