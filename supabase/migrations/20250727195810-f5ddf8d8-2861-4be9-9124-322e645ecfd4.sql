-- Add notes column to brotherhood_activities table to store user comments
ALTER TABLE public.brotherhood_activities 
ADD COLUMN notes TEXT;