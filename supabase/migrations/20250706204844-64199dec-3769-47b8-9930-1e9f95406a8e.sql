
-- Add duration and distance fields to workout_sets table to support different exercise types
ALTER TABLE public.workout_sets 
ADD COLUMN duration INTEGER DEFAULT NULL,
ADD COLUMN distance NUMERIC DEFAULT NULL;

-- Update the get_last_exercise_weight function to be more comprehensive
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
SET search_path = public
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
