REVOKE ALL ON public.badge_levels FROM authenticated, anon;
REVOKE ALL ON public.user_roles FROM authenticated, anon;
GRANT ALL ON public.badge_levels TO service_role;
GRANT ALL ON public.user_roles TO service_role;