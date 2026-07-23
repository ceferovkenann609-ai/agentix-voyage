
-- contact_requests
CREATE TABLE public.contact_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  locale TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_requests TO anon, authenticated;
GRANT ALL ON public.contact_requests TO service_role;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact requests"
  ON public.contact_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- demo_bookings
CREATE TABLE public.demo_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  service TEXT,
  message TEXT,
  locale TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT demo_bookings_unique_recent UNIQUE (email, service)
);
GRANT INSERT ON public.demo_bookings TO anon, authenticated;
GRANT ALL ON public.demo_bookings TO service_role;
ALTER TABLE public.demo_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit demo bookings"
  ON public.demo_bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- chat_messages
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user','ai')),
  message TEXT NOT NULL,
  locale TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX chat_messages_session_idx ON public.chat_messages(session_id, created_at);
GRANT INSERT ON public.chat_messages TO anon, authenticated;
GRANT ALL ON public.chat_messages TO service_role;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can log chat messages"
  ON public.chat_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
