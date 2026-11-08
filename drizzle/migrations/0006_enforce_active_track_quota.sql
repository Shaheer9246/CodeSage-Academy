CREATE OR REPLACE FUNCTION public.enroll_track(_track text)
RETURNS public.enrollments
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _row public.enrollments;
  _previous_status text;
  _is_new boolean;
  _active_count integer;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF _track IS NULL OR _track NOT IN (
    'frontend', 'networking', 'cyber', 'fullstack', 'freelance', 'real-freelance',
    'python', 'local', 'sql', 'pythonexpert', 'ai-fundamentals',
    'intermediate-ai', 'advanced-ai', 'three3d', 'java', 'javaexpert',
    'cpp', 'cppexpert', 'c', 'cx'
  ) THEN
    RAISE EXCEPTION 'Invalid track';
  END IF;

  -- Serialize all enrollment changes for this user, including concurrent RPC calls.
  PERFORM 1 FROM public.profiles WHERE id = auth.uid() FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  SELECT e.status INTO _previous_status
  FROM public.enrollments e
  WHERE e.user_id = auth.uid() AND e.track = _track
  FOR UPDATE;

  _is_new := NOT FOUND;

  IF _previous_status IS DISTINCT FROM 'active' THEN
    SELECT count(*) INTO _active_count
    FROM public.enrollments
    WHERE user_id = auth.uid() AND status = 'active';

    IF _active_count >= 2 THEN
      RAISE EXCEPTION 'ACTIVE_TRACK_LIMIT: You can have at most 2 active courses.';
    END IF;
  END IF;

  INSERT INTO public.enrollments(user_id, track, status)
  VALUES (auth.uid(), _track, 'active')
  ON CONFLICT (user_id, track) DO UPDATE SET status = 'active'
  RETURNING * INTO _row;

  IF _is_new OR _previous_status = 'ended' THEN
    INSERT INTO public.track_stats(track, enrolled_count)
    VALUES (_track, 1)
    ON CONFLICT (track) DO UPDATE
      SET enrolled_count = public.track_stats.enrolled_count + 1,
          updated_at = now();
  END IF;

  RETURN _row;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_enrollment_status(_track text, _status text)
RETURNS public.enrollments
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _row public.enrollments;
  _previous_status text;
  _active_count integer;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF _track IS NULL OR _status NOT IN ('active', 'paused', 'ended') THEN
    RAISE EXCEPTION 'Invalid enrollment status';
  END IF;

  -- Use the same per-user lock as enroll_track to prevent parallel limit bypasses.
  PERFORM 1 FROM public.profiles WHERE id = auth.uid() FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  SELECT e.status INTO _previous_status
  FROM public.enrollments e
  WHERE e.user_id = auth.uid() AND e.track = _track
  FOR UPDATE;
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  IF _status = 'active' AND _previous_status <> 'active' THEN
    SELECT count(*) INTO _active_count
    FROM public.enrollments
    WHERE user_id = auth.uid() AND status = 'active';

    IF _active_count >= 2 THEN
      RAISE EXCEPTION 'ACTIVE_TRACK_LIMIT: You can have at most 2 active courses.';
    END IF;
  END IF;

  UPDATE public.enrollments
  SET status = _status
  WHERE user_id = auth.uid() AND track = _track
  RETURNING * INTO _row;

  IF _previous_status <> 'ended' AND _status = 'ended' THEN
    UPDATE public.track_stats
    SET enrolled_count = GREATEST(0, enrolled_count - 1), updated_at = now()
    WHERE track = _track;
  ELSIF _previous_status = 'ended' AND _status <> 'ended' THEN
    INSERT INTO public.track_stats(track, enrolled_count)
    VALUES (_track, 1)
    ON CONFLICT (track) DO UPDATE
      SET enrolled_count = public.track_stats.enrolled_count + 1,
          updated_at = now();
  END IF;

  RETURN _row;
END;
$function$;