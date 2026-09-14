-- Community Leaderboard RPC function
-- Optimized for ultra-low bandwidth: returns only top 30 active learners with public profile fields.
CREATE OR REPLACE FUNCTION public.get_community_leaderboard()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _result jsonb;
BEGIN
  SELECT COALESCE(jsonb_agg(row_to_json(t)::jsonb), '[]'::jsonb)
  INTO _result
  FROM (
    SELECT 
      p.id,
      COALESCE(NULLIF(p.name, ''), NULLIF(p.username, ''), 'Sage ' || SUBSTRING(COALESCE(p.student_id, p.id::text), 1, 6)) AS display_name,
      COALESCE(p.username, '') AS username,
      COALESCE(p.student_id, '') AS student_id,
      COALESCE(p.xp, 0) AS xp,
      COALESCE(p.streak_count, 0) AS streak,
      COALESCE(p.sage_coins, 0) AS coins,
      COALESCE(p.level, 1) AS level,
      COALESCE(array_length(p.completed_lessons, 1), 0) AS lessons_count
    FROM public.profiles p
    WHERE COALESCE(p.xp, 0) > 0 OR COALESCE(p.streak_count, 0) > 0
    ORDER BY COALESCE(p.xp, 0) DESC, COALESCE(p.streak_count, 0) DESC, p.created_at ASC
    LIMIT 30
  ) t;
  
  RETURN _result;
END;
$function$;

REVOKE ALL ON FUNCTION public.get_community_leaderboard() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_community_leaderboard() TO anon, authenticated, service_role;
