-- ============ ENUMS ============
create type public.app_role as enum ('owner','admin','manager','employee');
create type public.activity_priority as enum ('low','normal','high','critical');
create type public.notification_status as enum ('unread','read','archived');
create type public.workflow_status as enum ('pending','running','completed','failed','cancelled');
create type public.ai_agent_kind as enum ('chat','voice','whatsapp','instagram','email','document','scheduling');
create type public.ai_agent_status as enum ('draft','training','active','paused','error');
create type public.file_kind as enum ('company_logo','crm_attachment','document','image','ai_file','avatar');

-- ============ COMPANIES ============
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text,
  industry text,
  website text,
  logo_url text,
  locale text not null default 'az',
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.companies to authenticated;
grant all on public.companies to service_role;
alter table public.companies enable row level security;

create table public.company_members (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null default 'employee',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, user_id)
);
grant select, insert, update, delete on public.company_members to authenticated;
grant all on public.company_members to service_role;
alter table public.company_members enable row level security;

-- ============ AUTHZ HELPERS (security definer, no RLS recursion) ============
create or replace function public.is_company_member(_user_id uuid, _company_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.company_members
    where user_id = _user_id and company_id = _company_id
  )
$$;

create or replace function public.has_company_role(_user_id uuid, _company_id uuid, _roles public.app_role[])
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.company_members
    where user_id = _user_id and company_id = _company_id and role = any(_roles)
  )
$$;

create or replace function public.current_company_ids(_user_id uuid)
returns setof uuid language sql stable security definer set search_path = public as $$
  select company_id from public.company_members where user_id = _user_id
$$;

-- companies policies
create policy "Members read their companies" on public.companies
  for select to authenticated using (public.is_company_member(auth.uid(), id));
create policy "Users create companies they own" on public.companies
  for insert to authenticated with check (auth.uid() = owner_id);
create policy "Owners and admins update company" on public.companies
  for update to authenticated
  using (public.has_company_role(auth.uid(), id, array['owner','admin']::public.app_role[]))
  with check (public.has_company_role(auth.uid(), id, array['owner','admin']::public.app_role[]));
create policy "Owners delete company" on public.companies
  for delete to authenticated using (auth.uid() = owner_id);

-- company_members policies
create policy "Members read team" on public.company_members
  for select to authenticated using (public.is_company_member(auth.uid(), company_id));
create policy "Owners and admins add members" on public.company_members
  for insert to authenticated
  with check (public.has_company_role(auth.uid(), company_id, array['owner','admin']::public.app_role[]));
create policy "Owners and admins update members" on public.company_members
  for update to authenticated
  using (public.has_company_role(auth.uid(), company_id, array['owner','admin']::public.app_role[]))
  with check (public.has_company_role(auth.uid(), company_id, array['owner','admin']::public.app_role[]));
create policy "Owners and admins remove members" on public.company_members
  for delete to authenticated
  using (public.has_company_role(auth.uid(), company_id, array['owner','admin']::public.app_role[]));

-- ============ ACTIVITIES ============
create table public.activities (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  type text not null,
  entity_type text,
  entity_id uuid,
  title text not null,
  description text,
  priority public.activity_priority not null default 'normal',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
grant select, insert on public.activities to authenticated;
grant all on public.activities to service_role;
alter table public.activities enable row level security;
create policy "Members read company activities" on public.activities
  for select to authenticated
  using (auth.uid() = user_id or (company_id is not null and public.is_company_member(auth.uid(), company_id)));
create policy "Members write activities" on public.activities
  for insert to authenticated
  with check (auth.uid() = user_id and (company_id is null or public.is_company_member(auth.uid(), company_id)));
create index activities_company_created_idx on public.activities (company_id, created_at desc);
create index activities_user_created_idx on public.activities (user_id, created_at desc);
create index activities_entity_idx on public.activities (entity_type, entity_id);

-- ============ NOTIFICATIONS ============
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company_id uuid references public.companies(id) on delete cascade,
  category text not null,
  title text not null,
  body text,
  priority public.activity_priority not null default 'normal',
  status public.notification_status not null default 'unread',
  entity_type text,
  entity_id uuid,
  link text,
  metadata jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.notifications to authenticated;
grant all on public.notifications to service_role;
alter table public.notifications enable row level security;
create policy "Users read own notifications" on public.notifications
  for select to authenticated using (auth.uid() = user_id);
create policy "Users create own notifications" on public.notifications
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Users update own notifications" on public.notifications
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users delete own notifications" on public.notifications
  for delete to authenticated using (auth.uid() = user_id);
create index notifications_user_status_idx on public.notifications (user_id, status, created_at desc);

-- ============ WORKFLOWS ============
create table public.workflow_runs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  workflow_key text not null,
  trigger_source text,
  status public.workflow_status not null default 'pending',
  input jsonb not null default '{}'::jsonb,
  output jsonb not null default '{}'::jsonb,
  error text,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.workflow_runs to authenticated;
grant all on public.workflow_runs to service_role;
alter table public.workflow_runs enable row level security;
create policy "Members read workflow runs" on public.workflow_runs
  for select to authenticated
  using (auth.uid() = user_id or (company_id is not null and public.is_company_member(auth.uid(), company_id)));
create policy "Members create workflow runs" on public.workflow_runs
  for insert to authenticated
  with check (auth.uid() = user_id and (company_id is null or public.is_company_member(auth.uid(), company_id)));
create policy "Members update own workflow runs" on public.workflow_runs
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index workflow_runs_company_idx on public.workflow_runs (company_id, created_at desc);

create table public.workflow_run_steps (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.workflow_runs(id) on delete cascade,
  step_key text not null,
  label text,
  order_index integer not null default 0,
  status public.workflow_status not null default 'pending',
  output jsonb not null default '{}'::jsonb,
  error text,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.workflow_run_steps to authenticated;
grant all on public.workflow_run_steps to service_role;
alter table public.workflow_run_steps enable row level security;
create policy "Members read workflow steps" on public.workflow_run_steps
  for select to authenticated
  using (exists (select 1 from public.workflow_runs r where r.id = run_id
    and (r.user_id = auth.uid() or (r.company_id is not null and public.is_company_member(auth.uid(), r.company_id)))));
create policy "Members write workflow steps" on public.workflow_run_steps
  for insert to authenticated
  with check (exists (select 1 from public.workflow_runs r where r.id = run_id and r.user_id = auth.uid()));
create policy "Members update workflow steps" on public.workflow_run_steps
  for update to authenticated
  using (exists (select 1 from public.workflow_runs r where r.id = run_id and r.user_id = auth.uid()))
  with check (exists (select 1 from public.workflow_runs r where r.id = run_id and r.user_id = auth.uid()));
create index workflow_run_steps_run_idx on public.workflow_run_steps (run_id, order_index);

-- ============ AI AGENTS ============
create table public.ai_agents (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  name text not null,
  kind public.ai_agent_kind not null default 'chat',
  status public.ai_agent_status not null default 'draft',
  description text,
  language text not null default 'az',
  model text,
  system_prompt text,
  config jsonb not null default '{}'::jsonb,
  channels text[] not null default '{}'::text[],
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.ai_agents to authenticated;
grant all on public.ai_agents to service_role;
alter table public.ai_agents enable row level security;
create policy "Members read agents" on public.ai_agents
  for select to authenticated using (public.is_company_member(auth.uid(), company_id));
create policy "Managers create agents" on public.ai_agents
  for insert to authenticated
  with check (public.has_company_role(auth.uid(), company_id, array['owner','admin','manager']::public.app_role[]));
create policy "Managers update agents" on public.ai_agents
  for update to authenticated
  using (public.has_company_role(auth.uid(), company_id, array['owner','admin','manager']::public.app_role[]))
  with check (public.has_company_role(auth.uid(), company_id, array['owner','admin','manager']::public.app_role[]));
create policy "Admins delete agents" on public.ai_agents
  for delete to authenticated
  using (public.has_company_role(auth.uid(), company_id, array['owner','admin']::public.app_role[]));
create index ai_agents_company_idx on public.ai_agents (company_id, created_at desc);

-- ============ FILES ============
create table public.file_objects (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  bucket text not null,
  path text not null,
  name text not null,
  kind public.file_kind not null default 'document',
  mime_type text,
  size_bytes bigint,
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (bucket, path)
);
grant select, insert, update, delete on public.file_objects to authenticated;
grant all on public.file_objects to service_role;
alter table public.file_objects enable row level security;
create policy "Members read files" on public.file_objects
  for select to authenticated
  using (auth.uid() = user_id or (company_id is not null and public.is_company_member(auth.uid(), company_id)));
create policy "Members upload files" on public.file_objects
  for insert to authenticated
  with check (auth.uid() = user_id and (company_id is null or public.is_company_member(auth.uid(), company_id)));
create policy "Owners delete files" on public.file_objects
  for delete to authenticated
  using (auth.uid() = user_id or (company_id is not null and public.has_company_role(auth.uid(), company_id, array['owner','admin']::public.app_role[])));
create index file_objects_entity_idx on public.file_objects (entity_type, entity_id);
create index file_objects_company_idx on public.file_objects (company_id, created_at desc);

-- ============ LEADS: company scope ============
alter table public.crm_leads add column if not exists company_id uuid references public.companies(id) on delete set null;
alter table public.crm_lead_activities add column if not exists company_id uuid references public.companies(id) on delete set null;
create index if not exists crm_leads_company_idx on public.crm_leads (company_id, created_at desc);

drop policy if exists "Users read own leads" on public.crm_leads;
create policy "Users read own or company leads" on public.crm_leads
  for select to authenticated
  using (auth.uid() = user_id or (company_id is not null and public.is_company_member(auth.uid(), company_id)));
drop policy if exists "Users update own leads" on public.crm_leads;
create policy "Users update own or company leads" on public.crm_leads
  for update to authenticated
  using (auth.uid() = user_id or (company_id is not null and public.is_company_member(auth.uid(), company_id)))
  with check (auth.uid() = user_id or (company_id is not null and public.is_company_member(auth.uid(), company_id)));

drop policy if exists "Users read own lead activities" on public.crm_lead_activities;
create policy "Users read own or company lead activities" on public.crm_lead_activities
  for select to authenticated
  using (auth.uid() = user_id or (company_id is not null and public.is_company_member(auth.uid(), company_id)));

-- ============ TRIGGERS ============
create trigger trg_companies_updated_at before update on public.companies
  for each row execute function public.update_updated_at_column();
create trigger trg_company_members_updated_at before update on public.company_members
  for each row execute function public.update_updated_at_column();
create trigger trg_notifications_updated_at before update on public.notifications
  for each row execute function public.update_updated_at_column();
create trigger trg_workflow_runs_updated_at before update on public.workflow_runs
  for each row execute function public.update_updated_at_column();
create trigger trg_ai_agents_updated_at before update on public.ai_agents
  for each row execute function public.update_updated_at_column();

-- new users get a workspace they own
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  new_company_id uuid;
  display_name text;
begin
  display_name := coalesce(new.raw_user_meta_data->>'full_name', new.email);

  insert into public.profiles (id, full_name)
  values (new.id, display_name)
  on conflict (id) do nothing;

  insert into public.companies (name, owner_id)
  values (coalesce(nullif(new.raw_user_meta_data->>'company', ''), display_name, 'Agentix Workspace'), new.id)
  returning id into new_company_id;

  insert into public.company_members (company_id, user_id, role)
  values (new_company_id, new.id, 'owner')
  on conflict (company_id, user_id) do nothing;

  return new;
end; $$;

-- backfill workspaces for existing users
insert into public.companies (name, owner_id)
select coalesce(nullif(p.full_name, ''), 'Agentix Workspace'), p.id
from public.profiles p
where not exists (select 1 from public.company_members m where m.user_id = p.id);

insert into public.company_members (company_id, user_id, role)
select c.id, c.owner_id, 'owner'
from public.companies c
where not exists (select 1 from public.company_members m where m.company_id = c.id and m.user_id = c.owner_id);