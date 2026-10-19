DROP POLICY IF EXISTS "badge levels are public" ON public.badge_levels;
REVOKE SELECT ON public.badge_levels FROM anon;
GRANT SELECT ON public.badge_levels TO authenticated;
CREATE POLICY "Signed-in users read badge levels" ON public.badge_levels FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);