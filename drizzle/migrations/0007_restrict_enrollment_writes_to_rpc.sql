REVOKE INSERT, UPDATE, DELETE ON public.enrollments FROM authenticated;
GRANT SELECT ON public.enrollments TO authenticated;
GRANT ALL ON public.enrollments TO service_role;