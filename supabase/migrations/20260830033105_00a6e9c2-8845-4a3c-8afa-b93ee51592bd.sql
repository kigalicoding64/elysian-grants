GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;

DROP POLICY IF EXISTS "published readable" ON public.scholarships;

CREATE POLICY "published scholarships are publicly readable"
ON public.scholarships
FOR SELECT
TO anon, authenticated
USING (status = 'published');

GRANT SELECT ON public.scholarships TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scholarships TO authenticated;
GRANT ALL ON public.scholarships TO service_role;