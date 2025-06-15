
-- Create workout_templates table
CREATE TABLE public.workout_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  is_public boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT name_length_check CHECK (char_length(name) > 0)
);

-- Add RLS to workout_templates
ALTER TABLE public.workout_templates ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own templates, and all public templates.
CREATE POLICY "Users can view their own and public templates"
ON public.workout_templates
FOR SELECT
USING (user_id = auth.uid() OR is_public = true);

-- Policy: Users can insert their own templates.
CREATE POLICY "Users can insert their own templates"
ON public.workout_templates
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Policy: Users can update their own templates.
CREATE POLICY "Users can update their own templates"
ON public.workout_templates
FOR UPDATE
USING (user_id = auth.uid());

-- Policy: Users can delete their own templates.
CREATE POLICY "Users can delete their own templates"
ON public.workout_templates
FOR DELETE
USING (user_id = auth.uid());

-- Create workout_template_exercises table
CREATE TABLE public.workout_template_exercises (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_template_id uuid NOT NULL REFERENCES public.workout_templates(id) ON DELETE CASCADE,
  exercise_name text NOT NULL,
  sets integer NOT NULL,
  "order" integer NOT NULL
);

-- Add RLS to workout_template_exercises
ALTER TABLE public.workout_template_exercises ENABLE ROW LEVEL SECURITY;

-- Helper function to check if a user can access the parent template.
CREATE OR REPLACE FUNCTION public.can_view_template(template_id uuid)
RETURNS boolean AS $$
DECLARE
  is_public_template boolean;
  template_owner_id uuid;
BEGIN
  SELECT is_public, user_id INTO is_public_template, template_owner_id
  FROM public.workout_templates
  WHERE id = template_id;

  RETURN is_public_template OR template_owner_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Policy: Users can see exercises for templates they have access to.
CREATE POLICY "Users can view exercises of accessible templates"
ON public.workout_template_exercises
FOR SELECT
USING (public.can_view_template(workout_template_id));

-- Helper function for write operations.
CREATE OR REPLACE FUNCTION public.is_template_owner(template_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.workout_templates
    WHERE id = template_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Policy: Users can insert exercises for templates they own.
CREATE POLICY "Users can insert exercises for their own templates"
ON public.workout_template_exercises
FOR INSERT
WITH CHECK (public.is_template_owner(workout_template_id));

-- Policy: Users can update exercises for templates they own.
CREATE POLICY "Users can update exercises for their own templates"
ON public.workout_template_exercises
FOR UPDATE
USING (public.is_template_owner(workout_template_id));

-- Policy: Users can delete exercises for templates they own.
CREATE POLICY "Users can delete exercises for their own templates"
ON public.workout_template_exercises
FOR DELETE
USING (public.is_template_owner(workout_template_id));
