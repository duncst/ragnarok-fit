-- get_user_workouts previously omitted the duration/distance columns from
-- workout_sets, silently dropping time/distance based set data when a
-- workout was viewed in history or repeated via "Repeat Workout".
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
                    'completed', ws.completed,
                    'duration', ws.duration,
                    'distance', ws.distance
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
