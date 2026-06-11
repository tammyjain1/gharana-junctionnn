create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role text not null check (role in ('owner', 'staff')),
  created_at timestamptz not null default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(12, 2) not null check (amount > 0),
  category text not null,
  description text,
  expense_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists expenses_user_id_idx on public.expenses(user_id);
create index if not exists expenses_expense_date_idx on public.expenses(expense_date desc);
create index if not exists profiles_role_idx on public.profiles(role);

create or replace function public.is_owner(user_id uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = user_id and role = 'owner'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'staff')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name,
        role = excluded.role;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists expenses_set_updated_at on public.expenses;
create trigger expenses_set_updated_at
  before update on public.expenses
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.expenses enable row level security;

drop policy if exists "profiles_select_owner_all_or_self" on public.profiles;
create policy "profiles_select_owner_all_or_self"
on public.profiles for select
to authenticated
using (public.is_owner(auth.uid()) or id = auth.uid());

drop policy if exists "profiles_insert_owner_only" on public.profiles;
create policy "profiles_insert_owner_only"
on public.profiles for insert
to authenticated
with check (public.is_owner(auth.uid()));

drop policy if exists "profiles_update_owner_only" on public.profiles;
create policy "profiles_update_owner_only"
on public.profiles for update
to authenticated
using (public.is_owner(auth.uid()))
with check (public.is_owner(auth.uid()));

drop policy if exists "profiles_delete_owner_only" on public.profiles;
create policy "profiles_delete_owner_only"
on public.profiles for delete
to authenticated
using (public.is_owner(auth.uid()) and id <> auth.uid());

drop policy if exists "expenses_select_owner_all_or_own" on public.expenses;
create policy "expenses_select_owner_all_or_own"
on public.expenses for select
to authenticated
using (public.is_owner(auth.uid()) or user_id = auth.uid());

drop policy if exists "expenses_insert_owner_all_or_own" on public.expenses;
create policy "expenses_insert_owner_all_or_own"
on public.expenses for insert
to authenticated
with check (public.is_owner(auth.uid()) or user_id = auth.uid());

drop policy if exists "expenses_update_owner_all_or_own" on public.expenses;
create policy "expenses_update_owner_all_or_own"
on public.expenses for update
to authenticated
using (public.is_owner(auth.uid()) or user_id = auth.uid())
with check (public.is_owner(auth.uid()) or user_id = auth.uid());

drop policy if exists "expenses_delete_owner_all_or_own" on public.expenses;
create policy "expenses_delete_owner_all_or_own"
on public.expenses for delete
to authenticated
using (public.is_owner(auth.uid()) or user_id = auth.uid());
