ALTER TABLE public.scholarships ADD COLUMN IF NOT EXISTS details jsonb;

CREATE TABLE public.sync_candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  university text NOT NULL DEFAULT '',
  country text NOT NULL DEFAULT '',
  degree_levels text[] NOT NULL DEFAULT '{}',
  funding_type text NOT NULL DEFAULT 'full',
  coverage_details text,
  deadline date,
  official_link text NOT NULL,
  source_url text NOT NULL,
  source_group text,
  details jsonb,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (official_link, title)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sync_candidates TO authenticated;
GRANT ALL ON public.sync_candidates TO service_role;
ALTER TABLE public.sync_candidates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage sync candidates" ON public.sync_candidates FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));