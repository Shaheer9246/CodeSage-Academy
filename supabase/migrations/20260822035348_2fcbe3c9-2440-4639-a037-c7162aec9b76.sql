REVOKE EXECUTE ON FUNCTION public.award_lesson_v2(text, integer) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.complete_test(text, integer) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.level_for_lessons(integer) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.spend_coins(integer, text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.refresh_daily_xp() FROM anon, public;

GRANT EXECUTE ON FUNCTION public.award_lesson_v2(text, integer) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.complete_test(text, integer) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.level_for_lessons(integer) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.spend_coins(integer, text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.refresh_daily_xp() TO authenticated, service_role;

DROP POLICY IF EXISTS "badge levels are public" ON public.badge_levels;
CREATE POLICY "Authenticated can read badge levels" ON public.badge_levels FOR SELECT TO authenticated USING (true);
REVOKE ALL ON public.badge_levels FROM anon;
GRANT SELECT ON public.badge_levels TO authenticated;
GRANT ALL ON public.badge_levels TO service_role;