
-- Create a table for runs
CREATE TABLE public.runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  distance NUMERIC NOT NULL,
  duration INTEGER NOT NULL, -- in seconds
  run_type TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  notes TEXT,
  elevation INTEGER,
  avg_hr INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security for runs
ALTER TABLE public.runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own runs" ON public.runs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own runs" ON public.runs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own runs" ON public.runs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own runs" ON public.runs FOR DELETE USING (auth.uid() = user_id);
