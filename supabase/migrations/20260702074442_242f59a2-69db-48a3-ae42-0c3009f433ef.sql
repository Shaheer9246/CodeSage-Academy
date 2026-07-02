
-- 1. Student ID sequence and column
CREATE SEQUENCE IF NOT EXISTS public.student_id_seq START 1;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS student_id text UNIQUE;

CREATE OR REPLACE FUNCTION public.assign_student_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.student_id IS NULL THEN
    NEW.student_id := 'ID-CSA-' || lpad(nextval('public.student_id_seq')::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_assign_student_id ON public.profiles;
CREATE TRIGGER trg_assign_student_id
BEFORE INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.assign_student_id();

-- Backfill
UPDATE public.profiles
SET student_id = 'ID-CSA-' || lpad(nextval('public.student_id_seq')::text, 4, '0')
WHERE student_id IS NULL;

-- 2. Track stats (public counters)
CREATE TABLE IF NOT EXISTS public.track_stats (
  track text PRIMARY KEY,
  enrolled_count integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.track_stats TO authenticated, anon;
GRANT ALL ON public.track_stats TO service_role;
ALTER TABLE public.track_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read track stats" ON public.track_stats FOR SELECT USING (true);

INSERT INTO public.track_stats(track, enrolled_count) VALUES
  ('frontend', 200), ('networking', 140), ('fullstack', 90),
  ('freelance', 75), ('python', 180), ('local', 60), ('pythonexpert', 45)
ON CONFLICT (track) DO NOTHING;

-- 3. Enrollments (per-user)
CREATE TABLE IF NOT EXISTS public.enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, track)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.enrollments TO authenticated;
GRANT ALL ON public.enrollments TO service_role;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own enrollments" ON public.enrollments
FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users update own enrollments" ON public.enrollments
FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. Enroll RPC (idempotent, bumps stats only on new enrollment)
CREATE OR REPLACE FUNCTION public.enroll_track(_track text)
RETURNS public.enrollments
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _row public.enrollments;
  _existed boolean;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _track NOT IN ('frontend','networking','fullstack','freelance','python','local','pythonexpert') THEN
    RAISE EXCEPTION 'Invalid track';
  END IF;

  SELECT EXISTS(SELECT 1 FROM public.enrollments WHERE user_id = auth.uid() AND track = _track) INTO _existed;

  INSERT INTO public.enrollments(user_id, track, status)
  VALUES (auth.uid(), _track, 'active')
  ON CONFLICT (user_id, track) DO UPDATE SET status = 'active'
  RETURNING * INTO _row;

  IF NOT _existed THEN
    INSERT INTO public.track_stats(track, enrolled_count) VALUES (_track, 1)
    ON CONFLICT (track) DO UPDATE SET enrolled_count = public.track_stats.enrolled_count + 1, updated_at = now();
  END IF;

  RETURN _row;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.enroll_track(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.enroll_track(text) TO authenticated;

CREATE OR REPLACE FUNCTION public.update_enrollment_status(_track text, _status text)
RETURNS public.enrollments
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _row public.enrollments;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _status NOT IN ('active','paused','ended') THEN RAISE EXCEPTION 'Invalid status'; END IF;
  UPDATE public.enrollments SET status = _status
    WHERE user_id = auth.uid() AND track = _track
    RETURNING * INTO _row;
  RETURN _row;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.update_enrollment_status(text,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_enrollment_status(text,text) TO authenticated;

-- 5. Announcements (Inbox)
CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth users read announcements" ON public.announcements
FOR SELECT TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.announcement_reads (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  announcement_id uuid NOT NULL REFERENCES public.announcements(id) ON DELETE CASCADE,
  read_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, announcement_id)
);

GRANT SELECT, INSERT ON public.announcement_reads TO authenticated;
GRANT ALL ON public.announcement_reads TO service_role;
ALTER TABLE public.announcement_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own reads" ON public.announcement_reads
FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.post_announcement(_title text, _body text, _password text)
RETURNS public.announcements
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _row public.announcements;
  _admin_pw text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT value INTO _admin_pw FROM public.app_secrets WHERE key = 'admin_password';
  IF _admin_pw IS NULL OR _password IS NULL OR _password <> _admin_pw THEN
    RAISE EXCEPTION 'Invalid admin password';
  END IF;
  IF _title IS NULL OR length(btrim(_title)) = 0 OR length(_title) > 200 THEN RAISE EXCEPTION 'Invalid title'; END IF;
  IF _body IS NULL OR length(btrim(_body)) = 0 OR length(_body) > 5000 THEN RAISE EXCEPTION 'Invalid body'; END IF;
  INSERT INTO public.announcements(title, body) VALUES (_title, _body) RETURNING * INTO _row;
  RETURN _row;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.post_announcement(text,text,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.post_announcement(text,text,text) TO authenticated;

CREATE OR REPLACE FUNCTION public.mark_announcement_read(_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  INSERT INTO public.announcement_reads(user_id, announcement_id)
  VALUES (auth.uid(), _id) ON CONFLICT DO NOTHING;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.mark_announcement_read(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mark_announcement_read(uuid) TO authenticated;

-- 6. Suggestion reads
CREATE TABLE IF NOT EXISTS public.suggestion_reads (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  last_seen_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.suggestion_reads TO authenticated;
GRANT ALL ON public.suggestion_reads TO service_role;
ALTER TABLE public.suggestion_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own suggestion reads" ON public.suggestion_reads
FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.mark_suggestions_read()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  INSERT INTO public.suggestion_reads(user_id, last_seen_at)
  VALUES (auth.uid(), now())
  ON CONFLICT (user_id) DO UPDATE SET last_seen_at = now();
END;
$$;

REVOKE EXECUTE ON FUNCTION public.mark_suggestions_read() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mark_suggestions_read() TO authenticated;
