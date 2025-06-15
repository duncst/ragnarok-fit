
-- Create table for personal records
CREATE TABLE public.personal_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,
  one_rep_max NUMERIC NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT personal_records_user_exercise_unique UNIQUE (user_id, exercise_name)
);

-- Add RLS policies
ALTER TABLE public.personal_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own PRs"
  ON public.personal_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own PRs"
  ON public.personal_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own PRs"
  ON public.personal_records FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own PRs"
  ON public.personal_records FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to upsert a PR
CREATE OR REPLACE FUNCTION public.upsert_personal_record(
  p_exercise_name TEXT,
  p_one_rep_max NUMERIC
)
RETURNS uuid -- returns the ID of the new/updated record, or null
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_pr_id UUID;
BEGIN
  INSERT INTO public.personal_records (user_id, exercise_name, one_rep_max, date)
  VALUES (auth.uid(), p_exercise_name, p_one_rep_max, now())
  ON CONFLICT (user_id, exercise_name)
  DO UPDATE SET
    one_rep_max = EXCLUDED.one_rep_max,
    date = EXCLUDED.date
  WHERE
    personal_records.one_rep_max < EXCLUDED.one_rep_max
  RETURNING public.personal_records.id INTO new_pr_id;

  RETURN new_pr_id;
END;
$$;
