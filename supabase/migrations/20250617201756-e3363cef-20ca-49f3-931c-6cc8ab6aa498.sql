
-- Create a table for Valhalla workout scores
CREATE TABLE public.valhalla_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_id TEXT NOT NULL,
  score_seconds INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security for valhalla_scores
ALTER TABLE public.valhalla_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own valhalla scores" ON public.valhalla_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own valhalla scores" ON public.valhalla_scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own valhalla scores" ON public.valhalla_scores FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own valhalla scores" ON public.valhalla_scores FOR DELETE USING (auth.uid() = user_id);
