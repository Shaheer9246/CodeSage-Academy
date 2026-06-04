
-- 1. Column-level: revoke gamification column updates from authenticated users
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (username, name, studying, has_job, dob, goal, experience_level, dark_mode, has_seen_tour)
  ON public.profiles TO authenticated;

-- 2. Revoke anon access on public tables (all access is authenticated-only)
REVOKE ALL ON public.profiles FROM anon;
REVOKE ALL ON public.suggestions FROM anon;

-- 3. Revoke EXECUTE on SECURITY DEFINER RPCs from anon and public
REVOKE EXECUTE ON FUNCTION public.award_lesson(text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.complete_test(text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.update_streak() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.redeem_promo(text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.reply_suggestion(uuid, text, text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.admin_edit_suggestion(uuid, text, text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.admin_delete_suggestion(uuid, text) FROM anon, public;

GRANT EXECUTE ON FUNCTION public.award_lesson(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.complete_test(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_streak() TO authenticated;
GRANT EXECUTE ON FUNCTION public.redeem_promo(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reply_suggestion(uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_edit_suggestion(uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_suggestion(uuid, text) TO authenticated;
