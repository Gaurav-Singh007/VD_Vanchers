/*
# Create leads table for VD Vanchers farmhouse landing page

1. New Tables
- `leads`
  - `id` (uuid, primary key)
  - `name` (text, not null) — visitor's full name
  - `phone` (text, not null) — visitor's phone number
  - `email` (text, nullable) — visitor's email
  - `message` (text, nullable) — optional message from visitor
  - `source` (text, default 'website') — where the lead came from
  - `status` (text, default 'new') — lead status: new, contacted, qualified, closed
  - `qualified` (boolean, default false) — whether AI chat qualified this lead
  - `budget` (text, nullable) — budget range if captured
  - `timeline` (text, nullable) — purchase timeline if captured
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `leads`.
- This is a single-tenant landing page with no sign-in — allow anon + authenticated CRUD
  so the anon-key frontend can submit leads and the owner can view them via Supabase dashboard.
- SELECT and INSERT open to anon (visitors submit leads; owner reads via dashboard).
- UPDATE and DELETE open to anon + authenticated for status management.

3. Notes
- No user_id column — this is a single-tenant marketing site, not a multi-user app.
- The owner manages leads directly via Supabase dashboard or external CRM integration.
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  message text,
  source text NOT NULL DEFAULT 'website',
  status text NOT NULL DEFAULT 'new',
  qualified boolean NOT NULL DEFAULT false,
  budget text,
  timeline text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_leads" ON leads;
CREATE POLICY "anon_select_leads" ON leads FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_leads" ON leads;
CREATE POLICY "anon_insert_leads" ON leads FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_leads" ON leads;
CREATE POLICY "anon_update_leads" ON leads FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_leads" ON leads;
CREATE POLICY "anon_delete_leads" ON leads FOR DELETE
  TO anon, authenticated USING (true);
