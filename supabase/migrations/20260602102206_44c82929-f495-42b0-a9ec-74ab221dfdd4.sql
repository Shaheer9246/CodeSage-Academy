
-- Suggestions table for community feedback
CREATE TABLE public.suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  username text NOT NULL DEFAULT '',
  text text NOT NULL,
  reply text,
  reply_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT suggestions_text_len CHECK (char_length(text) BETWEEN 1 AND 500),
  CONSTRAINT suggestions_reply_len CHECK (reply IS NULL OR char_length(reply) <= 1000)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.suggestions TO authenticated;
GRANT ALL ON public.suggestions TO service_role;

ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read all suggestions
CREATE POLICY "Suggestions are viewable by authenticated users"
  ON public.suggestions FOR SELECT TO authenticated USING (true);

-- Insert only your own row
CREATE POLICY "Users can insert own suggestion"
  ON public.suggestions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Update only your own row
CREATE POLICY "Users can update own suggestion"
  ON public.suggestions FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Delete only your own row
CREATE POLICY "Users can delete own suggestion"
  ON public.suggestions FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Trigger: bump updated_at and enforce one-per-day on insert, prevent reply column edits by users
CREATE OR REPLACE FUNCTION public.suggestions_guard()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF EXISTS (
      SELECT 1 FROM public.suggestions
      WHERE user_id = NEW.user_id
        AND created_at >= date_trunc('day', now())
    ) THEN
      RAISE EXCEPTION 'You can only post one suggestion per day';
    END IF;
    NEW.reply := NULL;
    NEW.reply_at := NULL;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Users may not modify reply fields via the table (only via reply_suggestion RPC which runs as definer and uses session_user check)
    IF (NEW.reply IS DISTINCT FROM OLD.reply) OR (NEW.reply_at IS DISTINCT FROM OLD.reply_at) THEN
      -- Allow if invoked by service_role / definer-context (session_user = postgres) — RPC uses SECURITY DEFINER and sets reply via direct update
      IF current_setting('role', true) IS NULL OR current_setting('role', true) <> 'service_role' THEN
        IF current_user <> 'postgres' THEN
          RAISE EXCEPTION 'Reply fields are admin-only';
        END IF;
      END IF;
    END IF;
    NEW.updated_at := now();
    RETURN NEW;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER suggestions_guard_trg
BEFORE INSERT OR UPDATE ON public.suggestions
FOR EACH ROW EXECUTE FUNCTION public.suggestions_guard();

-- Admin reply RPC (password verified server-side)
CREATE OR REPLACE FUNCTION public.reply_suggestion(_id uuid, _reply text, _password text)
RETURNS public.suggestions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _row public.suggestions;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _password IS NULL OR _password <> 'codesage-admin-2026' THEN
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

REVOKE ALL ON FUNCTION public.reply_suggestion(uuid, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.reply_suggestion(uuid, text, text) TO authenticated;

-- Realtime
ALTER TABLE public.suggestions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.suggestions;
