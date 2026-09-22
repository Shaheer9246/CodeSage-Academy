-- ==========================================================
-- CODESAGE AI TEACHER & 5 MONTHLY CREDITS SYSTEM
-- Run this in your Supabase SQL Editor:
-- ==========================================================

-- 1. Add AI credit tracking columns to the profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS ai_credits INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS ai_credits_month TEXT DEFAULT TO_CHAR(NOW(), 'YYYY-MM');

-- 2. Ensure existing profiles receive 5 default credits for current month
UPDATE public.profiles
SET 
  ai_credits = 5,
  ai_credits_month = TO_CHAR(NOW(), 'YYYY-MM')
WHERE ai_credits IS NULL;

-- 3. Helpful Database Function to check or refresh monthly credits for a user
CREATE OR REPLACE FUNCTION public.get_or_refresh_user_ai_credits(target_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_month_str TEXT := TO_CHAR(NOW(), 'YYYY-MM');
  user_credits INTEGER;
  user_last_month TEXT;
  user_is_pro BOOLEAN;
BEGIN
  SELECT ai_credits, ai_credits_month, COALESCE(is_pro, FALSE)
  INTO user_credits, user_last_month, user_is_pro
  FROM public.profiles
  WHERE id = target_user_id;

  -- Reset to 5 free credits (or 100 if PRO) if month changed or never initialized
  IF user_credits IS NULL OR user_last_month IS NULL OR user_last_month != current_month_str THEN
    user_credits := CASE WHEN user_is_pro THEN 100 ELSE 5 END;
    UPDATE public.profiles
    SET 
      ai_credits = user_credits,
      ai_credits_month = current_month_str
    WHERE id = target_user_id;
  END IF;

  RETURN user_credits;
END;
$$;

-- 4. Secure RLS policies verification
-- Users can view their own profiles and credits
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);
  END IF;
END $$;
