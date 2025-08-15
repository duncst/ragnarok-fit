-- Add privacy control to brotherhood_activities table
ALTER TABLE public.brotherhood_activities 
ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT false;

-- Update the RLS policy to respect privacy settings
DROP POLICY IF EXISTS "Anyone can view brotherhood activities" ON public.brotherhood_activities;

CREATE POLICY "Users can view public activities and their own activities" 
ON public.brotherhood_activities 
FOR SELECT 
USING (is_public = true OR auth.uid() = user_id);

-- Add policy for users to update their own activities (to change privacy settings)
CREATE POLICY "Users can update their own activities" 
ON public.brotherhood_activities 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create index for better performance on public activities queries
CREATE INDEX idx_brotherhood_activities_public ON public.brotherhood_activities(is_public, created_at DESC) WHERE is_public = true;