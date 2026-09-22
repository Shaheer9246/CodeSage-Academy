-- ============================================================================
-- CodeSage — Security patch (2026-09-22)
-- Run this once in your Supabase project's SQL editor. Safe to re-run.
-- Fixes:
--   1. Leaderboard function callable without logging in
--   2. Community suggestions feed readable without logging in
--   3. complete_test() accepting a client-supplied coin reward
--   4. Lesson-completion functions accepting made-up lesson ids
-- ============================================================================

-- 1. Leaderboard: signed-in users only -------------------------------------
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
             WHERE n.nspname = 'public' AND p.proname = 'get_community_leaderboard') THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.get_community_leaderboard() FROM anon, PUBLIC';
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.get_community_leaderboard() TO authenticated, service_role';
  END IF;
END $$;

-- 2. Community feed: signed-in users only ----------------------------------
REVOKE SELECT ON public.suggestions_public FROM anon;
GRANT  SELECT ON public.suggestions_public TO authenticated;

-- 3. Test completion: fixed, server-controlled reward + registry check ------
CREATE OR REPLACE FUNCTION public.complete_test(_test_id text, _coin_reward integer DEFAULT 3)
 RETURNS SETOF public.profiles
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

  IF _test_id = ANY (COALESCE(p.completed_tests, ARRAY[]::text[])) THEN
    RETURN NEXT p; RETURN;
  END IF;

  v_new := array_append(COALESCE(p.completed_tests, ARRAY[]::text[]), _test_id);

  UPDATE public.profiles
  SET completed_tests   = v_new,
      sage_coins        = COALESCE(p.sage_coins, 0) + v_reward,
      xp                = COALESCE(xp, 0) + 1,
      last_active_date  = current_date
  WHERE id = p.id RETURNING * INTO p;

  RETURN NEXT p;
END; $function$;

-- 4a. award_lesson_v2: validate the lesson id ------------------------------
CREATE OR REPLACE FUNCTION public.award_lesson_v2(_lesson_id text)
 RETURNS SETOF public.profiles
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

  IF p.daily_xp_date < CURRENT_DATE THEN
    p.daily_xp := 10;
    p.daily_xp_date := CURRENT_DATE;
  END IF;

  v_energy := p.daily_xp;
  v_xp := COALESCE(p.xp, 0);
  v_total_xp := v_energy + v_xp;

  IF _lesson_id = ANY (COALESCE(p.completed_lessons, ARRAY[]::text[])) THEN
    UPDATE public.profiles SET daily_xp = p.daily_xp, daily_xp_date = p.daily_xp_date
    WHERE id = p.id RETURNING * INTO p;
    RETURN NEXT p; RETURN;
  END IF;

  IF v_total_xp < v_cost THEN
    RAISE EXCEPTION 'INSUFFICIENT_XP: Run out of XP. Come back tomorrow or buy with coins.';
  END IF;

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
END; $function$;

-- 4b. purchase_extra_lesson: validate the lesson id ------------------------
CREATE OR REPLACE FUNCTION public.purchase_extra_lesson(_lesson_id text)
 RETURNS SETOF public.profiles
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
END; $function$;

-- Re-apply function grants (no anonymous execution anywhere) ----------------
DO $$ DECLARE f record; BEGIN
  FOR f IN SELECT p.oid::regprocedure AS sig FROM pg_proc p
           JOIN pg_namespace n ON n.oid = p.pronamespace
           WHERE n.nspname = 'public' AND p.prokind = 'f' LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon', f.sig);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated, service_role', f.sig);
  END LOOP;
END $$;
