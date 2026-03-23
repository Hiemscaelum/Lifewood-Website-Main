alter table if exists public.users enable row level security;

drop policy if exists "Admins can read users" on public.users;
create policy "Admins can read users"
on public.users
for select
using (
  exists (
    select 1
    from public.users as admin_user
    where lower(admin_user.email) = lower(auth.jwt() ->> 'email')
      and admin_user.role = 'Admin'
  )
);

drop policy if exists "Admins can insert users" on public.users;
create policy "Admins can insert users"
on public.users
for insert
with check (
  exists (
    select 1
    from public.users as admin_user
    where lower(admin_user.email) = lower(auth.jwt() ->> 'email')
      and admin_user.role = 'Admin'
  )
);

drop policy if exists "Admins can update users" on public.users;
create policy "Admins can update users"
on public.users
for update
using (
  exists (
    select 1
    from public.users as admin_user
    where lower(admin_user.email) = lower(auth.jwt() ->> 'email')
      and admin_user.role = 'Admin'
  )
)
with check (
  exists (
    select 1
    from public.users as admin_user
    where lower(admin_user.email) = lower(auth.jwt() ->> 'email')
      and admin_user.role = 'Admin'
  )
);

do $$
begin
  if not exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and tablename = 'users'
      and indexname = 'users_email_unique_idx'
  ) then
    if not exists (
      select email
      from public.users
      where email is not null
      group by email
      having count(*) > 1
    ) then
      execute 'create unique index users_email_unique_idx on public.users (email)';
    else
      raise notice 'Skipped unique index on public.users(email) because duplicate emails already exist.';
    end if;
  end if;
end
$$;
