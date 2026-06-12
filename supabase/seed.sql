-- Development seed data.
-- Create matching Auth users first in Supabase Auth, then replace these UUIDs with their user IDs.
-- Recommended demo accounts:
-- owner@gharanajunction.com / ChangeMeOwner123!
-- priya@gharanajunction.com / ChangeMeStaff123!
-- arjun@gharanajunction.com / ChangeMeStaff123!

insert into public.profiles (id, email, full_name, role)
values
  ('00000000-0000-0000-0000-000000000001', 'owner@gharanajunction.com', 'Gharana Owner', 'owner'),
  ('00000000-0000-0000-0000-000000000002', 'priya@gharanajunction.com', 'Priya Sharma', 'staff'),
  ('00000000-0000-0000-0000-000000000003', 'arjun@gharanajunction.com', 'Arjun Mehta', 'staff')
on conflict (id) do update
set email = excluded.email,
    full_name = excluded.full_name,
    role = excluded.role;

insert into public.expenses (user_id, amount, category, description, expense_date, payment_receiver, payment_status, paid_at)
values
  ('00000000-0000-0000-0000-000000000002', 850.00, 'Travel', 'Local delivery travel', current_date - interval '1 day', 'Auto driver', 'paid', current_date - interval '1 day'),
  ('00000000-0000-0000-0000-000000000002', 420.00, 'Meals', 'Client meeting refreshments', current_date - interval '2 days', 'Cafe vendor', 'unpaid', null),
  ('00000000-0000-0000-0000-000000000003', 1600.00, 'Inventory', 'Emergency stock purchase', current_date - interval '5 days', 'Wholesale supplier', 'unpaid', null),
  ('00000000-0000-0000-0000-000000000003', 700.00, 'Fuel', 'Market pickup fuel', current_date - interval '10 days', 'Fuel pump', 'paid', current_date - interval '10 days');
