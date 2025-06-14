
-- Create a table for workouts
CREATE TABLE public.workouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  start_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_time TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security for workouts
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own workouts" ON public.workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own workouts" ON public.workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own workouts" ON public.workouts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own workouts" ON public.workouts FOR DELETE USING (auth.uid() = user_id);


-- Create a table for exercises within a workout
CREATE TABLE public.workout_exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  "order" INTEGER NOT NULL
);

-- Enable Row Level Security for workout_exercises
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage exercises for their own workouts" ON public.workout_exercises FOR ALL
USING (
  auth.uid() = (SELECT user_id FROM public.workouts WHERE id = workout_id)
);


-- Create a table for sets for each exercise
CREATE TABLE public.workout_sets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_exercise_id UUID NOT NULL REFERENCES public.workout_exercises(id) ON DELETE CASCADE,
  reps INTEGER NOT NULL,
  weight NUMERIC NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  "order" INTEGER NOT NULL
);

-- Enable Row Level Security for workout_sets
ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage sets for their own workouts" ON public.workout_sets FOR ALL
USING (
  auth.uid() = (
    SELECT w.user_id
    FROM public.workouts w
    JOIN public.workout_exercises we ON w.id = we.workout_id
    WHERE we.id = workout_exercise_id
  )
);

-- Create a function to easily fetch all workout data for a user
CREATE OR REPLACE FUNCTION get_user_workouts()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

