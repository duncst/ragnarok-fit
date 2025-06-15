
-- Secure the can_view_template function by setting a search_path
CREATE OR REPLACE FUNCTION public.can_view_template(template_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  is_public_template boolean;
  template_owner_id uuid;
BEGIN
  SELECT is_public, user_id INTO is_public_template, template_owner_id
  FROM public.workout_templates
  WHERE id = template_id;

  RETURN is_public_template OR template_owner_id = auth.uid();
END;
$$;

-- Secure the is_template_owner function by setting a search_path
CREATE OR REPLACE FUNCTION public.is_template_owner(template_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.workout_templates
    WHERE id = template_id AND user_id = auth.uid()
  );
END;
$$;
