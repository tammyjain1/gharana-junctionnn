alter table public.expenses
  add column if not exists payment_receiver text,
  add column if not exists payment_status text not null default 'unpaid',
  add column if not exists paid_at date;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'expenses_payment_status_check'
  ) then
    alter table public.expenses
      add constraint expenses_payment_status_check
      check (payment_status in ('paid', 'unpaid'));
  end if;
end $$;

create index if not exists expenses_payment_status_idx on public.expenses(payment_status);
