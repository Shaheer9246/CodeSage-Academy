
-- 1. Roles infrastructure
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin'::public.app_role)
$$;

-- Seed the owner account as admin
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users WHERE email = 'you@gmail.com'
ON CONFLICT DO NOTHING;

-- 2. Rewrite admin RPCs: role-based, no password
DROP FUNCTION IF EXISTS public.admin_list_users(text);
DROP FUNCTION IF EXISTS public.admin_delete_user(text, uuid);
DROP FUNCTION IF EXISTS public.post_announcement(text, text, text);
DROP FUNCTION IF EXISTS public.reply_suggestion(uuid, text, text);
DROP FUNCTION IF EXISTS public.admin_edit_suggestion(uuid, text, text);
DROP FUNCTION IF EXISTS public.admin_delete_suggestion(uuid, text);

CREATE OR REPLACE FUNCTION public.admin_list_users()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _result jsonb;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Admin access required'; END IF;
  SELECT COALESCE(jsonb_agg(row_to_json(t)::jsonb ORDER BY t.created_at DESC), '[]'::jsonb)
  INTO _result
  FROM (
    SELECT p.id, u.email::text AS email, p.username, p.name, p.student_id, p.studying,
      p.has_job, p.dob, p.goal, p.experience_level, p.xp, p.level, p.sage_coins,
      p.streak_count, p.last_active_date, p.badges, p.unlocked_sections, p.promo_codes,
      p.completed_lessons, p.completed_tests,
      COALESCE(array_length(p.completed_lessons, 1), 0) AS lessons_done,
      COALESCE(array_length(p.completed_tests, 1), 0) AS tests_done,
      p.created_at, u.created_at AS joined_at, u.last_sign_in_at, u.email_confirmed_at,
      COALESCE((SELECT jsonb_agg(jsonb_build_object('track', e.track, 'status', e.status, 'enrolled_at', e.enrolled_at) ORDER BY e.enrolled_at)
        FROM public.enrollments e WHERE e.user_id = p.id), '[]'::jsonb) AS enrollments,
      (SELECT count(*) FROM public.suggestions s WHERE s.user_id = p.id) AS suggestions_count
    FROM public.profiles p
    LEFT JOIN auth.users u ON u.id = p.id
  ) t;
  RETURN _result;
END; $$;

CREATE OR REPLACE FUNCTION public.admin_delete_user(_user_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Admin access required'; END IF;
  DELETE FROM public.profiles WHERE id = _user_id;
  DELETE FROM auth.users WHERE id = _user_id;
END; $$;

CREATE OR REPLACE FUNCTION public.post_announcement(_title text, _body text)
RETURNS public.announcements LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _row public.announcements;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Admin access required'; END IF;
  IF _title IS NULL OR length(btrim(_title)) = 0 OR length(_title) > 200 THEN RAISE EXCEPTION 'Invalid title'; END IF;
  IF _body IS NULL OR length(btrim(_body)) = 0 OR length(_body) > 5000 THEN RAISE EXCEPTION 'Invalid body'; END IF;
  INSERT INTO public.announcements(title, body) VALUES (_title, _body) RETURNING * INTO _row;
  RETURN _row;
END; $$;

CREATE OR REPLACE FUNCTION public.reply_suggestion(_id uuid, _reply text)
RETURNS public.suggestions LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _row public.suggestions;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Admin access required'; END IF;
  IF _reply IS NULL OR length(btrim(_reply)) = 0 OR length(_reply) > 1000 THEN RAISE EXCEPTION 'Invalid reply'; END IF;
  UPDATE public.suggestions SET reply = _reply, reply_at = now() WHERE id = _id RETURNING * INTO _row;
  IF _row IS NULL THEN RAISE EXCEPTION 'Suggestion not found'; END IF;
  RETURN _row;
END; $$;

CREATE OR REPLACE FUNCTION public.admin_edit_suggestion(_id uuid, _text text)
RETURNS public.suggestions LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _row public.suggestions;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Admin access required'; END IF;
  IF _text IS NULL OR length(btrim(_text)) = 0 OR length(_text) > 500 THEN RAISE EXCEPTION 'Invalid text'; END IF;
  UPDATE public.suggestions SET text = _text, updated_at = now() WHERE id = _id RETURNING * INTO _row;
  IF _row IS NULL THEN RAISE EXCEPTION 'Suggestion not found'; END IF;
  RETURN _row;
END; $$;

CREATE OR REPLACE FUNCTION public.admin_delete_suggestion(_id uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Admin access required'; END IF;
  DELETE FROM public.suggestions WHERE id = _id;
  RETURN true;
END; $$;

-- 3. Drop the shared-password store
DROP TABLE IF EXISTS public.app_secrets;

-- 4. promo_codes: only reachable through redeem_promo (SECURITY DEFINER)
REVOKE ALL ON public.promo_codes FROM anon, authenticated;
GRANT ALL ON public.promo_codes TO service_role;

-- 5. Fix mutable search_path + revoke anon EXECUTE on all public functions
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT p.oid::regprocedure AS sig, p.prokind
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
  LOOP
    IF r.prokind = 'f' THEN
      EXECUTE format('ALTER FUNCTION %s SET search_path = public', r.sig);
      EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon', r.sig);
      EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated, service_role', r.sig);
    END IF;
  END LOOP;
END $$;
