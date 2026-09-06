ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.internships TO anon, authenticated;
GRANT ALL ON public.internships TO service_role;
DROP POLICY IF EXISTS "Public can read published internships" ON public.internships;
CREATE POLICY "Public can read published internships" ON public.internships FOR SELECT TO anon, authenticated USING (true);