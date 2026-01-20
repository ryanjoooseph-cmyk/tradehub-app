-- Disputes table
create table if not exists public.disputes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  job_id text null,
  invoice_id text null,
  reason text null,
  status text not null default 'open'
);

-- Useful indexes
create index if not exists disputes_created_at_idx on public.disputes (created_at desc);
create index if not exists disputes_status_idx on public.disputes (status);

-- If you rely on service role key via getAdminClient(), RLS isn't required.
-- If you want RLS later, enable it + add policies.
