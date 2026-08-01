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
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _track NOT IN ('frontend','networking','fullstack','freelance','real-freelance','python','local','sql','pythonexpert','ai-fundamentals','three3d','java') THEN
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
$function$;

REVOKE EXECUTE ON FUNCTION public.enroll_track(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.enroll_track(text) TO authenticated;

CREATE TABLE IF NOT EXISTS public.suggestion_votes (
  suggestion_id uuid NOT NULL REFERENCES public.suggestions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  value smallint NOT NULL CHECK (value IN (-1, 1)),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (suggestion_id, user_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.suggestion_votes TO authenticated;
GRANT ALL ON public.suggestion_votes TO service_role;

ALTER TABLE public.suggestion_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read votes"
  ON public.suggestion_votes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users manage own vote"
  ON public.suggestion_votes FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_suggestion_votes_updated_at
  BEFORE UPDATE ON public.suggestion_votes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER PUBLICATION supabase_realtime ADD TABLE public.suggestion_votes;