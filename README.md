# Gharana Junction

Mobile-first staff expense management app built with React, Vite, Tailwind CSS and Supabase.

## Features

- Supabase Auth email/password login with persistent sessions
- Owner and staff role redirects
- Owner dashboard, staff directory, all-expense visibility, reports, PDF export and Excel export
- Staff dashboard, personal profile, own expense CRUD, date filters and summaries
- Supabase PostgreSQL schema with Row Level Security for every permission
- Dark mode, responsive navigation, loading states, validation and toast notifications
- Owner-only Edge Function for creating, editing and removing staff auth users

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Fill `.env`:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

4. Run the database migration in Supabase SQL Editor:

```sql
-- paste supabase/migrations/001_initial_schema.sql
```

5. Create the first owner account in Supabase Auth, then set their role:

```sql
update public.profiles
set role = 'owner', full_name = 'Gharana Owner'
where email = 'owner@gharanajunction.com';
```

6. Deploy the owner-only staff management Edge Function:

```bash
supabase functions deploy admin-staff
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

7. Start the app:

```bash
npm run dev
```

## Database

Main migration: `supabase/migrations/001_initial_schema.sql`

Tables:

- `profiles`: `id`, `email`, `full_name`, `role`, `created_at`
- `expenses`: `id`, `user_id`, `amount`, `category`, `description`, `expense_date`, `created_at`, `updated_at`

RLS guarantees:

- Staff can select, insert, update and delete only their own expenses.
- Staff can view only their own profile.
- Owners can view all profiles and expenses.
- Only owners can insert, update and delete staff profiles.
- Staff administration uses `supabase/functions/admin-staff`, so service role access never reaches the browser.

## Seed Data

Use `supabase/seed.sql` only for development. Create matching Supabase Auth users first, replace the placeholder UUIDs with real Auth user IDs, then run the seed.

## Deployment

Frontend:

```bash
npm run build
```

Deploy the generated `dist` folder to Vercel, Netlify, Cloudflare Pages, or Supabase Hosting. Add the two `VITE_SUPABASE_*` environment variables in the hosting provider.

Supabase:

- Apply `supabase/migrations/001_initial_schema.sql`.
- Deploy `supabase/functions/admin-staff`.
- Set `SUPABASE_SERVICE_ROLE_KEY` as an Edge Function secret.
- Keep the service role key server-side only. Never add it to `.env` for Vite.

## Production Notes

- Turn on email confirmation if your workflow requires it.
- Replace demo passwords immediately.
- Restrict Edge Function CORS to your production domain before launch.
- Add Supabase backups and log drains for production monitoring.
