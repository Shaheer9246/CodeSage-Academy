
-- 1) Backfill lesson_registry with every lesson id defined in the app data files
INSERT INTO public.lesson_registry (id) VALUES
  ('html-basics'),('html-1'),('html-2'),('html-3'),('html-4'),('html-5'),('html-6'),('html-7'),('html-8'),('html-9'),('html-10'),
  ('html-intermediate'),('html-int-1'),('html-int-2'),
  ('css-basics'),('css-1'),('css-2'),('css-3'),('css-4'),('css-5'),('css-6'),
  ('css-intermediate'),('css-int-1'),('css-int-2'),('css-int-3'),
  ('css-expert'),('css-exp-1'),('css-exp-2'),
  ('js-basics'),('js-1'),('js-2'),('js-3'),('js-4'),('js-5'),
  ('js-intermediate'),('js-int-1'),('js-int-2'),('js-int-3'),('js-int-4'),
  ('js-expert'),('js-exp-1'),('js-exp-2'),('js-exp-3'),
  ('react-basics'),('react-1'),('react-2'),('react-3'),('react-4'),
  ('react-intermediate'),('react-int-1'),
  ('react-expert'),('react-exp-1'),
  ('forms-validation'),('form-1'),('form-2'),
  ('accessibility-seo'),('a11y-1'),
  ('multimedia'),('multi-1'),('multi-2'),('multi-3'),
  ('pro-projects'),('pro-1'),('pro-2'),('pro-3'),
  ('real-projects'),('proj-1'),('proj-2'),
  ('net-1'),('net-2'),('net-3'),('net-4'),('net-5'),('net-6'),('net-7'),('net-8'),('net-9'),('net-10'),('net-11'),('net-12'),('net-13'),
  ('free-1'),('free-2'),('free-3'),('free-4'),('free-5'),('free-6'),('free-7'),('free-8'),('free-9'),('free-10'),('free-11'),('free-12'),
  ('py-01'),('py-2'),('py-3'),('py-4'),('py-5'),('py-6'),('py-7'),('py-8'),('py-9'),('py-10'),('py-11'),('py-12'),('py-13'),('py-14'),('py-15'),('py-16'),('py-17'),('py-18'),('py-19'),('py-20'),('py-21'),('py-22'),('py-23'),('py-24'),('py-26'),('py-27'),('py-28'),('py-29'),('py-30'),
  ('pyx-01'),
  ('local-1'),('local-2'),('local-3'),('local-4'),('local-5'),('local-6'),('local-7'),('local-8'),('local-9'),('local-10'),('local-11'),('local-12'),('local-13'),('local-14'),('local-15')
ON CONFLICT (id) DO NOTHING;

-- 2) Update the enrollment status function to keep track_stats.enrolled_count in sync
--    when a user ends an enrollment or reactivates an ended one.
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
$function$;
