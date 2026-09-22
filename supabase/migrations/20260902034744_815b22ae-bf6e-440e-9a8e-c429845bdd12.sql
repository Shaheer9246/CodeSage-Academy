CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_user_id ON public.suggestions(user_id);

CREATE OR REPLACE FUNCTION public.admin_list_users(_search text DEFAULT NULL, _limit integer DEFAULT 50, _offset integer DEFAULT 0)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE _result jsonb; _q text;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Admin access required'; END IF;
  _limit := LEAST(GREATEST(COALESCE(_limit, 50), 1), 200);
  _offset := GREATEST(COALESCE(_offset, 0), 0);
  _q := NULLIF(btrim(COALESCE(_search, '')), '');

  SELECT COALESCE(jsonb_agg(row_to_json(t)::jsonb), '[]'::jsonb)
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
    WHERE _q IS NULL
       OR p.username ILIKE '%' || _q || '%'
       OR p.name ILIKE '%' || _q || '%'
       OR p.student_id ILIKE '%' || _q || '%'
       OR u.email ILIKE '%' || _q || '%'
    ORDER BY p.created_at DESC
    LIMIT _limit OFFSET _offset
  ) t;
  RETURN _result;
END; $function$;

REVOKE ALL ON FUNCTION public.admin_list_users(text, integer, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_users(text, integer, integer) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.admin_user_count(_search text DEFAULT NULL)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE _n integer; _q text;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Admin access required'; END IF;
  _q := NULLIF(btrim(COALESCE(_search, '')), '');
  SELECT count(*) INTO _n
  FROM public.profiles p LEFT JOIN auth.users u ON u.id = p.id
  WHERE _q IS NULL
     OR p.username ILIKE '%' || _q || '%'
     OR p.name ILIKE '%' || _q || '%'
     OR p.student_id ILIKE '%' || _q || '%'
     OR u.email ILIKE '%' || _q || '%';
  RETURN _n;
END; $function$;

REVOKE ALL ON FUNCTION public.admin_user_count(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_user_count(text) TO authenticated, service_role;

DROP FUNCTION IF EXISTS public.admin_list_users();