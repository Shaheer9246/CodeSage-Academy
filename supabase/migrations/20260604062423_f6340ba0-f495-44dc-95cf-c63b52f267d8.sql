
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS streak_freeze_until date;
GRANT UPDATE (username, name, studying, has_job, dob, goal, experience_level, dark_mode, has_seen_tour)
  ON public.profiles TO authenticated;

CREATE OR REPLACE FUNCTION public.award_lesson(_lesson_id text)
 RETURNS profiles
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
  _profile.xp := COALESCE(_profile.xp, 0) + 5;
  _profile.sage_coins := COALESCE(_profile.sage_coins, 0) + 2;
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
    xp = _profile.xp, sage_coins = _profile.sage_coins,
    level = _profile.level, badges = _profile.badges
  WHERE id = auth.uid()
  RETURNING * INTO _profile;
  RETURN _profile;
END;
$function$;

CREATE OR REPLACE FUNCTION public.buy_freeze_streak()
 RETURNS profiles
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _profile public.profiles;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT * INTO _profile FROM public.profiles WHERE id = auth.uid();
  IF _profile IS NULL THEN RAISE EXCEPTION 'Profile not found'; END IF;
  IF COALESCE(_profile.xp, 0) < 10 THEN RAISE EXCEPTION 'Not enough XP (need 10)'; END IF;
  UPDATE public.profiles SET
    xp = _profile.xp - 10,
    streak_freeze_until = current_date + 1
  WHERE id = auth.uid()
  RETURNING * INTO _profile;
  RETURN _profile;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_streak()
 RETURNS profiles
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _profile public.profiles;
  _today date := current_date;
  _last date;
  _new int;
  _badges text[];
  _frozen boolean := false;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT * INTO _profile FROM public.profiles WHERE id = auth.uid();
  IF _profile IS NULL THEN RAISE EXCEPTION 'Profile not found'; END IF;
  BEGIN
    _last := NULLIF(_profile.last_active_date, '')::timestamptz::date;
  EXCEPTION WHEN OTHERS THEN _last := NULL; END;
  IF _last = _today THEN RETURN _profile; END IF;
  IF _profile.streak_freeze_until IS NOT NULL AND _profile.streak_freeze_until >= _today - 1 THEN
    _frozen := true;
  END IF;
  IF _last = _today - 1 OR (_frozen AND _last >= _today - 2) THEN
    _new := COALESCE(_profile.streak_count,0) + 1;
  ELSE _new := 1; END IF;
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
$function$;

REVOKE EXECUTE ON FUNCTION public.buy_freeze_streak() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.buy_freeze_streak() TO authenticated;
