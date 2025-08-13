-- Create a SECURITY DEFINER function to compute forge titles for multiple users
-- This exposes only aggregate metadata (title, tier, forged weeks) and does not leak raw activity data
CREATE OR REPLACE FUNCTION public.get_users_forge_titles(p_user_ids uuid[])
RETURNS TABLE(user_id uuid, current_title text, current_tier integer, forged_weeks integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  uid uuid;
BEGIN
  FOR uid IN SELECT unnest(p_user_ids)
  LOOP
    RETURN QUERY
    WITH all_dates AS (
      SELECT DATE(hcc.completed_at) AS d
      FROM public.hero_call_completions hcc
      WHERE hcc.user_id = uid
      UNION ALL
      SELECT DATE(w.end_time)
      FROM public.workouts w
      WHERE w.user_id = uid AND w.end_time IS NOT NULL
      UNION ALL
      SELECT DATE(r.date)
      FROM public.runs r
      WHERE r.user_id = uid
      UNION ALL
      SELECT DATE(vc.completed_at)
      FROM public.valhalla_challenges vc
      WHERE vc.user_id = uid
    ),
    days_by_week AS (
      SELECT date_trunc('week', d)::date AS week_start, COUNT(DISTINCT d) AS day_count
      FROM all_dates
      GROUP BY 1
    ),
    forged_weeks_ct AS (
      SELECT COALESCE(COUNT(*), 0) AS fw FROM days_by_week WHERE day_count >= 5
    ),
    flags AS (
      SELECT 
        EXISTS(SELECT 1 FROM public.hero_call_completions WHERE user_id = uid) AS has_hero_call,
        EXISTS(SELECT 1 FROM public.runs WHERE user_id = uid) AS has_endurance,
        EXISTS(SELECT 1 FROM public.valhalla_challenges WHERE user_id = uid) AS has_valhalla,
        EXISTS(SELECT 1 FROM public.workouts WHERE user_id = uid AND end_time IS NOT NULL) AS has_strength
    )
    SELECT 
      uid AS user_id,
      CASE
        WHEN (SELECT fw FROM forged_weeks_ct) >= 52 THEN 'Unbroken'
        WHEN (SELECT fw FROM forged_weeks_ct) >= 26 THEN 'Blazeborn'
        WHEN (SELECT fw FROM forged_weeks_ct) >= 12 AND (SELECT has_valhalla FROM flags) THEN 'Ashwalker'
        WHEN (SELECT fw FROM forged_weeks_ct) >= 6 AND (SELECT has_hero_call FROM flags) AND (SELECT has_endurance FROM flags) AND (SELECT has_strength FROM flags) THEN 'Ironbound'
        WHEN (SELECT fw FROM forged_weeks_ct) >= 4 AND (SELECT has_endurance FROM flags) THEN 'Disciple of Flame'
        WHEN (SELECT fw FROM forged_weeks_ct) >= 3 AND (SELECT has_hero_call FROM flags) THEN 'Forge Adept'
        WHEN (SELECT fw FROM forged_weeks_ct) >= 1 THEN 'Kindled'
        WHEN EXISTS(SELECT 1 FROM all_dates) THEN 'Sparked'
        ELSE 'Sparked'
      END AS current_title,
      CASE
        WHEN (SELECT fw FROM forged_weeks_ct) >= 52 THEN 8
        WHEN (SELECT fw FROM forged_weeks_ct) >= 26 THEN 7
        WHEN (SELECT fw FROM forged_weeks_ct) >= 12 AND (SELECT has_valhalla FROM flags) THEN 6
        WHEN (SELECT fw FROM forged_weeks_ct) >= 6 AND (SELECT has_hero_call FROM flags) AND (SELECT has_endurance FROM flags) AND (SELECT has_strength FROM flags) THEN 5
        WHEN (SELECT fw FROM forged_weeks_ct) >= 4 AND (SELECT has_endurance FROM flags) THEN 4
        WHEN (SELECT fw FROM forged_weeks_ct) >= 3 AND (SELECT has_hero_call FROM flags) THEN 3
        WHEN (SELECT fw FROM forged_weeks_ct) >= 1 THEN 2
        WHEN EXISTS(SELECT 1 FROM all_dates) THEN 1
        ELSE 1
      END AS current_tier,
      (SELECT fw FROM forged_weeks_ct) AS forged_weeks;
  END LOOP;
END;
$$;

-- Allow authenticated users to execute this function
GRANT EXECUTE ON FUNCTION public.get_users_forge_titles(uuid[]) TO authenticated;