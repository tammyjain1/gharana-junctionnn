import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Loader2, LockKeyhole, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Login() {
  const { session, profile, signIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (session && profile) navigate(profile.role === 'owner' ? '/owner' : '/staff', { replace: true });
  }, [session, profile, navigate]);

  if (session && profile) return <Navigate to={profile.role === 'owner' ? '/owner' : '/staff'} replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Email and password are required');
      return;
    }
    setSubmitting(true);
    try {
      const data = await signIn(form.email, form.password);
      toast.success('Welcome back');
      const role = data.user?.user_metadata?.role || profile?.role;
      navigate(role === 'owner' ? '/owner' : '/', { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative flex min-h-[42vh] items-end overflow-hidden bg-[url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center p-6 sm:p-10 lg:min-h-screen">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20" />
          <div className="relative max-w-2xl pb-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">Staff Expense Management</p>
            <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">Gharana Junction</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-200">
              Track staff spending, approve clean records, and turn daily expenses into owner-ready reports.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center bg-slate-50 px-4 py-8 dark:bg-slate-950">
          <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div>
              <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Sign in</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Use your Supabase Auth email and password.</p>
            </div>
            <div className="mt-6 space-y-4">
              <label className="space-y-1">
                <span className="label">Email</span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    className="input pl-9"
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                    placeholder="owner@gharanajunction.com"
                  />
                </div>
              </label>
              <label className="space-y-1">
                <span className="label">Password</span>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    className="input pl-9"
                    type="password"
                    value={form.password}
                    onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                    placeholder="••••••••"
                  />
                </div>
              </label>
              <button className="btn-primary w-full" type="submit" disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Sign in securely
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
