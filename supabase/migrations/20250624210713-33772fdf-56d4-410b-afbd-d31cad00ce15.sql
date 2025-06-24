
-- Create table for Hero's Call completions
CREATE TABLE public.hero_call_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  workout_name TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.hero_call_completions ENABLE ROW LEVEL SECURITY;

-- Create policies for users to manage their own completions
CREATE POLICY "Users can view their own hero call completions" 
  ON public.hero_call_completions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own hero call completions" 
  ON public.hero_call_completions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hero call completions" 
  ON public.hero_call_completions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hero call completions" 
  ON public.hero_call_completions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Function to get current streak for a user
CREATE OR REPLACE FUNCTION public.get_hero_call_streak(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Function to get weekly count for a user
CREATE OR REPLACE FUNCTION public.get_hero_call_weekly_count(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Function to check if user completed today
CREATE OR REPLACE FUNCTION public.hero_call_completed_today(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
