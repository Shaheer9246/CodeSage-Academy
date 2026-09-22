REVOKE EXECUTE ON FUNCTION public.award_lesson_v2(text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.purchase_extra_lesson(text) FROM anon;
REVOKE SELECT ON public.badge_levels FROM anon;
REVOKE SELECT ON public.badge_levels FROM authenticated;