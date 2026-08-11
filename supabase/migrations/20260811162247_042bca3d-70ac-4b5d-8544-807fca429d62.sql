CREATE OR REPLACE FUNCTION public.admin_list_users(_password text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _admin_pw text;
  _result jsonb;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT value INTO _admin_pw FROM public.app_secrets WHERE key = 'admin_password';
  IF _admin_pw IS NULL OR _password IS NULL OR _password <> _admin_pw THEN
    RAISE EXCEPTION 'Invalid admin password';
  END IF;

  SELECT COALESCE(jsonb_agg(row_to_json(t)::jsonb ORDER BY t.created_at DESC), '[]'::jsonb)
  INTO _result
  FROM (
    SELECT
      p.id,
      u.email::text                              AS email,
      p.username,
      p.name,
      p.student_id,
      p.studying,
      p.has_job,
      p.dob,
      p.goal,
      p.experience_level,
      p.xp,
      p.level,
      p.sage_coins,
      p.streak_count,
      p.last_active_date,
      p.badges,
      p.unlocked_sections,
      p.promo_codes,
      p.completed_lessons,
      p.completed_tests,
      COALESCE(array_length(p.completed_lessons, 1), 0) AS lessons_done,
      COALESCE(array_length(p.completed_tests, 1), 0)   AS tests_done,
      p.created_at,
      u.created_at                               AS joined_at,
      u.last_sign_in_at,
      u.email_confirmed_at,
      COALESCE((
        SELECT jsonb_agg(jsonb_build_object('track', e.track, 'status', e.status, 'enrolled_at', e.enrolled_at) ORDER BY e.enrolled_at)
        FROM public.enrollments e WHERE e.user_id = p.id
      ), '[]'::jsonb)                            AS enrollments,
      (SELECT count(*) FROM public.suggestions s WHERE s.user_id = p.id) AS suggestions_count
    FROM public.profiles p
    LEFT JOIN auth.users u ON u.id = p.id
  ) t;

  RETURN _result;
END;
$function$;

REVOKE ALL ON FUNCTION public.admin_list_users(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_users(text) TO authenticated;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'suggestions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.suggestions;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'announcements'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;
  END IF;
END
$$;

ALTER TABLE public.suggestions REPLICA IDENTITY FULL;
ALTER TABLE public.announcements REPLICA IDENTITY FULL;