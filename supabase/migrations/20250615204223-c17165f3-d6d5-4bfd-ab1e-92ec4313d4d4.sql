
-- Create table for body metrics
CREATE TABLE public.body_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  date TIMESTAMPTZ NOT NULL DEFAULT now(),
  weight NUMERIC,
  vo2_max NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.body_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own body metrics"
  ON public.body_metrics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own body metrics"
  ON public.body_metrics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own body metrics"
  ON public.body_metrics FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own body metrics"
  ON public.body_metrics FOR DELETE
  USING (auth.uid() = user_id);
