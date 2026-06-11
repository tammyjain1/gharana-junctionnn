import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BarChart3, FileText, Home, LogOut, Menu, Moon, ReceiptText, Sun, User, Users, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { initials } from '../lib/format.js';

const ownerNav = [
  { to: '/owner', label: 'Dashboard', icon: Home, end: true },
  { to: '/owner/staff', label: 'Staff', icon: Users },
  { to: '/owner/expenses', label: 'Expenses', icon: ReceiptText },
  { to: '/owner/reports', label: 'Reports', icon: BarChart3 },
  { to: '/owner/profile', label: 'Profile', icon: User },
];

const staffNav = [
  { to: '/staff', label: 'Dashboard', icon: Home, end: true },
  { to: '/staff/expenses', label: 'My Expenses', icon: FileText },
  { to: '/staff/profile', label: 'Profile', icon: User },
];

function NavItems({ items, onNavigate }) {
  return (
    <nav className="grid gap-1">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
              isActive
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
            }`
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function AppLayout() {
  const { profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const navItems = profile?.role === 'owner' ? ownerNav : staffNav;

  async function handleLogout() {
    await signOut();
    toast.success('Signed out');
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 lg:block">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-600 text-lg font-black text-white">GJ</div>
          <div>
            <p className="font-bold text-slate-950 dark:text-white">Gharana Junction</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Expense Management</p>
          </div>
        </div>
        <div className="mt-6">
          <NavItems items={navItems} />
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
          <div className="flex items-center justify-between gap-3">
            <button className="btn-secondary h-10 w-10 p-0 lg:hidden" type="button" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">{profile?.full_name || profile?.email}</p>
              <p className="text-xs capitalize text-slate-500 dark:text-slate-400">{profile?.role}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button className="btn-secondary h-10 w-10 p-0" type="button" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <div className="hidden h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-100 sm:flex">
                {initials(profile?.full_name || profile?.email)}
              </div>
              <button className="btn-secondary h-10 w-10 p-0" type="button" onClick={handleLogout} aria-label="Logout">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-950/50" onClick={() => setOpen(false)} />
          <div className="relative h-full w-80 max-w-[86vw] bg-white p-4 shadow-soft dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 font-black text-white">GJ</div>
                <span className="font-bold">Gharana Junction</span>
              </div>
              <button className="btn-secondary h-9 w-9 p-0" type="button" onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-6">
              <NavItems items={navItems} onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
