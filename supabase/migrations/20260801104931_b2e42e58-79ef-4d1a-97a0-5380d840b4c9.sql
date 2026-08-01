ALTER TABLE public.suggestion_votes DROP CONSTRAINT IF EXISTS suggestion_votes_value_check;
ALTER TABLE public.suggestion_votes DROP COLUMN IF EXISTS value;
ALTER TABLE public.suggestion_votes ADD COLUMN IF NOT EXISTS vote_type text NOT NULL DEFAULT 'up';
ALTER TABLE public.suggestion_votes ADD CONSTRAINT suggestion_votes_vote_type_check CHECK (vote_type IN ('up','down'));

ALTER TABLE public.suggestions ADD COLUMN IF NOT EXISTS upvotes integer NOT NULL DEFAULT 0;
ALTER TABLE public.suggestions ADD COLUMN IF NOT EXISTS downvotes integer NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.sync_suggestion_vote_counts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _sid uuid := COALESCE(NEW.suggestion_id, OLD.suggestion_id);
BEGIN
  UPDATE public.suggestions s SET
    upvotes = (SELECT count(*) FROM public.suggestion_votes v WHERE v.suggestion_id = _sid AND v.vote_type = 'up'),
    downvotes = (SELECT count(*) FROM public.suggestion_votes v WHERE v.suggestion_id = _sid AND v.vote_type = 'down')
  WHERE s.id = _sid;
  RETURN NULL;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.sync_suggestion_vote_counts() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS suggestion_votes_sync ON public.suggestion_votes;
CREATE TRIGGER suggestion_votes_sync
AFTER INSERT OR UPDATE OR DELETE ON public.suggestion_votes
FOR EACH ROW EXECUTE FUNCTION public.sync_suggestion_vote_counts();

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
$function$;