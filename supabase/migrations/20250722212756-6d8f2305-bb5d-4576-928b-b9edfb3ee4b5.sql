-- Fix database function security by updating search_path settings
-- This prevents SQL injection attacks through search_path manipulation

-- Update get_last_exercise_weight function
CREATE OR REPLACE FUNCTION public.get_last_exercise_weight(p_exercise_name TEXT)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  last_weight NUMERIC;
BEGIN
  SELECT
    ws.weight INTO last_weight
  FROM
    public.workout_sets ws
    JOIN public.workout_exercises we ON ws.workout_exercise_id = we.id
    JOIN public.workouts w ON we.workout_id = w.id
  WHERE
    w.user_id = auth.uid()
    AND we.name = p_exercise_name
    AND ws.weight > 0
  ORDER BY
    w.start_time DESC,
    we."order" DESC,
    ws."order" DESC
  LIMIT 1;

  RETURN COALESCE(last_weight, 0);
END;
$$;

-- Update get_last_exercise_data function
CREATE OR REPLACE FUNCTION public.get_last_exercise_data(p_exercise_name TEXT)
RETURNS TABLE(
  last_weight NUMERIC,
  last_reps INTEGER,
  last_duration INTEGER,
  last_distance NUMERIC,
  last_used TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ws.weight,
    ws.reps,
    ws.duration,
    ws.distance,
    w.end_time
  FROM
    public.workout_sets ws
    JOIN public.workout_exercises we ON ws.workout_exercise_id = we.id
    JOIN public.workouts w ON we.workout_id = w.id
  WHERE
    w.user_id = auth.uid()
    AND we.name = p_exercise_name
    AND w.end_time IS NOT NULL
    AND ws.completed = true
  ORDER BY
    w.end_time DESC,
    we."order" DESC,
    ws."order" DESC
  LIMIT 1;
END;
$$;

-- Update get_hero_call_streak function
CREATE OR REPLACE FUNCTION public.get_hero_call_streak(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  current_streak INTEGER := 0;
  last_completion_date DATE;
  check_date DATE;
BEGIN
  -- Get the most recent completion date
  SELECT DATE(completed_at) INTO last_completion_date
  FROM public.hero_call_completions
  WHERE user_id = p_user_id
  ORDER BY completed_at DESC
  LIMIT 1;
  
  -- If no completions, return 0
  IF last_completion_date IS NULL THEN
    RETURN 0;
  END IF;
  
  -- If last completion wasn't today or yesterday, streak is broken
  IF last_completion_date < CURRENT_DATE - INTERVAL '1 day' THEN
    RETURN 0;
  END IF;
  
  -- Count consecutive days backwards from the most recent completion
  check_date := last_completion_date;
  
  WHILE EXISTS (
    SELECT 1 
    FROM public.hero_call_completions 
    WHERE user_id = p_user_id 
    AND DATE(completed_at) = check_date
  ) LOOP
    current_streak := current_streak + 1;
    check_date := check_date - INTERVAL '1 day';
  END LOOP;
  
  RETURN current_streak;
END;
$$;

-- Update get_hero_call_weekly_count function
CREATE OR REPLACE FUNCTION public.get_hero_call_weekly_count(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  weekly_count INTEGER := 0;
  week_start DATE;
BEGIN
  -- Calculate start of current week (Monday)
  week_start := DATE_TRUNC('week', CURRENT_DATE);
  
  -- Count unique days with completions this week
  SELECT COUNT(DISTINCT DATE(completed_at)) INTO weekly_count
  FROM public.hero_call_completions
  WHERE user_id = p_user_id
  AND completed_at >= week_start
  AND completed_at < week_start + INTERVAL '7 days';
  
  RETURN weekly_count;
END;
$$;

-- Update hero_call_completed_today function
CREATE OR REPLACE FUNCTION public.hero_call_completed_today(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.hero_call_completions
    WHERE user_id = p_user_id
    AND DATE(completed_at) = CURRENT_DATE
  );
END;
$$;

-- Update calculate_valhalla_tier function  
CREATE OR REPLACE FUNCTION public.calculate_valhalla_tier(challenge_name text, completion_time_minutes numeric)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Tier thresholds based on challenge difficulty and expected completion times
  IF challenge_name = 'THOR' THEN
    IF completion_time_minutes <= 8 THEN
      RETURN 'Berserker';
    ELSIF completion_time_minutes <= 12 THEN
      RETURN 'Warrior';
    ELSE
      RETURN 'Adept';
    END IF;
  ELSIF challenge_name = 'FENRIR' THEN
    IF completion_time_minutes <= 15 THEN
      RETURN 'Berserker';
    ELSIF completion_time_minutes <= 25 THEN
      RETURN 'Warrior';
    ELSE
      RETURN 'Adept';
    END IF;
  ELSIF challenge_name = 'HEL' THEN
    IF completion_time_minutes <= 20 THEN
      RETURN 'Berserker';
    ELSIF completion_time_minutes <= 30 THEN
      RETURN 'Warrior';
    ELSE
      RETURN 'Adept';
    END IF;
  ELSIF challenge_name = 'NJORD' THEN
    IF completion_time_minutes <= 18 THEN
      RETURN 'Berserker';
    ELSIF completion_time_minutes <= 28 THEN
      RETURN 'Warrior';
    ELSE
      RETURN 'Adept';
    END IF;
  ELSIF challenge_name = 'ODIN' THEN
    IF completion_time_minutes <= 12 THEN
      RETURN 'Berserker';
    ELSIF completion_time_minutes <= 20 THEN
      RETURN 'Warrior';
    ELSE
      RETURN 'Adept';
    END IF;
  ELSE
    RETURN 'Adept';
  END IF;
END;
$$;

-- Update record_valhalla_challenge function
CREATE OR REPLACE FUNCTION public.record_valhalla_challenge(p_challenge_name text, p_completion_time_minutes numeric, p_notes text DEFAULT NULL::text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_tier TEXT;
  v_rune_name TEXT;
  v_existing_tier TEXT;
  v_challenge_id UUID;
  v_is_new_rune BOOLEAN := FALSE;
  v_is_tier_upgrade BOOLEAN := FALSE;
BEGIN
  -- Calculate tier
  v_tier := calculate_valhalla_tier(p_challenge_name, p_completion_time_minutes);
  
  -- Map challenge to rune name
  IF p_challenge_name = 'THOR' THEN
    v_rune_name := 'Rune of Thunder';
  ELSIF p_challenge_name = 'FENRIR' THEN
    v_rune_name := 'Rune of the Beast';
  ELSIF p_challenge_name = 'HEL' THEN
    v_rune_name := 'Rune of the Underworld';
  ELSIF p_challenge_name = 'NJORD' THEN
    v_rune_name := 'Rune of the Sea';
  ELSIF p_challenge_name = 'ODIN' THEN
    v_rune_name := 'Rune of Wisdom';
  ELSE
    v_rune_name := 'Unknown Rune';
  END IF;
  
  -- Insert challenge record
  INSERT INTO valhalla_challenges (user_id, challenge_name, completion_time_minutes, tier, notes)
  VALUES (auth.uid(), p_challenge_name, p_completion_time_minutes, v_tier, p_notes)
  RETURNING id INTO v_challenge_id;
  
  -- Check existing rune
  SELECT highest_tier INTO v_existing_tier
  FROM valhalla_runes
  WHERE user_id = auth.uid() AND challenge_name = p_challenge_name;
  
  -- Determine if this is new or upgrade
  IF v_existing_tier IS NULL THEN
    v_is_new_rune := TRUE;
  ELSIF (v_tier = 'Berserker' AND v_existing_tier != 'Berserker') OR
        (v_tier = 'Warrior' AND v_existing_tier = 'Adept') THEN
    v_is_tier_upgrade := TRUE;
  END IF;
  
  -- Upsert rune record
  INSERT INTO valhalla_runes (user_id, challenge_name, rune_name, highest_tier, first_earned_at, last_updated_at)
  VALUES (auth.uid(), p_challenge_name, v_rune_name, v_tier, NOW(), NOW())
  ON CONFLICT (user_id, challenge_name)
  DO UPDATE SET
    highest_tier = CASE 
      WHEN (EXCLUDED.highest_tier = 'Berserker') OR 
           (EXCLUDED.highest_tier = 'Warrior' AND valhalla_runes.highest_tier = 'Adept')
      THEN EXCLUDED.highest_tier
      ELSE valhalla_runes.highest_tier
    END,
    last_updated_at = NOW();
  
  -- Return result with ceremony info
  RETURN jsonb_build_object(
    'challenge_id', v_challenge_id,
    'tier', v_tier,
    'rune_name', v_rune_name,
    'is_new_rune', v_is_new_rune,
    'is_tier_upgrade', v_is_tier_upgrade,
    'completion_time_minutes', p_completion_time_minutes
  );
END;
$$;

-- Update get_valhalla_progress function
CREATE OR REPLACE FUNCTION public.get_valhalla_progress()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN (
    SELECT jsonb_build_object(
      'runes', COALESCE(
        (SELECT jsonb_agg(
          jsonb_build_object(
            'challenge_name', challenge_name,
            'rune_name', rune_name,
            'highest_tier', highest_tier,
            'first_earned_at', first_earned_at,
            'last_updated_at', last_updated_at
          )
        )
        FROM valhalla_runes
        WHERE user_id = auth.uid()),
        '[]'::jsonb
      ),
      'best_times', COALESCE(
        (SELECT jsonb_object_agg(
          challenge_name,
          jsonb_build_object(
            'best_time_minutes', MIN(completion_time_minutes),
            'best_tier', (
              SELECT tier 
              FROM valhalla_challenges vc2 
              WHERE vc2.user_id = auth.uid() 
              AND vc2.challenge_name = vc1.challenge_name 
              AND vc2.completion_time_minutes = MIN(vc1.completion_time_minutes)
              LIMIT 1
            ),
            'total_attempts', COUNT(*),
            'last_attempt', MAX(completed_at)
          )
        )
        FROM valhalla_challenges vc1
        WHERE user_id = auth.uid()
        GROUP BY challenge_name),
        '{}'::jsonb
      )
    )
  );
END;
$$;

-- Update get_user_workouts function
CREATE OR REPLACE FUNCTION public.get_user_workouts()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN (
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', w.id,
        'name', w.name,
        'startTime', w.start_time,
        'endTime', w.end_time,
        'notes', w.notes,
        'exercises', (
          SELECT COALESCE(jsonb_agg(
            jsonb_build_object(
              'id', we.id,
              'name', we.name,
              'sets', (
                SELECT COALESCE(jsonb_agg(
                  jsonb_build_object(
                    'id', ws.id,
                    'reps', ws.reps,
                    'weight', ws.weight,
                    'completed', ws.completed
                  ) ORDER BY ws."order"
                ), '[]'::jsonb)
                FROM public.workout_sets ws
                WHERE ws.workout_exercise_id = we.id
              )
            ) ORDER BY we."order"
          ), '[]'::jsonb)
          FROM public.workout_exercises we
          WHERE we.workout_id = w.id
        )
      ) ORDER BY w.start_time DESC
    )
    FROM public.workouts w
    WHERE w.user_id = auth.uid()
  );
END;
$$;