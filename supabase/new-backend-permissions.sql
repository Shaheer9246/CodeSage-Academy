-- ============================================================================
-- CodeSage Academy — NEW BACKEND PERMISSION REPAIR SCRIPT
-- Run this in the NEW project's SQL editor AFTER importing your .sql dump.
-- Safe to re-run as many times as you like (idempotent).
-- ============================================================================

-- 1. Schema usage -----------------------------------------------------------
GRANT USAGE ON SCHEMA public TO authenticated, service_role;
REVOKE USAGE ON SCHEMA public FROM anon;

-- 2. Table privileges -------------------------------------------------------
-- User-facing tables the app reads/writes as a signed-in user.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles            TO authenticated;
GRANT SELECT, INSERT, UPDATE         ON public.enrollments         TO authenticated;
GRANT SELECT, UPDATE                 ON public.announcements       TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.announcement_reads  TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.suggestions         TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.suggestion_votes    TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.suggestion_reads    TO authenticated;
GRANT SELECT                         ON public.track_stats         TO authenticated;

-- Read-only public view used by the community page.
GRANT SELECT ON public.suggestions_public TO authenticated;

-- Internal reference tables: used ONLY inside security-definer functions.
-- Deliberately NO grants to authenticated/anon.
GRANT ALL ON public.lesson_registry TO service_role;
GRANT ALL ON public.test_registry   TO service_role;
GRANT ALL ON public.badge_levels    TO service_role;
GRANT ALL ON public.user_roles      TO service_role;
GRANT ALL ON public.promo_codes     TO service_role;

-- service_role owns everything else (edge functions / admin).
GRANT ALL ON ALL TABLES    IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Nothing for anonymous visitors.
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;

-- 3. Function privileges ----------------------------------------------------
-- Postgres grants EXECUTE to PUBLIC by default: strip that, then re-grant.
DO $$
DECLARE f record;
BEGIN
  FOR f IN
    SELECT p.oid::regprocedure AS sig
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.prokind = 'f'
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon', f.sig);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated, service_role', f.sig);
  END LOOP;
END $$;

-- 4. Default privileges for anything created later --------------------------
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON SEQUENCES TO service_role;

-- 5. Row Level Security must be ON for every public table -------------------
DO $$
DECLARE t record;
BEGIN
  FOR t IN
    SELECT c.relname
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind = 'r'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t.relname);
  END LOOP;
END $$;

-- 6. The new-user trigger (dumps often skip auth-schema triggers) ------------
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Make yourself admin (edit the email) -----------------------------------
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE lower(email) = lower('shaheerwrites703@gmail.com')
  AND email_confirmed_at IS NOT NULL
ON CONFLICT DO NOTHING;

-- 8. Sanity check — should all return rows without errors -------------------
-- SELECT count(*) FROM public.profiles;
-- SELECT count(*) FROM public.lesson_registry;
-- SELECT proname FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' ORDER BY 1;
