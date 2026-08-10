-- ============ API KEYS ============
create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  name text not null,
  key_prefix text not null,
  key_hash text not null,
  scopes text[] not null default '{}',
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists api_keys_company_idx on public.api_keys(company_id);
create unique index if not exists api_keys_hash_idx on public.api_keys(key_hash);

grant select, insert, update, delete on public.api_keys to authenticated;
grant all on public.api_keys to service_role;

alter table public.api_keys enable row level security;

create policy "Members read api keys"
  on public.api_keys for select to authenticated
  using (public.is_company_member(auth.uid(), company_id));

create policy "Managers create api keys"
  on public.api_keys for insert to authenticated
  with check (public.has_company_role(auth.uid(), company_id, array['owner','admin','manager']::app_role[]));

create policy "Managers update api keys"
  on public.api_keys for update to authenticated
  using (public.has_company_role(auth.uid(), company_id, array['owner','admin','manager']::app_role[]));

create policy "Admins delete api keys"
  on public.api_keys for delete to authenticated
  using (public.has_company_role(auth.uid(), company_id, array['owner','admin']::app_role[]));

create trigger trg_api_keys_updated_at before update on public.api_keys
  for each row execute function public.update_updated_at_column();

-- ============ BILLING ============
create table if not exists public.billing_subscriptions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  plan text not null,
  status text not null default 'inactive',
  provider text,
  provider_subscription_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists billing_subscriptions_company_idx
  on public.billing_subscriptions(company_id);

grant select, insert, update, delete on public.billing_subscriptions to authenticated;
grant all on public.billing_subscriptions to service_role;

alter table public.billing_subscriptions enable row level security;

create policy "Members read subscription"
  on public.billing_subscriptions for select to authenticated
  using (public.is_company_member(auth.uid(), company_id));

create policy "Admins manage subscription insert"
  on public.billing_subscriptions for insert to authenticated
  with check (public.has_company_role(auth.uid(), company_id, array['owner','admin']::app_role[]));

create policy "Admins manage subscription update"
  on public.billing_subscriptions for update to authenticated
  using (public.has_company_role(auth.uid(), company_id, array['owner','admin']::app_role[]));

create trigger trg_billing_subscriptions_updated_at before update on public.billing_subscriptions
  for each row execute function public.update_updated_at_column();

create table if not exists public.billing_invoices (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  subscription_id uuid references public.billing_subscriptions(id) on delete set null,
  number text,
  amount numeric not null default 0,
  currency text not null default 'USD',
  status text not null default 'draft',
  issued_at timestamptz,
  due_at timestamptz,
  paid_at timestamptz,
  hosted_invoice_url text,
  pdf_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists billing_invoices_company_idx
  on public.billing_invoices(company_id, issued_at desc);

grant select, insert, update, delete on public.billing_invoices to authenticated;
grant all on public.billing_invoices to service_role;

alter table public.billing_invoices enable row level security;

create policy "Members read invoices"
  on public.billing_invoices for select to authenticated
  using (public.is_company_member(auth.uid(), company_id));

create policy "Admins insert invoices"
  on public.billing_invoices for insert to authenticated
  with check (public.has_company_role(auth.uid(), company_id, array['owner','admin']::app_role[]));

create policy "Admins update invoices"
  on public.billing_invoices for update to authenticated
  using (public.has_company_role(auth.uid(), company_id, array['owner','admin']::app_role[]));

create trigger trg_billing_invoices_updated_at before update on public.billing_invoices
  for each row execute function public.update_updated_at_column();

-- ============ REALTIME ============
alter table public.crm_leads replica identity full;
alter table public.crm_lead_activities replica identity full;
alter table public.demo_bookings replica identity full;
alter table public.notifications replica identity full;
alter table public.activities replica identity full;
alter table public.ai_chat_messages replica identity full;
alter table public.ai_agents replica identity full;

do $$
declare t text;
begin
  foreach t in array array[
    'crm_leads','crm_lead_activities','demo_bookings','notifications',
    'activities','ai_chat_messages','ai_agents'
  ]
  loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;