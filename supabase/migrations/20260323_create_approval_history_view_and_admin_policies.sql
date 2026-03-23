alter table if exists public.approval_history enable row level security;

drop view if exists public.approval_history_with_dates;

create view public.approval_history_with_dates as
select
  ah.id,
  ah.application_id,
  ah.applicant_name,
  ah.applicant_email,
  ah.role,
  ah.decision,
  ah.archived_at,
  ah.decided_at,
  ah.decided_by,
  ja.created_at as account_created_at
from public.approval_history ah
left join public.job_applications ja
  on ja.id = ah.application_id;

drop policy if exists "Admins can read approval history" on public.approval_history;
create policy "Admins can read approval history"
on public.approval_history
for select
using (
  exists (
    select 1
    from public.users
    where lower(public.users.email) = lower(auth.jwt() ->> 'email')
      and public.users.role = 'Admin'
  )
);

drop policy if exists "Admins can insert approval history" on public.approval_history;
create policy "Admins can insert approval history"
on public.approval_history
for insert
with check (
  exists (
    select 1
    from public.users
    where lower(public.users.email) = lower(auth.jwt() ->> 'email')
      and public.users.role = 'Admin'
  )
);

drop policy if exists "Admins can update approval history" on public.approval_history;
create policy "Admins can update approval history"
on public.approval_history
for update
using (
  exists (
    select 1
    from public.users
    where lower(public.users.email) = lower(auth.jwt() ->> 'email')
      and public.users.role = 'Admin'
  )
)
with check (
  exists (
    select 1
    from public.users
    where lower(public.users.email) = lower(auth.jwt() ->> 'email')
      and public.users.role = 'Admin'
  )
);
