
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS has_seen_tour boolean DEFAULT false;

CREATE OR REPLACE FUNCTION public.admin_edit_suggestion(_id uuid, _text text, _password text)
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
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _password IS NULL OR _password <> 'codesage-admin-2026' THEN
    RAISE EXCEPTION 'Invalid admin password';
  END IF;
  DELETE FROM public.suggestions WHERE id = _id;
  RETURN true;
END;
$$;
