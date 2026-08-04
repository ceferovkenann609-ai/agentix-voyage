CREATE TABLE public.crm_leads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  company text,
  email text,
  phone text,
  agent text,
  status text NOT NULL DEFAULT 'new',
  value numeric NOT NULL DEFAULT 0,
  tags text[] NOT NULL DEFAULT '{}',
  notes text,
  archived boolean NOT NULL DEFAULT false,
  last_activity_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_leads TO authenticated;
GRANT ALL ON public.crm_leads TO service_role;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own leads" ON public.crm_leads FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own leads" ON public.crm_leads FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own leads" ON public.crm_leads FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own leads" ON public.crm_leads FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_crm_leads_user_created ON public.crm_leads (user_id, created_at DESC);
CREATE INDEX idx_crm_leads_status ON public.crm_leads (user_id, status);

CREATE TRIGGER trg_crm_leads_updated_at BEFORE UPDATE ON public.crm_leads
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.crm_lead_activities (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id uuid NOT NULL REFERENCES public.crm_leads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_lead_activities TO authenticated;
GRANT ALL ON public.crm_lead_activities TO service_role;
ALTER TABLE public.crm_lead_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own lead activities" ON public.crm_lead_activities FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own lead activities" ON public.crm_lead_activities FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own lead activities" ON public.crm_lead_activities FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_crm_lead_activities_lead ON public.crm_lead_activities (lead_id, created_at DESC);