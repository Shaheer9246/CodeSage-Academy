-- 1. Announcements: admin-only updates
DROP POLICY IF EXISTS "Allow update for announcements" ON public.announcements;
CREATE POLICY "Admins can update announcements"
ON public.announcements FOR UPDATE TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 2. Fix mutable search_path
CREATE OR REPLACE FUNCTION public.admin_delete_user(_user_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Admin access required'; END IF;
  DELETE FROM auth.sessions WHERE user_id = _user_id;
  DELETE FROM auth.refresh_tokens WHERE user_id = _user_id::text;
  DELETE FROM auth.users WHERE id = _user_id;
END;
$function$;

-- 3. Security invoker view for suggestions feed
CREATE OR REPLACE FUNCTION public.suggestion_is_mine(_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT EXISTS (SELECT 1 FROM public.suggestions s WHERE s.id = _id AND s.user_id = auth.uid())
$$;
REVOKE ALL ON FUNCTION public.suggestion_is_mine(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.suggestion_is_mine(uuid) TO authenticated, service_role;

DROP VIEW IF EXISTS public.suggestions_public;
CREATE VIEW public.suggestions_public WITH (security_invoker = on) AS
SELECT s.id, s.username, s.text, s.reply, s.reply_at, s.created_at, s.updated_at,
       s.upvotes, s.downvotes, public.suggestion_is_mine(s.id) AS is_mine
FROM public.suggestions s;

-- authenticated members can read the feed, but not the author user_id column
DROP POLICY IF EXISTS "Users read own suggestions" ON public.suggestions;
CREATE POLICY "Authenticated read suggestion content"
ON public.suggestions FOR SELECT TO authenticated USING (true);

REVOKE SELECT ON public.suggestions FROM authenticated;
GRANT SELECT (id, username, text, reply, reply_at, created_at, updated_at, upvotes, downvotes)
  ON public.suggestions TO authenticated;
GRANT SELECT ON public.suggestions_public TO authenticated;
GRANT ALL ON public.suggestions TO service_role;
GRANT SELECT ON public.suggestions_public TO service_role;

-- 4. No anonymous exposure anywhere in public schema
REVOKE SELECT ON ALL TABLES IN SCHEMA public FROM anon;
