import { supabase } from './supabase.js';

export async function getProfile(userId) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) throw error;
  return data;
}

export async function listProfiles() {
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateProfile(id, updates) {
  const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function listExpenses({ from, to, userId } = {}) {
  let query = supabase
    .from('expenses')
    .select('*, profiles:user_id(full_name,email,role)')
    .order('expense_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (from) query = query.gte('expense_date', from);
  if (to) query = query.lte('expense_date', to);
  if (userId) query = query.eq('user_id', userId);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createExpense(payload) {
  const { data, error } = await supabase.from('expenses').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function updateExpense(id, payload) {
  const { data, error } = await supabase.from('expenses').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteExpense(id) {
  const { error } = await supabase.from('expenses').delete().eq('id', id);
  if (error) throw error;
}

export async function adminStaff(action, payload) {
  const { data, error } = await supabase.functions.invoke('admin-staff', {
    body: { action, ...payload },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}
