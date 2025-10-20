-- Create muscle group volume goals table
CREATE TABLE public.muscle_group_volume_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  muscle_group TEXT NOT NULL,
  weekly_target_sets INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, muscle_group)
);

-- Enable RLS
ALTER TABLE public.muscle_group_volume_goals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own muscle group goals"
  ON public.muscle_group_volume_goals
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own muscle group goals"
  ON public.muscle_group_volume_goals
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own muscle group goals"
  ON public.muscle_group_volume_goals
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own muscle group goals"
  ON public.muscle_group_volume_goals
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER update_muscle_group_volume_goals_updated_at
  BEFORE UPDATE ON public.muscle_group_volume_goals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();