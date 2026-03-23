alter table public.job_applications
add column if not exists archived_at timestamptz;

create index if not exists job_applications_archived_at_idx
on public.job_applications (archived_at);
