import { useEffect, useMemo, useState } from 'react';
import { Edit, Loader2, Plus, Search, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { adminStaff, listProfiles } from '../../lib/api.js';
import { dateTime } from '../../lib/format.js';

const blankStaff = { email: '', password: '', full_name: '', role: 'staff' };

export default function StaffDirectory() {
  const [profiles, setProfiles] = useState([]);
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(blankStaff);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setProfiles(await listProfiles());
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const staff = useMemo(() => {
    const term = query.toLowerCase();
    return profiles
      .filter((profile) => profile.role === 'staff')
      .filter((profile) => profile.full_name?.toLowerCase().includes(term) || profile.email?.toLowerCase().includes(term));
  }, [profiles, query]);

  function openCreate() {
    setForm(blankStaff);
    setModal({ type: 'create' });
  }

  function openEdit(profile) {
    setForm({ id: profile.id, email: profile.email, full_name: profile.full_name, role: profile.role, password: '' });
    setModal({ type: 'edit' });
  }

  async function submitStaff(event) {
    event.preventDefault();
    setSaving(true);
    try {
      if (modal.type === 'create') await adminStaff('create', form);
      if (modal.type === 'edit') await adminStaff('update', { id: form.id, full_name: form.full_name, role: form.role, password: form.password || undefined });
      toast.success('Staff record saved');
      setModal(null);
      await load();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function removeStaff(profile) {
    if (!confirm(`Remove ${profile.full_name}? This deletes their auth user and profile.`)) return;
    try {
      await adminStaff('delete', { id: profile.id });
      toast.success('Staff removed');
      await load();
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Staff Members" eyebrow="Owner" actions={<button className="btn-primary" type="button" onClick={openCreate}><Plus className="h-4 w-4" /> Add Staff</button>} />
      <div className="card p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input className="input pl-9" placeholder="Search staff by name or email" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
      </div>
      {loading ? (
        <div className="card p-6 text-sm text-slate-500">Loading staff...</div>
      ) : staff.length ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {staff.map((profile) => (
            <article key={profile.id} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate font-semibold text-slate-950 dark:text-white">{profile.full_name}</h2>
                  <p className="truncate text-sm text-slate-500 dark:text-slate-400">{profile.email}</p>
                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Joined {dateTime(profile.created_at)}</p>
                </div>
                <div className="flex gap-2">
                  <button className="btn-secondary h-9 w-9 p-0" type="button" onClick={() => openEdit(profile)} aria-label="Edit staff"><Edit className="h-4 w-4" /></button>
                  <button className="btn-danger h-9 w-9 p-0" type="button" onClick={() => removeStaff(profile)} aria-label="Remove staff"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="No staff found" message="Add staff members to start tracking expenses." />
      )}

      {modal && (
        <Modal title={modal.type === 'create' ? 'Add Staff Member' : 'Edit Staff Member'} onClose={() => setModal(null)}>
          <form onSubmit={submitStaff} className="space-y-4">
            <label className="space-y-1">
              <span className="label">Full name</span>
              <input className="input" required value={form.full_name} onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))} />
            </label>
            <label className="space-y-1">
              <span className="label">Email</span>
              <input className="input" type="email" required disabled={modal.type === 'edit'} value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
            </label>
            <label className="space-y-1">
              <span className="label">{modal.type === 'create' ? 'Temporary password' : 'New password'}</span>
              <input className="input" type="password" required={modal.type === 'create'} value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
            </label>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button className="btn-secondary" type="button" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn-primary" type="submit" disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin" />} Save</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
