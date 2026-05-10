-- 1. Revoke EXECUTE on internal trigger helpers
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- 2. Hide profiles from anon (graphql/REST discovery)
REVOKE SELECT ON public.profiles FROM anon;

-- 3. Column-level UPDATE restriction: only allow safe profile fields
REVOKE UPDATE, INSERT ON public.profiles FROM authenticated, anon;
GRANT UPDATE (username, name, studying, has_job, dob, goal, experience_level, dark_mode)
  ON public.profiles TO authenticated;
GRANT INSERT (id, username) ON public.profiles TO authenticated;

-- 4. RPC: award lesson completion (XP, coins, level, milestone badges)
CREATE OR REPLACE FUNCTION public.award_lesson(_lesson_id text)
RETURNS public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _profile public.profiles;
  _new_count int;
  _badges text[];
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _lesson_id IS NULL OR length(_lesson_id) = 0 OR length(_lesson_id) > 100 THEN
    RAISE EXCEPTION 'Invalid lesson id';
  END IF;

  SELECT * INTO _profile FROM public.profiles WHERE id = auth.uid();
  IF _profile IS NULL THEN RAISE EXCEPTION 'Profile not found'; END IF;

  IF _lesson_id = ANY(COALESCE(_profile.completed_lessons, '{}')) THEN
    RETURN _profile;
  END IF;

  _profile.completed_lessons := array_append(COALESCE(_profile.completed_lessons,'{}'), _lesson_id);
  _profile.xp := COALESCE(_profile.xp, 0) + 50;
  _profile.sage_coins := COALESCE(_profile.sage_coins, 0) + 10;
  _profile.level := (_profile.xp / 200) + 1;
  _new_count := COALESCE(array_length(_profile.completed_lessons, 1), 0);
  _badges := COALESCE(_profile.badges, '{}');

  IF _new_count >= 1 AND NOT 'lite' = ANY(_badges) THEN _badges := array_append(_badges,'lite'); END IF;
  IF _new_count >= 5 AND NOT 'silver' = ANY(_badges) THEN _badges := array_append(_badges,'silver'); END IF;
  IF _new_count >= 15 AND NOT 'gold' = ANY(_badges) THEN _badges := array_append(_badges,'gold'); END IF;
  IF _new_count >= 25 AND NOT 'premium' = ANY(_badges) THEN _badges := array_append(_badges,'premium'); END IF;
  IF _new_count >= 50 AND NOT 'elite' = ANY(_badges) THEN _badges := array_append(_badges,'elite'); END IF;
  _profile.badges := _badges;

  UPDATE public.profiles SET
    completed_lessons = _profile.completed_lessons,
    xp = _profile.xp,
    sage_coins = _profile.sage_coins,
    level = _profile.level,
    badges = _profile.badges
  WHERE id = auth.uid()
  RETURNING * INTO _profile;
  RETURN _profile;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.award_lesson(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.award_lesson(text) TO authenticated;

-- 5. RPC: complete a test
CREATE OR REPLACE FUNCTION public.complete_test(_test_id text)
RETURNS public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _profile public.profiles;
  _badges text[];
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _test_id IS NULL OR length(_test_id) = 0 OR length(_test_id) > 100 THEN
    RAISE EXCEPTION 'Invalid test id';
  END IF;
  SELECT * INTO _profile FROM public.profiles WHERE id = auth.uid();
  IF _profile IS NULL THEN RAISE EXCEPTION 'Profile not found'; END IF;

  _badges := COALESCE(_profile.badges, '{}');
  IF NOT 'test-passer' = ANY(_badges) THEN _badges := array_append(_badges, 'test-passer'); END IF;

  UPDATE public.profiles SET
    completed_tests = ARRAY(SELECT DISTINCT unnest(COALESCE(completed_tests,'{}') || ARRAY[_test_id])),
    badges = _badges
  WHERE id = auth.uid()
  RETURNING * INTO _profile;
  RETURN _profile;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.complete_test(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.complete_test(text) TO authenticated;

-- 6. RPC: update daily streak
CREATE OR REPLACE FUNCTION public.update_streak()
RETURNS public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _profile public.profiles;
  _today date := current_date;
  _last date;
  _new int;
  _badges text[];
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT * INTO _profile FROM public.profiles WHERE id = auth.uid();
  IF _profile IS NULL THEN RAISE EXCEPTION 'Profile not found'; END IF;

  BEGIN
    _last := NULLIF(_profile.last_active_date, '')::timestamptz::date;
  EXCEPTION WHEN OTHERS THEN _last := NULL; END;

  IF _last = _today THEN RETURN _profile; END IF;
  IF _last = _today - 1 THEN _new := COALESCE(_profile.streak_count,0) + 1; ELSE _new := 1; END IF;

  _badges := COALESCE(_profile.badges, '{}');
  IF _new >= 3  AND NOT 'streak-3'  = ANY(_badges) THEN _badges := array_append(_badges,'streak-3');  END IF;
  IF _new >= 7  AND NOT 'streak-7'  = ANY(_badges) THEN _badges := array_append(_badges,'streak-7');  END IF;
  IF _new >= 30 AND NOT 'streak-30' = ANY(_badges) THEN _badges := array_append(_badges,'streak-30'); END IF;

  UPDATE public.profiles SET
    streak_count = _new,
    last_active_date = now()::text,
    badges = _badges
  WHERE id = auth.uid()
  RETURNING * INTO _profile;
  RETURN _profile;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.update_streak() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_streak() TO authenticated;

-- 7. RPC: redeem promo code (codes hidden server-side)
CREATE OR REPLACE FUNCTION public.redeem_promo(_code text)
RETURNS public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _profile public.profiles;
  _sections text[];
  _normalized text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _code IS NULL OR length(_code) > 64 THEN RAISE EXCEPTION 'Invalid code'; END IF;
  _normalized := upper(btrim(_code));

  _sections := CASE _normalized
    WHEN 'BACKEND2024' THEN ARRAY['backend']
    WHEN 'AI2024'      THEN ARRAY['ai']
    WHEN 'FULLACCESS'  THEN ARRAY['backend','ai']
    ELSE NULL
  END;
  IF _sections IS NULL THEN RAISE EXCEPTION 'Invalid promo code'; END IF;

  UPDATE public.profiles SET
    unlocked_sections = ARRAY(SELECT DISTINCT unnest(COALESCE(unlocked_sections,'{}') || _sections)),
    promo_codes       = ARRAY(SELECT DISTINCT unnest(COALESCE(promo_codes,'{}') || ARRAY[_normalized]))
  WHERE id = auth.uid()
  RETURNING * INTO _profile;
  RETURN _profile;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.redeem_promo(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.redeem_promo(text) TO authenticated;