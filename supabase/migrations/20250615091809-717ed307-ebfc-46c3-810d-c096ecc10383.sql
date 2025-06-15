
CREATE OR REPLACE FUNCTION get_last_exercise_weight(p_exercise_name TEXT)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
