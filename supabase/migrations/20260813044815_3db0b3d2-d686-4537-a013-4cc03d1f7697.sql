DROP POLICY IF EXISTS "Suggestions are viewable by authenticated users" ON public.suggestions;

CREATE POLICY "Users read own suggestions"
ON public.suggestions FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.is_admin());

CREATE OR REPLACE VIEW public.suggestions_public AS
SELECT
  s.id,
  s.username,
  s.text,
  s.reply,
  s.reply_at,
  s.created_at,
  s.updated_at,
  s.upvotes,
  s.downvotes,
  (auth.uid() = s.user_id) AS is_mine
FROM public.suggestions s;

REVOKE ALL ON public.suggestions_public FROM anon;
GRANT SELECT ON public.suggestions_public TO authenticated;
GRANT ALL ON public.suggestions_public TO service_role;