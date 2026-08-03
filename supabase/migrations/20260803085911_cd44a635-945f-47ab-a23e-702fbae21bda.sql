REVOKE ALL ON public.suggestion_votes FROM anon;
REVOKE ALL ON public.track_stats FROM anon;
DROP POLICY IF EXISTS "Anyone can read track stats" ON public.track_stats;
CREATE POLICY "Authenticated can read track stats" ON public.track_stats FOR SELECT TO authenticated USING (true);
GRANT SELECT ON public.track_stats TO authenticated;
GRANT SELECT ON public.suggestion_votes TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.suggestion_votes TO authenticated;