-- ============================================================================
-- CodeSage Academy — COMPLETE DATABASE (schema + functions + policies + seeds)
-- Run this ONCE in the NEW project's SQL editor. Safe to re-run (idempotent).
-- NOTE: user accounts (auth.users) and their rows in profiles/enrollments/etc.
-- are NOT included — they can only come from the .backup dump. Fresh signups
-- work immediately after this script.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Types --------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Sequences ----------------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.student_id_seq;

-- 3. Tables -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text DEFAULT '',
  name text DEFAULT '',
  studying text DEFAULT '',
  has_job text DEFAULT '',
  dob text DEFAULT '',
  goal text DEFAULT '',
  experience_level text DEFAULT '',
  streak_count integer DEFAULT 0,
  last_active_date text,
  badges text[] DEFAULT '{}'::text[],
  completed_lessons text[] DEFAULT '{}'::text[],
  completed_tests text[] DEFAULT '{}'::text[],
  unlocked_sections text[] DEFAULT ARRAY['frontend'::text],
  promo_codes text[] DEFAULT '{}'::text[],
  dark_mode boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  xp integer DEFAULT 0,
  level integer DEFAULT 1,
  sage_coins integer DEFAULT 0,
  has_seen_tour boolean DEFAULT false,
  streak_freeze_until date,
  student_id text UNIQUE,
  daily_xp numeric NOT NULL DEFAULT 10,
  daily_xp_date date NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS public.enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, track)
);

CREATE TABLE IF NOT EXISTS public.track_stats (
  track text PRIMARY KEY,
  enrolled_count integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.announcement_reads (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  announcement_id uuid NOT NULL REFERENCES public.announcements(id) ON DELETE CASCADE,
  read_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, announcement_id)
);

CREATE TABLE IF NOT EXISTS public.suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  username text NOT NULL DEFAULT '',
  text text NOT NULL,
  reply text,
  reply_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  upvotes integer NOT NULL DEFAULT 0,
  downvotes integer NOT NULL DEFAULT 0,
  CONSTRAINT suggestions_text_len CHECK (char_length(text) >= 1 AND char_length(text) <= 500),
  CONSTRAINT suggestions_reply_len CHECK (reply IS NULL OR char_length(reply) <= 1000)
);

CREATE TABLE IF NOT EXISTS public.suggestion_votes (
  suggestion_id uuid NOT NULL REFERENCES public.suggestions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  vote_type text NOT NULL DEFAULT 'up',
  PRIMARY KEY (suggestion_id, user_id),
  CONSTRAINT suggestion_votes_vote_type_check CHECK (vote_type IN ('up','down'))
);

CREATE TABLE IF NOT EXISTS public.suggestion_reads (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  last_seen_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

CREATE TABLE IF NOT EXISTS public.lesson_registry (id text PRIMARY KEY);
CREATE TABLE IF NOT EXISTS public.test_registry   (id text PRIMARY KEY);
CREATE TABLE IF NOT EXISTS public.badge_levels (
  level integer PRIMARY KEY,
  badge_id text NOT NULL,
  xp_required integer NOT NULL
);
CREATE TABLE IF NOT EXISTS public.promo_codes (
  code text PRIMARY KEY,
  sections text[] NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON public.enrollments (user_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_user_id ON public.suggestions (user_id);

-- 4. Functions ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_delete_suggestion(_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Admin access required'; END IF;
  DELETE FROM public.suggestions WHERE id = _id;
  RETURN true;
END; $function$
;
CREATE OR REPLACE FUNCTION public.admin_delete_user(_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Admin access required'; END IF;
  DELETE FROM auth.sessions WHERE user_id = _user_id;
  DELETE FROM auth.refresh_tokens WHERE user_id = _user_id::text;
  DELETE FROM auth.users WHERE id = _user_id;
END;
$function$
;
CREATE OR REPLACE FUNCTION public.admin_edit_suggestion(_id uuid, _text text)
 RETURNS suggestions
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE _row public.suggestions;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Admin access required'; END IF;
  IF _text IS NULL OR length(btrim(_text)) = 0 OR length(_text) > 500 THEN RAISE EXCEPTION 'Invalid text'; END IF;
  UPDATE public.suggestions SET text = _text, updated_at = now() WHERE id = _id RETURNING * INTO _row;
  IF _row IS NULL THEN RAISE EXCEPTION 'Suggestion not found'; END IF;
  RETURN _row;
END; $function$
;
CREATE OR REPLACE FUNCTION public.admin_list_users(_search text DEFAULT NULL::text, _limit integer DEFAULT 50, _offset integer DEFAULT 0)
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
END; $function$
;
CREATE OR REPLACE FUNCTION public.admin_user_count(_search text DEFAULT NULL::text)
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
END; $function$
;
CREATE OR REPLACE FUNCTION public.assign_student_id()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.student_id IS NULL THEN
    NEW.student_id := 'ID-CSA-' || lpad(nextval('public.student_id_seq')::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$function$
;
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

  -- Streak calculation variables
  _today date := current_date;
  _last date;
  _new_streak int;
  _frozen boolean := false;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _lesson_id IS NULL OR length(_lesson_id) = 0 OR length(_lesson_id) > 100 THEN
    RAISE EXCEPTION 'Invalid lesson id';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.lesson_registry WHERE id = _lesson_id) THEN
    RAISE EXCEPTION 'Unknown lesson id';
  END IF;

  SELECT * INTO _profile FROM public.profiles WHERE id = auth.uid();
  IF _profile IS NULL THEN RAISE EXCEPTION 'Profile not found'; END IF;

  -- 1. If lesson was already completed previously, return profile
  IF _lesson_id = ANY(COALESCE(_profile.completed_lessons, '{}')) THEN
    RETURN _profile;
  END IF;

  -- 2. Award lesson rewards
  _profile.completed_lessons := array_append(COALESCE(_profile.completed_lessons,'{}'), _lesson_id);
  _profile.xp := COALESCE(_profile.xp, 0) + 5;
  _profile.sage_coins := COALESCE(_profile.sage_coins, 0) + 2;
  _profile.level := (_profile.xp / 200) + 1;
  _new_count := COALESCE(array_length(_profile.completed_lessons, 1), 0);
  _badges := COALESCE(_profile.badges, '{}');

  IF _new_count >= 1  AND NOT 'lite'    = ANY(_badges) THEN _badges := array_append(_badges,'lite');    END IF;
  IF _new_count >= 5  AND NOT 'silver'  = ANY(_badges) THEN _badges := array_append(_badges,'silver');  END IF;
  IF _new_count >= 15 AND NOT 'gold'    = ANY(_badges) THEN _badges := array_append(_badges,'gold');    END IF;
  IF _new_count >= 25 AND NOT 'premium' = ANY(_badges) THEN _badges := array_append(_badges,'premium'); END IF;
  IF _new_count >= 50 AND NOT 'elite'   = ANY(_badges) THEN _badges := array_append(_badges,'elite');   END IF;

  -- 3. Update Streak on lesson completion
  BEGIN
    _last := NULLIF(_profile.last_active_date, '')::timestamptz::date;
  EXCEPTION WHEN OTHERS THEN _last := NULL; END;

  -- Only increment streak once per calendar day
  IF _last IS NULL OR _last < _today THEN
    IF _profile.streak_freeze_until IS NOT NULL AND _profile.streak_freeze_until >= _today - 1 THEN
      _frozen := true;
    END IF;

    IF _last = _today - 1 OR (_frozen AND _last >= _today - 2) THEN
      _new_streak := COALESCE(_profile.streak_count, 0) + 1;
    ELSE
      _new_streak := 1;
    END IF;

    _profile.streak_count := _new_streak;
    _profile.last_active_date := now()::text;

    -- Award streak badges if milestone reached
    IF _new_streak >= 3  AND NOT 'streak-3'  = ANY(_badges) THEN _badges := array_append(_badges,'streak-3');  END IF;
    IF _new_streak >= 7  AND NOT 'streak-7'  = ANY(_badges) THEN _badges := array_append(_badges,'streak-7');  END IF;
    IF _new_streak >= 30 AND NOT 'streak-30' = ANY(_badges) THEN _badges := array_append(_badges,'streak-30'); END IF;
  END IF;

  _profile.badges := _badges;

  -- 4. Save to Database & return updated profile
  UPDATE public.profiles SET
    completed_lessons = _profile.completed_lessons,
    xp = _profile.xp,
    sage_coins = _profile.sage_coins,
    level = _profile.level,
    badges = _profile.badges,
    streak_count = COALESCE(_profile.streak_count, 0),
    last_active_date = _profile.last_active_date
  WHERE id = auth.uid()
  RETURNING * INTO _profile;

  RETURN _profile;
END;
$function$
;
CREATE OR REPLACE FUNCTION public.award_lesson_v2(_lesson_id text)
 RETURNS SETOF profiles
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  p           public.profiles%ROWTYPE;
  v_energy    numeric(5,1);
  v_xp        int;
  v_total_xp  numeric(5,1);
  v_cost      constant numeric(5,1) := 3.3;
  v_reward_xp constant int := 1;
  v_reward_coins constant int := 2;
  v_new       text[];
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _lesson_id IS NULL OR length(_lesson_id) = 0 OR length(_lesson_id) > 100 THEN
    RAISE EXCEPTION 'Invalid lesson id';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.lesson_registry WHERE id = _lesson_id) THEN
    RAISE EXCEPTION 'Unknown lesson id';
  END IF;

  SELECT * INTO p FROM public.profiles WHERE id = auth.uid() FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'profile not found'; END IF;

  -- Daily Reset
  IF p.daily_xp_date < CURRENT_DATE THEN
    p.daily_xp := 10;
    p.daily_xp_date := CURRENT_DATE;
  END IF;

  v_energy := p.daily_xp;
  v_xp := COALESCE(p.xp, 0);
  v_total_xp := v_energy + v_xp;

  -- Skip if already done
  IF _lesson_id = ANY (COALESCE(p.completed_lessons, ARRAY[]::text[])) THEN
    UPDATE public.profiles SET daily_xp = p.daily_xp, daily_xp_date = p.daily_xp_date WHERE id = p.id RETURNING * INTO p;
    RETURN NEXT p; RETURN;
  END IF;

  -- BLOCK if Total XP is insufficient
  IF v_total_xp < v_cost THEN
    RAISE EXCEPTION 'INSUFFICIENT_XP: Run out of XP. Come back tomorrow or buy with coins.';
  END IF;

  -- Deduct Daily First, Then Lifetime
  IF v_energy >= v_cost THEN
    p.daily_xp := v_energy - v_cost;
  ELSE
    p.daily_xp := 0;
    p.xp := v_xp - (v_cost - v_energy);
  END IF;

  v_new := array_append(COALESCE(p.completed_lessons, ARRAY[]::text[]), _lesson_id);

  UPDATE public.profiles
  SET completed_lessons = v_new,
      sage_coins        = COALESCE(p.sage_coins, 0) + v_reward_coins,
      daily_xp          = p.daily_xp,
      xp                = p.xp + v_reward_xp,
      daily_xp_date     = CURRENT_DATE,
      level             = public.level_for_lessons(COALESCE(array_length(v_new, 1), 0)),
      last_active_date  = CURRENT_DATE
  WHERE id = p.id RETURNING * INTO p;

  RETURN NEXT p;
END; $function$
;
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
$function$
;
CREATE OR REPLACE FUNCTION public.complete_test(_test_id text)
 RETURNS profiles
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _profile public.profiles;
  _badges text[];
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _test_id IS NULL OR length(_test_id) = 0 OR length(_test_id) > 100 THEN
    RAISE EXCEPTION 'Invalid test id';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.test_registry WHERE id = _test_id) THEN
    RAISE EXCEPTION 'Unknown test id';
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
$function$
;
CREATE OR REPLACE FUNCTION public.complete_test(_test_id text, _coin_reward integer DEFAULT 3)
 RETURNS SETOF profiles
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  p     public.profiles%ROWTYPE;
  v_new text[];
  -- reward is fixed server-side; the _coin_reward argument is ignored
  v_reward constant int := 3;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _test_id IS NULL OR length(_test_id) = 0 OR length(_test_id) > 100 THEN
    RAISE EXCEPTION 'Invalid test id';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.test_registry WHERE id = _test_id) THEN
    RAISE EXCEPTION 'Unknown test id';
  END IF;

  SELECT * INTO p FROM public.profiles WHERE id = auth.uid() FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'profile not found'; END IF;


  -- Skip if already completed
  IF _test_id = ANY (COALESCE(p.completed_tests, ARRAY[]::text[])) THEN
    RETURN NEXT p; RETURN;
  END IF;

  v_new := array_append(COALESCE(p.completed_tests, ARRAY[]::text[]), _test_id);

  UPDATE public.profiles
  SET completed_tests   = v_new,
      sage_coins        = COALESCE(p.sage_coins, 0) + v_reward,
      xp                = COALESCE(xp, 0) + 1, -- +1 Lifetime XP victory prize
      last_active_date  = current_date
  WHERE id = p.id RETURNING * INTO p;

  RETURN NEXT p;
END; $function$
;
CREATE OR REPLACE FUNCTION public.enroll_track(_track text)
 RETURNS enrollments
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _row public.enrollments;
  _existed boolean;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF _track NOT IN (
    'frontend', 'networking', 'fullstack', 'freelance', 'real-freelance',
    'python', 'local', 'sql', 'pythonexpert', 'ai-fundamentals',
    'intermediate-ai', 'three3d', 'java', 'cpp'
  ) THEN
    RAISE EXCEPTION 'Invalid track';
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM public.enrollments
    WHERE user_id = auth.uid() AND track = _track
  ) INTO _existed;

  INSERT INTO public.enrollments(user_id, track, status)
  VALUES (auth.uid(), _track, 'active')
  ON CONFLICT (user_id, track) DO UPDATE SET status = 'active'
  RETURNING * INTO _row;

  IF NOT _existed THEN
    INSERT INTO public.track_stats(track, enrolled_count)
    VALUES (_track, 1)
    ON CONFLICT (track) DO UPDATE
      SET enrolled_count = public.track_stats.enrolled_count + 1,
          updated_at = now();
  END IF;

  RETURN _row;
END;
$function$
;
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', ''));
  RETURN NEW;
END;
$function$
;
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$function$
;
CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin'::public.app_role)
$function$
;
CREATE OR REPLACE FUNCTION public.level_for_lessons(_lessons integer)
 RETURNS integer
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT COALESCE((SELECT max(level) FROM public.badge_levels WHERE xp_required <= _lessons), 1);
$function$
;
CREATE OR REPLACE FUNCTION public.mark_announcement_read(_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  INSERT INTO public.announcement_reads(user_id, announcement_id)
  VALUES (auth.uid(), _id) ON CONFLICT DO NOTHING;
END;
$function$
;
CREATE OR REPLACE FUNCTION public.mark_suggestions_read()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  INSERT INTO public.suggestion_reads(user_id, last_seen_at)
  VALUES (auth.uid(), now())
  ON CONFLICT (user_id) DO UPDATE SET last_seen_at = now();
END;
$function$
;
CREATE OR REPLACE FUNCTION public.post_announcement(_title text, _body text)
 RETURNS announcements
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE _row public.announcements;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Admin access required'; END IF;
  IF _title IS NULL OR length(btrim(_title)) = 0 OR length(_title) > 200 THEN RAISE EXCEPTION 'Invalid title'; END IF;
  IF _body IS NULL OR length(btrim(_body)) = 0 OR length(_body) > 5000 THEN RAISE EXCEPTION 'Invalid body'; END IF;
  INSERT INTO public.announcements(title, body) VALUES (_title, _body) RETURNING * INTO _row;
  RETURN _row;
END; $function$
;
CREATE OR REPLACE FUNCTION public.purchase_extra_lesson(_lesson_id text)
 RETURNS SETOF profiles
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  p              public.profiles%ROWTYPE;
  v_cost_coins   constant int := 6;
  v_reward_xp    constant int := 1;
  v_reward_coins constant int := 2;
  v_new          text[];
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _lesson_id IS NULL OR length(_lesson_id) = 0 OR length(_lesson_id) > 100 THEN
    RAISE EXCEPTION 'Invalid lesson id';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.lesson_registry WHERE id = _lesson_id) THEN
    RAISE EXCEPTION 'Unknown lesson id';
  END IF;

  SELECT * INTO p FROM public.profiles WHERE id = auth.uid() FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'profile not found'; END IF;

  IF _lesson_id = ANY (COALESCE(p.completed_lessons, ARRAY[]::text[])) THEN
    RETURN NEXT p; RETURN;
  END IF;

  IF COALESCE(p.sage_coins, 0) < v_cost_coins THEN
    RAISE EXCEPTION 'INSUFFICIENT_COINS: Need 6 coins to buy this lesson.';
  END IF;

  v_new := array_append(COALESCE(p.completed_lessons, ARRAY[]::text[]), _lesson_id);

  UPDATE public.profiles
  SET completed_lessons = v_new,
      sage_coins        = COALESCE(p.sage_coins, 0) - v_cost_coins + v_reward_coins,
      xp                = COALESCE(p.xp, 0) + v_reward_xp,
      level             = public.level_for_lessons(COALESCE(array_length(v_new, 1), 0)),
      last_active_date  = CURRENT_DATE
  WHERE id = p.id RETURNING * INTO p;

  RETURN NEXT p;
END; $function$
;
CREATE OR REPLACE FUNCTION public.redeem_promo(_code text)
 RETURNS profiles
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _profile public.profiles;
  _sections text[];
  _normalized text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _code IS NULL OR length(_code) > 64 THEN RAISE EXCEPTION 'Invalid code'; END IF;
  _normalized := upper(btrim(_code));
  SELECT sections INTO _sections FROM public.promo_codes WHERE code = _normalized;
  IF _sections IS NULL THEN RAISE EXCEPTION 'Invalid promo code'; END IF;
  UPDATE public.profiles SET
    unlocked_sections = ARRAY(SELECT DISTINCT unnest(COALESCE(unlocked_sections,'{}') || _sections)),
    promo_codes       = ARRAY(SELECT DISTINCT unnest(COALESCE(promo_codes,'{}') || ARRAY[_normalized]))
  WHERE id = auth.uid()
  RETURNING * INTO _profile;
  RETURN _profile;
END;
$function$
;
CREATE OR REPLACE FUNCTION public.refresh_daily_xp()
 RETURNS SETOF profiles
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE 
  p public.profiles%ROWTYPE;
BEGIN
  UPDATE public.profiles 
  SET daily_xp = 10, daily_xp_date = current_date
  WHERE id = auth.uid() AND daily_xp_date < current_date 
  RETURNING * INTO p;

  IF NOT FOUND THEN 
    SELECT * INTO p FROM public.profiles WHERE id = auth.uid(); 
  END IF;

  RETURN NEXT p;
END; $function$
;
CREATE OR REPLACE FUNCTION public.reply_suggestion(_id uuid, _reply text)
 RETURNS suggestions
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE _row public.suggestions;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Admin access required'; END IF;
  IF _reply IS NULL OR length(btrim(_reply)) = 0 OR length(_reply) > 1000 THEN RAISE EXCEPTION 'Invalid reply'; END IF;
  UPDATE public.suggestions SET reply = _reply, reply_at = now() WHERE id = _id RETURNING * INTO _row;
  IF _row IS NULL THEN RAISE EXCEPTION 'Suggestion not found'; END IF;
  RETURN _row;
END; $function$
;
CREATE OR REPLACE FUNCTION public.spend_coins(_amount integer, _reason text DEFAULT 'spend'::text)
 RETURNS SETOF profiles
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE p public.profiles%ROWTYPE;
BEGIN
  IF _amount IS NULL OR _amount <= 0 OR _amount > 500 THEN RAISE EXCEPTION 'INVALID_AMOUNT'; END IF;
  SELECT * INTO p FROM public.profiles WHERE id = auth.uid() FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'profile not found'; END IF;
  IF COALESCE(p.sage_coins, 0) < _amount THEN RAISE EXCEPTION 'INSUFFICIENT_COINS'; END IF;
  UPDATE public.profiles SET sage_coins = sage_coins - _amount WHERE id = p.id RETURNING * INTO p;
  RETURN NEXT p;
END; $function$
;
CREATE OR REPLACE FUNCTION public.suggestion_is_mine(_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (SELECT 1 FROM public.suggestions s WHERE s.id = _id AND s.user_id = auth.uid())
$function$
;
CREATE OR REPLACE FUNCTION public.suggestions_guard()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _uname text;
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF EXISTS (
      SELECT 1 FROM public.suggestions
      WHERE user_id = NEW.user_id
        AND created_at >= date_trunc('day', now())
    ) THEN
      RAISE EXCEPTION 'You can only post one suggestion per day';
    END IF;
    SELECT username INTO _uname FROM public.profiles WHERE id = auth.uid();
    NEW.username := COALESCE(_uname, '');
    NEW.user_id := auth.uid();
    NEW.reply := NULL;
    NEW.reply_at := NULL;
    NEW.upvotes := 0;
    NEW.downvotes := 0;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF (NEW.reply IS DISTINCT FROM OLD.reply) OR (NEW.reply_at IS DISTINCT FROM OLD.reply_at) THEN
      IF current_setting('role', true) IS NULL OR current_setting('role', true) <> 'service_role' THEN
        IF current_user <> 'postgres' THEN
          RAISE EXCEPTION 'Reply fields are admin-only';
        END IF;
      END IF;
    END IF;
    NEW.username := OLD.username;
    NEW.user_id := OLD.user_id;
    -- Vote counters are maintained only by the vote trigger.
    IF current_user <> 'postgres' AND pg_trigger_depth() < 2 THEN
      NEW.upvotes := OLD.upvotes;
      NEW.downvotes := OLD.downvotes;
    END IF;
    NEW.updated_at := now();
    RETURN NEW;
  END IF;
  RETURN NEW;
END;
$function$
;
CREATE OR REPLACE FUNCTION public.sync_suggestion_vote_counts()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _sid uuid := COALESCE(NEW.suggestion_id, OLD.suggestion_id);
BEGIN
  UPDATE public.suggestions s SET
    upvotes = (SELECT count(*) FROM public.suggestion_votes v WHERE v.suggestion_id = _sid AND v.vote_type = 'up'),
    downvotes = (SELECT count(*) FROM public.suggestion_votes v WHERE v.suggestion_id = _sid AND v.vote_type = 'down')
  WHERE s.id = _sid;
  RETURN NULL;
END;
$function$
;
CREATE OR REPLACE FUNCTION public.update_enrollment_status(_track text, _status text)
 RETURNS enrollments
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _row public.enrollments;
  _prev text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _status NOT IN ('active','paused','ended') THEN RAISE EXCEPTION 'Invalid status'; END IF;

  SELECT status INTO _prev FROM public.enrollments WHERE user_id = auth.uid() AND track = _track;
  IF _prev IS NULL THEN RETURN NULL; END IF;

  UPDATE public.enrollments SET status = _status
    WHERE user_id = auth.uid() AND track = _track
    RETURNING * INTO _row;

  IF _prev <> 'ended' AND _status = 'ended' THEN
    UPDATE public.track_stats
      SET enrolled_count = GREATEST(0, enrolled_count - 1), updated_at = now()
      WHERE track = _track;
  ELSIF _prev = 'ended' AND _status <> 'ended' THEN
    INSERT INTO public.track_stats(track, enrolled_count) VALUES (_track, 1)
      ON CONFLICT (track) DO UPDATE SET enrolled_count = public.track_stats.enrolled_count + 1, updated_at = now();
  END IF;

  RETURN _row;
END;
$function$
;
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
$function$
;
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

-- 5. View ---------------------------------------------------------------------
DROP VIEW IF EXISTS public.suggestions_public;
CREATE VIEW public.suggestions_public WITH (security_invoker = on) AS
  SELECT id, username, text, reply, reply_at, created_at, updated_at,
         upvotes, downvotes, public.suggestion_is_mine(id) AS is_mine
  FROM public.suggestions s;

-- 6. Triggers -----------------------------------------------------------------
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS trg_assign_student_id ON public.profiles;
CREATE TRIGGER trg_assign_student_id BEFORE INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.assign_student_id();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS suggestions_guard_trg ON public.suggestions;
CREATE TRIGGER suggestions_guard_trg BEFORE INSERT OR UPDATE ON public.suggestions
  FOR EACH ROW EXECUTE FUNCTION public.suggestions_guard();

DROP TRIGGER IF EXISTS suggestion_votes_sync ON public.suggestion_votes;
CREATE TRIGGER suggestion_votes_sync AFTER INSERT OR UPDATE OR DELETE ON public.suggestion_votes
  FOR EACH ROW EXECUTE FUNCTION public.sync_suggestion_vote_counts();

DROP TRIGGER IF EXISTS update_suggestion_votes_updated_at ON public.suggestion_votes;
CREATE TRIGGER update_suggestion_votes_updated_at BEFORE UPDATE ON public.suggestion_votes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7. Row Level Security --------------------------------------------------------
DO $$ DECLARE t record; p record; BEGIN
  FOR t IN SELECT c.relname FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
           WHERE n.nspname='public' AND c.relkind='r' LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t.relname);
  END LOOP;
  FOR p IN SELECT policyname, tablename FROM pg_policies WHERE schemaname='public' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', p.policyname, p.tablename);
  END LOOP;
END $$;

CREATE POLICY "Users manage own reads" ON public.announcement_reads FOR ALL TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Admins can update announcements" ON public.announcements FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Auth users read announcements" ON public.announcements FOR SELECT TO authenticated USING (true);
CREATE POLICY "badge levels are public" ON public.badge_levels FOR SELECT TO public USING (true);
CREATE POLICY "Users read own enrollments" ON public.enrollments FOR SELECT TO authenticated USING ((auth.uid() = user_id));
CREATE POLICY "Users update own enrollments" ON public.enrollments FOR UPDATE TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Users can delete own profile" ON public.profiles FOR DELETE TO authenticated USING ((auth.uid() = id));
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK ((auth.uid() = id));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING ((auth.uid() = id));
CREATE POLICY "Users manage own suggestion reads" ON public.suggestion_reads FOR ALL TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Authenticated can read votes" ON public.suggestion_votes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users manage own vote" ON public.suggestion_votes FOR ALL TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Authenticated read suggestion content" ON public.suggestions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can delete own suggestion" ON public.suggestions FOR DELETE TO authenticated USING ((auth.uid() = user_id));
CREATE POLICY "Users can insert own suggestion" ON public.suggestions FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Users can update own suggestion" ON public.suggestions FOR UPDATE TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Authenticated can read track stats" ON public.track_stats FOR SELECT TO authenticated USING (true);

-- 8. Grants --------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO authenticated, service_role;
REVOKE USAGE ON SCHEMA public FROM anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles           TO authenticated;
GRANT SELECT, INSERT, UPDATE         ON public.enrollments        TO authenticated;
GRANT SELECT, UPDATE                 ON public.announcements      TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.announcement_reads TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.suggestions        TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.suggestion_votes   TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.suggestion_reads   TO authenticated;
GRANT SELECT                         ON public.track_stats        TO authenticated;
GRANT SELECT                         ON public.suggestions_public TO authenticated;

GRANT ALL ON ALL TABLES    IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT USAGE ON SEQUENCE public.student_id_seq TO authenticated, service_role;

-- internal tables stay unreadable from the client (used inside definer functions)
REVOKE ALL ON public.lesson_registry, public.test_registry, public.badge_levels,
              public.user_roles, public.promo_codes FROM anon, authenticated;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;

-- functions: strip the default PUBLIC grant, then re-grant
DO $$ DECLARE f record; BEGIN
  FOR f IN SELECT p.oid::regprocedure AS sig FROM pg_proc p
           JOIN pg_namespace n ON n.oid=p.pronamespace
           WHERE n.nspname='public' AND p.prokind='f' LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon', f.sig);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated, service_role', f.sig);
  END LOOP;
END $$;

-- nothing in public is callable/readable by anonymous visitors
REVOKE SELECT ON public.suggestions_public FROM anon;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
             WHERE n.nspname = 'public' AND p.proname = 'get_community_leaderboard') THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.get_community_leaderboard() FROM anon, PUBLIC';
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.get_community_leaderboard() TO authenticated, service_role';
  END IF;
END $$;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;

-- 9. Realtime ------------------------------------------------------------------
ALTER TABLE public.suggestions  REPLICA IDENTITY FULL;
ALTER TABLE public.announcements REPLICA IDENTITY FULL;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.suggestions;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 10. Reference data (lessons, tests, badges, promo codes, track counters) ------
INSERT INTO public.lesson_registry(id) VALUES ('a11y-1') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('accessibility-seo') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('ai-01') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('ai-02') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('ai-03') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('ai-04') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('ai-05') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('ai-06') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('ai-07') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('ai-08') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('ai-09') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('ai-10') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('ai-11') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('ai-12') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('aiin-01') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('aiin-02') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('aiin-03') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('aiin-04') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('aiin-05') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('aiin-06') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('aiin-07') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('aiin-08') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('cpp-01') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('cpp-02') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('cpp-03') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('cpp-04') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('cpp-05') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('cpp-06') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('cpp-07') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('cpp-08') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('cpp-09') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('cpp-10') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('cpp-11') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('cpp-12') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('cpp-13') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('cpp-14') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('cpp-15') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('cpp-16') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('cpp-17') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('cpp-18') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('cpp-19') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('cpp-20') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('cpp-21') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('cpp-22') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('cpp-23') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('cpp-24') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('cpp-25') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('cpp-26') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('cpp-27') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('cpp-28') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('cpp-29') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('cpp-30') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('css-1') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('css-2') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('css-3') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('css-4') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('css-5') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('css-6') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('css-basics') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('css-exp-1') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('css-exp-2') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('css-expert') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('css-int-1') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('css-int-2') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('css-int-3') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('css-intermediate') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('form-1') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('form-2') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('forms-validation') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('free-1') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('free-10') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('free-11') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('free-12') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('free-2') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('free-3') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('free-4') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('free-5') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('free-6') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('free-7') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('free-8') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('free-9') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('fs-1') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('fs-10') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('fs-11') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('fs-12') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('fs-13') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('fs-14') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('fs-15') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('fs-16') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('fs-17') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('fs-18') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('fs-19') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('fs-2') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('fs-20') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('fs-21') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('fs-22') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('fs-23') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('fs-24') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('fs-25') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('fs-26') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('fs-27') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('fs-28') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('fs-3') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('fs-4') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('fs-5') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('fs-6') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('fs-7') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('fs-8') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('fs-9') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('html-1') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('html-10') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('html-2') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('html-3') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('html-4') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('html-5') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('html-6') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('html-7') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('html-8') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('html-9') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('html-basics') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('html-int-1') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('html-int-2') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('html-intermediate') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('java-01') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('java-02') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('java-03') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('java-04') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('java-05') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('java-06') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('java-07') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('java-08') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('java-09') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('java-10') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('java-11') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('java-12') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('java-13') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('java-14') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('java-15') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('java-16') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('java-17') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('java-18') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('java-19') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('java-20') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('java-21') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('java-22') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('java-23') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('java-24') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('java-25') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('java-26') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('java-27') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('java-28') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('java-29') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('java-30') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('js-1') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('js-2') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('js-3') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('js-4') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('js-5') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('js-basics') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('js-exp-1') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('js-exp-2') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('js-exp-3') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('js-expert') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('js-int-1') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('js-int-2') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('js-int-3') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('js-int-4') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('js-intermediate') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('local-1') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('local-10') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('local-11') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('local-12') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('local-13') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('local-14') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('local-15') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('local-2') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('local-3') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('local-4') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('local-5') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('local-6') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('local-7') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('local-8') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('local-9') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('multi-1') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('multi-2') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('multi-3') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('multimedia') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('net-1') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('net-10') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('net-11') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('net-12') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('net-13') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('net-2') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('net-3') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('net-4') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('net-5') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('net-6') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('net-7') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('net-8') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('net-9') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pro-1') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pro-2') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pro-3') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pro-projects') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('proj-1') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('proj-2') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('py-01') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('py-1') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('py-10') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('py-11') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('py-12') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('py-13') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('py-14') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('py-15') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('py-16') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('py-17') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('py-18') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('py-19') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('py-2') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('py-20') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('py-21') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('py-22') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('py-23') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('py-24') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('py-25') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('py-26') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('py-27') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('py-28') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('py-29') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('py-3') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('py-30') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('py-4') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('py-5') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('py-6') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('py-7') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('py-8') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('py-9') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('py-test-1') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('py-test-2') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pyx-01') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pyx-02') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pyx-03') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pyx-04') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pyx-05') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pyx-06') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pyx-07') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pyx-08') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pyx-09') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pyx-10') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pyx-11') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pyx-12') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pyx-13') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pyx-14') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pyx-15') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pyx-16') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pyx-17') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pyx-18') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pyx-19') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pyx-20') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pyx-21') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pyx-22') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pyx-23') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pyx-24') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pyx-25') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pyx-26') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pyx-27') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pyx-28') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pyx-29') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('pyx-30') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('react-1') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('react-2') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('react-3') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('react-4') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('react-basics') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('react-exp-1') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('react-expert') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('react-int-1') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('react-intermediate') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('real-free-1') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('real-free-10') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('real-free-11') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('real-free-12') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('real-free-2') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('real-free-3') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('real-free-4') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('real-free-5') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('real-free-6') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('real-free-7') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('real-free-8') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('real-free-9') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('real-projects') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('sql-01') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('sql-02') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('sql-03') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('sql-04') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('sql-05') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('sql-06') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('sql-07') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('sql-08') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('sql-09') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('sql-10') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('sql-11') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('sql-12') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('sql-13') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('sql-14') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('sql-15') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('three-1') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('three-10') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('three-11') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('three-12') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('three-13') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('three-14') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('three-15') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('three-16') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('three-2') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('three-3') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('three-4') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('three-5') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('three-6') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('three-7') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('three-8') ON CONFLICT DO NOTHING;
INSERT INTO public.lesson_registry(id) VALUES ('three-9') ON CONFLICT DO NOTHING;
INSERT INTO public.test_registry(id) VALUES ('test-basic') ON CONFLICT DO NOTHING;
INSERT INTO public.test_registry(id) VALUES ('test-expert') ON CONFLICT DO NOTHING;
INSERT INTO public.test_registry(id) VALUES ('test-intermediate') ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (1,'hello-world',0) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (2,'syntax-starter',1) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (3,'tag-initiator',2) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (4,'style-rookie',3) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (5,'terminal-scout',4) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (6,'variable-traced',5) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (7,'loop-observer',7) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (8,'logic-cadet',9) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (9,'array-novice',11) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (10,'bug-spotter',13) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (11,'python-pioneer',15) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (12,'query-taster',18) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (13,'git-initiate',21) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (14,'func-builder',24) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (15,'packet-runner',27) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (16,'dom-explorer',30) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (17,'script-scribe',34) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (18,'flexbox-handler',38) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (19,'branch-creator',42) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (20,'object-crafter',46) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (21,'java-spark',51) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (22,'cpp-recruit',56) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (23,'grid-aligner',61) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (24,'sql-selecter',66) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (25,'api-fetcher',72) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (26,'event-catcher',78) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (27,'class-designer',84) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (28,'stack-tracker',90) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (29,'queue-keeper',97) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (30,'json-parser',104) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (31,'bash-scripter',111) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (32,'state-watcher',119) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (33,'style-shaper',127) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (34,'frontend-operator',135) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (35,'react-mechanic',144) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (36,'schema-mapper',153) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (37,'algo-runner',162) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (38,'types-guardian',172) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (39,'freelance-coder',182) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (40,'node-pioneer',192) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (41,'memory-pointer',203) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (42,'route-handler',214) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (43,'async-weaver',225) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (44,'sql-joiner',237) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (45,'terminal-hacker',249) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (46,'bug-hunter',261) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (47,'ai-prompter',274) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (48,'test-runner',287) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (49,'binary-searcher',300) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (50,'client-builder',314) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (51,'backend-engineer',328) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (52,'rest-architect',342) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (53,'socket-streamer',357) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (54,'docker-captain',372) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (55,'tree-traverser',388) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (56,'auth-defender',404) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (57,'cpp-optimizer',420) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (58,'python-analyst',437) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (59,'indexing-expert',454) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (60,'fullstack-pro',471) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (61,'cache-master',489) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (62,'ci-pipeline',507) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (63,'recursion-virtuoso',525) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (64,'ai-integrator',544) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (65,'network-scout',563) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (66,'refactor-master',583) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (67,'agile-lead',603) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (68,'system-architect',623) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (69,'cloud-stratus',644) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (70,'graph-master',665) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (71,'microservice-hero',686) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (72,'sec-auditor',708) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (73,'db-sharder',730) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (74,'llm-tuner',752) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (75,'protocol-chief',775) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (76,'thread-director',798) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (77,'agency-founder',821) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (78,'devops-titan',845) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (79,'java-jvm-expert',869) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (80,'data-archon',893) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (81,'load-balancer',918) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (82,'event-driver',943) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (83,'kernel-watcher',968) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (84,'infra-pioneer',994) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (85,'code-sage',1020) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (86,'quantum-coder',1046) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (87,'neural-mind',1073) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (88,'zero-day-hero',1100) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (89,'tech-luminary',1127) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (90,'source-whisperer',1155) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (91,'algo-grandmaster',1183) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (92,'system-oracle',1211) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (93,'cloud-emperor',1240) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (94,'digital-alchemist',1269) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (95,'bytecode-wizard',1298) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (96,'distro-creator',1328) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (97,'silicon-master',1358) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (98,'omniscient-dev',1388) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (99,'legendary-coder',1419) ON CONFLICT DO NOTHING;
INSERT INTO public.badge_levels(level,badge_id,xp_required) VALUES (100,'ultimate-sage',1450) ON CONFLICT DO NOTHING;
INSERT INTO public.promo_codes(code,sections) VALUES ('AI2024','{ai}'::text[]) ON CONFLICT DO NOTHING;
INSERT INTO public.promo_codes(code,sections) VALUES ('BACKEND2024','{backend}'::text[]) ON CONFLICT DO NOTHING;
INSERT INTO public.promo_codes(code,sections) VALUES ('FULLACCESS','{backend,ai}'::text[]) ON CONFLICT DO NOTHING;
INSERT INTO public.track_stats(track,enrolled_count) VALUES ('ai-fundamentals',24) ON CONFLICT DO NOTHING;
INSERT INTO public.track_stats(track,enrolled_count) VALUES ('cpp',22) ON CONFLICT DO NOTHING;
INSERT INTO public.track_stats(track,enrolled_count) VALUES ('freelance',78) ON CONFLICT DO NOTHING;
INSERT INTO public.track_stats(track,enrolled_count) VALUES ('frontend',494) ON CONFLICT DO NOTHING;
INSERT INTO public.track_stats(track,enrolled_count) VALUES ('fullstack',113) ON CONFLICT DO NOTHING;
INSERT INTO public.track_stats(track,enrolled_count) VALUES ('intermediate-ai',1) ON CONFLICT DO NOTHING;
INSERT INTO public.track_stats(track,enrolled_count) VALUES ('java',42) ON CONFLICT DO NOTHING;
INSERT INTO public.track_stats(track,enrolled_count) VALUES ('local',63) ON CONFLICT DO NOTHING;
INSERT INTO public.track_stats(track,enrolled_count) VALUES ('networking',354) ON CONFLICT DO NOTHING;
INSERT INTO public.track_stats(track,enrolled_count) VALUES ('python',600) ON CONFLICT DO NOTHING;
INSERT INTO public.track_stats(track,enrolled_count) VALUES ('pythonexpert',70) ON CONFLICT DO NOTHING;
INSERT INTO public.track_stats(track,enrolled_count) VALUES ('real-freelance',4) ON CONFLICT DO NOTHING;
INSERT INTO public.track_stats(track,enrolled_count) VALUES ('sql',17) ON CONFLICT DO NOTHING;
INSERT INTO public.track_stats(track,enrolled_count) VALUES ('three3d',2) ON CONFLICT DO NOTHING;

-- 11. Make yourself admin (sign up in the app FIRST, then run this) -------------
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users
WHERE email = 'shaheerwrites703@gmail.com'
ON CONFLICT DO NOTHING;

-- 12. Sanity check ---------------------------------------------------------------
-- SELECT count(*) FROM public.lesson_registry;  -- expect 322
-- SELECT count(*) FROM public.badge_levels;     -- expect 100
