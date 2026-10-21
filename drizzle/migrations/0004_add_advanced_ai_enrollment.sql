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
    'intermediate-ai', 'advanced-ai', 'three3d', 'java', 'javaexpert',
    'cpp', 'cppexpert', 'c', 'cx'
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
$function$;