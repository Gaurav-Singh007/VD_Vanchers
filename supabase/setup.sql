-- Create leads table for contact form
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT,
  source TEXT DEFAULT 'contact-form',
  status TEXT DEFAULT 'new',
  qualified BOOLEAN DEFAULT FALSE
);

-- Enable RLS & Allow public insert
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert to leads" ON public.leads;

CREATE POLICY "Allow public insert to leads" 
ON public.leads FOR INSERT 
TO anon 
WITH CHECK (true);