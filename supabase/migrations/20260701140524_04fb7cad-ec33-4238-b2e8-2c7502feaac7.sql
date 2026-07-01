
-- 1. Rotate admin password to a new random value (old plaintext in git history is compromised)
UPDATE public.app_secrets
SET value = encode(gen_random_bytes(24), 'hex'), updated_at = now()
WHERE key = 'admin_password';

-- 2. Prevent username spoofing on suggestions: force username from caller's profile
CREATE OR REPLACE FUNCTION public.suggestions_guard()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
    NEW.updated_at := now();
    RETURN NEW;
  END IF;
  RETURN NEW;
END;
$function$;

-- 3. Revoke EXECUTE on SECURITY DEFINER functions from anon and PUBLIC
REVOKE EXECUTE ON FUNCTION public.award_lesson(text) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.complete_test(text) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_streak() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.redeem_promo(text) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.reply_suggestion(uuid, text, text) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.admin_edit_suggestion(uuid, text, text) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.admin_delete_suggestion(uuid, text) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.buy_freeze_streak() FROM anon, PUBLIC;

-- 4. Hide public tables from anonymous GraphQL/REST clients
REVOKE ALL ON public.profiles FROM anon;
REVOKE ALL ON public.suggestions FROM anon;
REVOKE ALL ON public.lesson_registry FROM anon;
REVOKE ALL ON public.test_registry FROM anon;
REVOKE ALL ON public.promo_codes FROM anon;
REVOKE ALL ON public.app_secrets FROM anon, authenticated;
