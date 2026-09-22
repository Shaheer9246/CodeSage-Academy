REVOKE SELECT ON public.lesson_registry FROM authenticated;
REVOKE SELECT ON public.test_registry FROM authenticated;
REVOKE SELECT ON public.badge_levels FROM authenticated;
REVOKE SELECT ON public.user_roles FROM authenticated;

DROP POLICY IF EXISTS "Authenticated can read lesson registry" ON public.lesson_registry;
DROP POLICY IF EXISTS "Authenticated can read test registry" ON public.test_registry;
DROP POLICY IF EXISTS "Authenticated can read badge levels" ON public.badge_levels;
DROP POLICY IF EXISTS "badge levels are public" ON public.badge_levels;
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;

GRANT ALL ON public.lesson_registry TO service_role;
GRANT ALL ON public.test_registry TO service_role;
GRANT ALL ON public.badge_levels TO service_role;
GRANT ALL ON public.user_roles TO service_role;