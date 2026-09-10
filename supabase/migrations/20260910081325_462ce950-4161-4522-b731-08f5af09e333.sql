-- Unused SECURITY DEFINER RPCs: no longer callable by signed-in users
REVOKE ALL ON FUNCTION public.mark_announcement_read(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.refresh_daily_xp() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mark_announcement_read(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.refresh_daily_xp() TO service_role;

-- Least privilege on tables reachable by signed-in users
REVOKE ALL ON public.announcements FROM authenticated, anon;
GRANT SELECT ON public.announcements TO authenticated;

REVOKE ALL ON public.enrollments FROM authenticated, anon;
GRANT SELECT ON public.enrollments TO authenticated;

REVOKE ALL ON public.suggestion_reads FROM authenticated, anon;
GRANT SELECT ON public.suggestion_reads TO authenticated;

REVOKE ALL ON public.track_stats FROM authenticated, anon;
GRANT SELECT ON public.track_stats TO authenticated;

REVOKE ALL ON public.announcement_reads FROM authenticated, anon;
GRANT SELECT, INSERT, UPDATE ON public.announcement_reads TO authenticated;

REVOKE ALL ON public.profiles FROM authenticated, anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;

REVOKE ALL ON public.suggestions_public FROM anon;
GRANT SELECT ON public.suggestions_public TO authenticated;

GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
