REVOKE ALL ON public.enrollments FROM anon;
REVOKE ALL ON public.announcements FROM anon;
REVOKE ALL ON public.announcement_reads FROM anon;
REVOKE ALL ON public.suggestion_reads FROM anon;
REVOKE ALL ON public.track_stats FROM anon;
GRANT SELECT ON public.track_stats TO anon;

REVOKE ALL ON FUNCTION public.suggestions_guard() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.assign_student_id() FROM PUBLIC, anon;