
-- Rename existing tables to production names
ALTER TABLE public.contact_requests RENAME TO contact_submissions;
ALTER TABLE public.chat_messages RENAME TO ai_chat_messages;

-- Add updated_at columns
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.demo_bookings ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.ai_chat_messages ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Foreign keys to auth.users (nullable, guest submissions allowed)
DO $$ BEGIN
  ALTER TABLE public.contact_submissions
    ADD CONSTRAINT contact_submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.demo_bookings
    ADD CONSTRAINT demo_bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.ai_chat_messages
    ADD CONSTRAINT ai_chat_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_contact_submissions_user_id ON public.contact_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON public.contact_submissions(email);

CREATE INDEX IF NOT EXISTS idx_demo_bookings_user_id ON public.demo_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_demo_bookings_created_at ON public.demo_bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_demo_bookings_email ON public.demo_bookings(email);

CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_user_id ON public.ai_chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_session_id ON public.ai_chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_created_at ON public.ai_chat_messages(created_at DESC);

-- Updated_at trigger reuse
CREATE TRIGGER trg_contact_submissions_updated_at BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_demo_bookings_updated_at BEFORE UPDATE ON public.demo_bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_ai_chat_messages_updated_at BEFORE UPDATE ON public.ai_chat_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Update existing RLS policy names to reflect renamed tables (drop old, recreate)
DROP POLICY IF EXISTS "Anyone can submit contact requests" ON public.contact_submissions;
DROP POLICY IF EXISTS "Users read own contact requests" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact submissions" ON public.contact_submissions
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Users read own contact submissions" ON public.contact_submissions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can log chat messages" ON public.ai_chat_messages;
DROP POLICY IF EXISTS "Users read own chat messages" ON public.ai_chat_messages;
CREATE POLICY "Anyone can log ai chat messages" ON public.ai_chat_messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Users read own ai chat messages" ON public.ai_chat_messages
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Newsletter subscribers
CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  locale text,
  source text,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;
GRANT SELECT ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Users read own newsletter subscription" ON public.newsletter_subscribers
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);

CREATE TRIGGER trg_newsletter_subscribers_updated_at BEFORE UPDATE ON public.newsletter_subscribers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
