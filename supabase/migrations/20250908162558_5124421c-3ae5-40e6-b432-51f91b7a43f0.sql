-- Add weekly distance goals table
CREATE TABLE public.weekly_distance_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL DEFAULT auth.uid(),
  target_distance NUMERIC NOT NULL,
  week_start DATE NOT NULL DEFAULT date_trunc('week', CURRENT_DATE),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure one goal per user per week
  UNIQUE(user_id, week_start)
);

-- Enable Row Level Security
ALTER TABLE public.weekly_distance_goals ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own weekly goals" 
ON public.weekly_distance_goals 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own weekly goals" 
ON public.weekly_distance_goals 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly goals" 
ON public.weekly_distance_goals 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weekly goals" 
ON public.weekly_distance_goals 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_weekly_distance_goals_updated_at
BEFORE UPDATE ON public.weekly_distance_goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();