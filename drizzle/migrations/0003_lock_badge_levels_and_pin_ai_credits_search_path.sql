-- Pin search_path on the SECURITY DEFINER AI-credit function so caller-created
-- objects in the search path cannot be resolved with owner privileges.
ALTER FUNCTION public.deduct_user_ai_credits(uuid, integer) SET search_path = '';

-- badge_levels is internal reference data consumed only by SECURITY DEFINER
-- functions (level_for_lessons); no client reads it directly. Drop the
-- authenticated-wide read policy and grants.
DROP POLICY IF EXISTS "Signed-in users read badge levels" ON public.badge_levels;
REVOKE ALL ON public.badge_levels FROM anon;
REVOKE ALL ON public.badge_levels FROM authenticated;