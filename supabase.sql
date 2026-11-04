-- Run once in the Supabase SQL editor. No participant can grant host access.
create table public.host_accounts (
 user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.host_accounts enable row level security;
revoke all on public.host_accounts from anon, authenticated;
grant select on public.host_accounts to authenticated;
create policy "Hosts can confirm their own access" on public.host_accounts for select to authenticated using (user_id = (select auth.uid()));

create table public.responses (
 user_id uuid primary key references auth.users(id) on delete cascade,
 email text not null check (char_length(email) <= 254),
 name text not null check (char_length(name) between 1 and 100),
 role text not null check (char_length(role) between 1 and 120),
 mood text not null check (mood in ('☀️ Ready-to-go energy','🌱 Quiet optimism','☕ A need for coffee','🌊 Going with the flow')),
 superpower text not null check (char_length(superpower) between 1 and 600),
 outside text not null check (char_length(outside) between 1 and 600),
 wish text not null check (char_length(wish) between 1 and 600),
 updated_at timestamptz not null default now()
);
alter table public.responses enable row level security;
revoke all on public.responses from anon, authenticated;
grant select, insert, update on public.responses to authenticated;
create policy "Read own submission or host results" on public.responses for select to authenticated using (
 user_id = (select auth.uid()) or exists(select 1 from public.host_accounts where user_id = (select auth.uid()))
);
create policy "Submit as verified self" on public.responses for insert to authenticated with check (
 user_id = (select auth.uid()) and email = (select auth.jwt()->>'email')
);
create policy "Update own submission" on public.responses for update to authenticated using (
 user_id = (select auth.uid())
) with check (user_id = (select auth.uid()) and email = (select auth.jwt()->>'email'));

-- AFTER the intended host signs in, replace YOUR_VERIFIED_EMAIL below and run:
-- insert into public.host_accounts(user_id)
-- select id from auth.users where lower(email) = lower('YOUR_VERIFIED_EMAIL') and email_confirmed_at is not null;
