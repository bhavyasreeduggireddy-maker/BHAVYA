-- Run this in Supabase SQL Editor to enable the unauthenticated API used by
-- CampusPulse. This intentionally makes event data and registration rows
-- publicly readable, and permits anonymous registration inserts.
-- Attendee email addresses are not exposed by the API roster endpoint.

grant usage on schema public to anon;

grant select on table public.events to anon;
grant select, insert on table public.registrations to anon;

alter table public.events enable row level security;
alter table public.registrations enable row level security;

drop policy if exists "Public can read events" on public.events;
create policy "Public can read events"
on public.events
for select
to anon
using (true);

drop policy if exists "Public can read registrations" on public.registrations;
create policy "Public can read registrations"
on public.registrations
for select
to anon
using (true);

drop policy if exists "Public can create registrations" on public.registrations;
create policy "Public can create registrations"
on public.registrations
for insert
to anon
with check (true);
