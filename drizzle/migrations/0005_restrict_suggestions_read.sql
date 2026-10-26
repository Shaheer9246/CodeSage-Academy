-- 1. Tighten base table SELECT: own rows + admins only
DROP POLICY IF EXISTS "Authenticated read suggestion content" ON public.suggestions;
CREATE POLICY "Users read own suggestions, admins read all"
ON public.suggestions FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.is_admin());

-- 2. Recreate the public feed as a security-definer view (owner postgres bypasses RLS),
--    exposing only community-safe columns (no user_id).
CREATE OR REPLACE VIEW public.suggestions_public
WITH (security_invoker = off) AS
SELECT id, username, text, reply, reply_at, created_at, updated_at, upvotes, downvotes,
       public.suggestion_is_mine(id) AS is_mine
FROM public.suggestions s;

ALTER VIEW public.suggestions_public OWNER TO postgres;
GRANT SELECT ON public.suggestions_public TO authenticated;
GRANT SELECT ON public.suggestions_public TO anon;

-- Follow-up from security-patch-2026-09-22: keep the community feed signed-in only
REVOKE SELECT ON public.suggestions_public FROM anon;
GRANT  SELECT ON public.suggestions_public TO authenticated;