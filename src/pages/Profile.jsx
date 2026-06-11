import PageHeader from '../components/PageHeader.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { dateTime } from '../lib/format.js';

export default function Profile() {
  const { profile } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" eyebrow="Account" />
      <div className="card p-5">
        <dl className="grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-slate-500 dark:text-slate-400">Full name</dt>
            <dd className="mt-1 font-semibold text-slate-950 dark:text-white">{profile.full_name}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500 dark:text-slate-400">Email</dt>
            <dd className="mt-1 font-semibold text-slate-950 dark:text-white">{profile.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500 dark:text-slate-400">Role</dt>
            <dd className="mt-1 font-semibold capitalize text-slate-950 dark:text-white">{profile.role}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500 dark:text-slate-400">Created at</dt>
            <dd className="mt-1 font-semibold text-slate-950 dark:text-white">{dateTime(profile.created_at)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
