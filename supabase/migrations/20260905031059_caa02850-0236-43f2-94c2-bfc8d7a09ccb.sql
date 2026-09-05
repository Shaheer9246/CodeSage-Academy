DROP POLICY IF EXISTS "badge levels are public" ON public.badge_levels;
REVOKE ALL ON public.badge_levels FROM anon;
GRANT SELECT ON public.badge_levels TO authenticated;
GRANT ALL ON public.badge_levels TO service_role;
CREATE POLICY "Authenticated read badge levels" ON public.badge_levels FOR SELECT TO authenticated USING (true);

REVOKE ALL ON public.user_roles FROM anon;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
DROP POLICY IF EXISTS "Users read own roles" ON public.user_roles;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins read all roles" ON public.user_roles;
CREATE POLICY "Admins read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.is_admin());