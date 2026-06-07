
-- 1) Private app_secrets (no client access; only definer functions read it)
CREATE TABLE IF NOT EXISTS public.app_secrets (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.app_secrets TO service_role;
ALTER TABLE public.app_secrets ENABLE ROW LEVEL SECURITY;
-- Intentionally no policies and no anon/authenticated grants: table is locked from Data API.

-- Seed admin_password with a random rotated value. Admin must update via SQL to a known value.
INSERT INTO public.app_secrets(key, value)
VALUES ('admin_password', encode(gen_random_bytes(24), 'hex'))
ON CONFLICT (key) DO NOTHING;

-- 2) Promo codes table (locked)
CREATE TABLE IF NOT EXISTS public.promo_codes (
  code text PRIMARY KEY,
  sections text[] NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.promo_codes TO service_role;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
-- No client grants/policies.

INSERT INTO public.promo_codes(code, sections) VALUES
  ('BACKEND2024', ARRAY['backend']),
  ('AI2024',      ARRAY['ai']),
  ('FULLACCESS',  ARRAY['backend','ai'])
ON CONFLICT (code) DO NOTHING;

-- 3) Lesson registry — allowlist used to prevent XP/coin farming via fake IDs
CREATE TABLE IF NOT EXISTS public.lesson_registry (
  id text PRIMARY KEY
);
GRANT SELECT ON public.lesson_registry TO authenticated;
GRANT ALL ON public.lesson_registry TO service_role;
ALTER TABLE public.lesson_registry ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read lesson registry"
  ON public.lesson_registry FOR SELECT TO authenticated USING (true);

INSERT INTO public.lesson_registry(id) VALUES
  ('a11y-1'),('accessibility-seo'),
  ('css-1'),('css-2'),('css-3'),('css-4'),('css-5'),('css-6'),
  ('css-basics'),('css-exp-1'),('css-exp-2'),('css-expert'),
  ('css-int-1'),('css-int-2'),('css-int-3'),('css-intermediate'),
  ('form-1'),('form-2'),('forms-validation'),
  ('free-1'),('free-2'),('free-3'),('free-4'),('free-5'),('free-6'),
  ('free-7'),('free-8'),('free-9'),('free-10'),('free-11'),('free-12'),
  ('html-1'),('html-2'),('html-3'),('html-4'),('html-5'),
  ('html-6'),('html-7'),('html-8'),('html-9'),('html-10'),
  ('html-basics'),('html-int-1'),('html-int-2'),('html-intermediate'),
  ('js-1'),('js-2'),('js-3'),('js-4'),('js-5'),('js-basics'),
  ('js-exp-1'),('js-exp-2'),('js-exp-3'),('js-expert'),
  ('js-int-1'),('js-int-2'),('js-int-3'),('js-int-4'),('js-intermediate'),
  ('multi-1'),('multi-2'),('multi-3'),('multimedia'),
  ('net-1'),('net-2'),('net-3'),('net-4'),('net-5'),
  ('net-6'),('net-7'),('net-8'),('net-9'),('net-10'),
  ('pro-1'),('pro-2'),('pro-3'),('pro-projects'),('proj-1'),('proj-2'),
  ('react-1'),('react-2'),('react-3'),('react-4'),('react-basics'),
  ('react-exp-1'),('react-expert'),('react-int-1'),('react-intermediate'),
  ('real-projects'),
  ('fs-1'),('fs-2'),('fs-3'),('fs-4'),('fs-5'),('fs-6'),('fs-7'),
  ('fs-8'),('fs-9'),('fs-10'),('fs-11'),('fs-12'),('fs-13'),('fs-14'),
  ('fs-15'),('fs-16'),('fs-17'),('fs-18'),('fs-19'),('fs-20'),
  ('fs-21'),('fs-22'),('fs-23'),('fs-24'),('fs-25'),('fs-26'),('fs-27'),('fs-28'),
  ('py-1'),('py-2'),('py-3'),('py-4'),('py-5'),('py-6'),('py-7'),
  ('py-8'),('py-9'),('py-10'),('py-11'),('py-12'),('py-13'),('py-14'),
  ('py-15'),('py-16'),('py-17'),('py-18'),('py-19'),('py-20'),
  ('local-1'),('local-2'),('local-3'),('local-4'),('local-5'),('local-6'),
  ('local-7'),('local-8'),('local-9'),('local-10'),('local-11'),
  ('local-12'),('local-13'),('local-14'),('local-15')
ON CONFLICT DO NOTHING;

-- 4) Test registry
CREATE TABLE IF NOT EXISTS public.test_registry (
  id text PRIMARY KEY
);
GRANT SELECT ON public.test_registry TO authenticated;
GRANT ALL ON public.test_registry TO service_role;
ALTER TABLE public.test_registry ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read test registry"
  ON public.test_registry FOR SELECT TO authenticated USING (true);

INSERT INTO public.test_registry(id) VALUES
  ('test-basic'),('test-intermediate'),('test-expert')
ON CONFLICT DO NOTHING;

-- 5) Replace gamification + promo + admin RPCs to use registries / app_secrets

CREATE OR REPLACE FUNCTION public.award_lesson(_lesson_id text)
RETURNS public.profiles
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
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
  IF NOT EXISTS (SELECT 1 FROM public.lesson_registry WHERE id = _lesson_id) THEN
    RAISE EXCEPTION 'Unknown lesson id';
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
  IF _new_count >= 1  AND NOT 'lite'    = ANY(_badges) THEN _badges := array_append(_badges,'lite');    END IF;
  IF _new_count >= 5  AND NOT 'silver'  = ANY(_badges) THEN _badges := array_append(_badges,'silver');  END IF;
  IF _new_count >= 15 AND NOT 'gold'    = ANY(_badges) THEN _badges := array_append(_badges,'gold');    END IF;
  IF _new_count >= 25 AND NOT 'premium' = ANY(_badges) THEN _badges := array_append(_badges,'premium'); END IF;
  IF _new_count >= 50 AND NOT 'elite'   = ANY(_badges) THEN _badges := array_append(_badges,'elite');   END IF;
  _profile.badges := _badges;
  UPDATE public.profiles SET
    completed_lessons = _profile.completed_lessons,
    xp = _profile.xp, sage_coins = _profile.sage_coins,
    level = _profile.level, badges = _profile.badges
  WHERE id = auth.uid()
  RETURNING * INTO _profile;
  RETURN _profile;
END;
$$;

CREATE OR REPLACE FUNCTION public.complete_test(_test_id text)
RETURNS public.profiles
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.redeem_promo(_code text)
RETURNS public.profiles
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.reply_suggestion(_id uuid, _reply text, _password text)
RETURNS public.suggestions
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _row public.suggestions;
  _admin_pw text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT value INTO _admin_pw FROM public.app_secrets WHERE key = 'admin_password';
  IF _admin_pw IS NULL OR _password IS NULL OR _password <> _admin_pw THEN
    RAISE EXCEPTION 'Invalid admin password';
  END IF;
  IF _reply IS NULL OR length(btrim(_reply)) = 0 OR length(_reply) > 1000 THEN
    RAISE EXCEPTION 'Invalid reply';
  END IF;
  UPDATE public.suggestions
    SET reply = _reply, reply_at = now()
    WHERE id = _id
    RETURNING * INTO _row;
  IF _row IS NULL THEN RAISE EXCEPTION 'Suggestion not found'; END IF;
  RETURN _row;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_edit_suggestion(_id uuid, _text text, _password text)
RETURNS public.suggestions
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _row public.suggestions;
  _admin_pw text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT value INTO _admin_pw FROM public.app_secrets WHERE key = 'admin_password';
  IF _admin_pw IS NULL OR _password IS NULL OR _password <> _admin_pw THEN
    RAISE EXCEPTION 'Invalid admin password';
  END IF;
  IF _text IS NULL OR length(btrim(_text)) = 0 OR length(_text) > 500 THEN
    RAISE EXCEPTION 'Invalid text';
  END IF;
  UPDATE public.suggestions
    SET text = _text, updated_at = now()
    WHERE id = _id
    RETURNING * INTO _row;
  IF _row IS NULL THEN RAISE EXCEPTION 'Suggestion not found'; END IF;
  RETURN _row;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_suggestion(_id uuid, _password text)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _admin_pw text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT value INTO _admin_pw FROM public.app_secrets WHERE key = 'admin_password';
  IF _admin_pw IS NULL OR _password IS NULL OR _password <> _admin_pw THEN
    RAISE EXCEPTION 'Invalid admin password';
  END IF;
  DELETE FROM public.suggestions WHERE id = _id;
  RETURN true;
END;
$$;

-- 6) Restrict EXECUTE on SECURITY DEFINER functions to authenticated users only
REVOKE EXECUTE ON FUNCTION
  public.award_lesson(text),
  public.complete_test(text),
  public.redeem_promo(text),
  public.buy_freeze_streak(),
  public.update_streak(),
  public.reply_suggestion(uuid, text, text),
  public.admin_edit_suggestion(uuid, text, text),
  public.admin_delete_suggestion(uuid, text)
FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION
  public.award_lesson(text),
  public.complete_test(text),
  public.redeem_promo(text),
  public.buy_freeze_streak(),
  public.update_streak(),
  public.reply_suggestion(uuid, text, text),
  public.admin_edit_suggestion(uuid, text, text),
  public.admin_delete_suggestion(uuid, text)
TO authenticated;

-- 7) Profiles policies: scope to authenticated role explicitly
DROP POLICY IF EXISTS "Users can view own profile"   ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON public.profiles FOR DELETE TO authenticated
  USING (auth.uid() = id);
