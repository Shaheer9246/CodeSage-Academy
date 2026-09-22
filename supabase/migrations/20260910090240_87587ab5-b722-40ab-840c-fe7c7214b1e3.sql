REVOKE INSERT, UPDATE ON public.profiles FROM authenticated;

GRANT INSERT (id, username, name, studying, has_job, dob, goal, experience_level, dark_mode, has_seen_tour) ON public.profiles TO authenticated;

GRANT UPDATE (username, name, studying, has_job, dob, goal, experience_level, dark_mode, has_seen_tour) ON public.profiles TO authenticated;

GRANT ALL ON public.profiles TO service_role;