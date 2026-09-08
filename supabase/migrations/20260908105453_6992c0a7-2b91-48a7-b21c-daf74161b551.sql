-- Trigger functions: never called directly by clients
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.assign_student_id() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.suggestions_guard() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.sync_suggestion_vote_counts() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- Internal helpers used only inside other definer functions / RLS policies
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.level_for_lessons(integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.suggestion_is_mine(uuid) FROM PUBLIC, anon, authenticated;

-- Keep service_role able to run everything
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.assign_student_id() TO service_role;
GRANT EXECUTE ON FUNCTION public.suggestions_guard() TO service_role;
GRANT EXECUTE ON FUNCTION public.sync_suggestion_vote_counts() TO service_role;
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO service_role;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;
GRANT EXECUTE ON FUNCTION public.level_for_lessons(integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.suggestion_is_mine(uuid) TO service_role;