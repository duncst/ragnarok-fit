-- Backfill the brotherhood_activity_likes table + RPCs.
--
-- These already exist in the generated Supabase types (src/integrations/supabase/types.ts)
-- and useBrotherhoodLikes.ts already talks to them (via `as any` casts, since no
-- migration ever captured them), so this table/these functions likely already exist
-- in the live project. This migration is written to be safe to run against a database
-- that already has them (IF NOT EXISTS / guarded policy creation / CREATE OR REPLACE
-- for functions), so it backfills reproducibility without clobbering data. It has not
-- been verified against the live project's actual RLS policies, so review before
-- relying on it for a fresh environment.

CREATE TABLE IF NOT EXISTS public.brotherhood_activity_likes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_id uuid NOT NULL REFERENCES public.brotherhood_activities(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (activity_id, user_id)
);

ALTER TABLE public.brotherhood_activity_likes ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_brotherhood_activity_likes_activity_id
  ON public.brotherhood_activity_likes(activity_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'brotherhood_activity_likes'
      AND cmd = 'SELECT'
  ) THEN
    CREATE POLICY "Users can view all activity likes"
    ON public.brotherhood_activity_likes
    FOR SELECT
    USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'brotherhood_activity_likes'
      AND cmd = 'INSERT'
  ) THEN
    CREATE POLICY "Users can add their own likes"
    ON public.brotherhood_activity_likes
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'brotherhood_activity_likes'
      AND cmd = 'DELETE'
  ) THEN
    CREATE POLICY "Users can remove their own likes"
    ON public.brotherhood_activity_likes
    FOR DELETE
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- RPCs matching the shapes already declared in the generated Supabase types.
CREATE OR REPLACE FUNCTION public.add_activity_like(p_activity_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.brotherhood_activity_likes (activity_id, user_id)
  VALUES (p_activity_id, auth.uid())
  ON CONFLICT (activity_id, user_id) DO NOTHING;
END;
$$;

CREATE OR REPLACE FUNCTION public.remove_activity_like(p_activity_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  DELETE FROM public.brotherhood_activity_likes
  WHERE activity_id = p_activity_id AND user_id = auth.uid();
END;
$$;

CREATE OR REPLACE FUNCTION public.get_activity_likes(activity_ids uuid[])
RETURNS SETOF public.brotherhood_activity_likes
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
STABLE
AS $$
  SELECT * FROM public.brotherhood_activity_likes
  WHERE activity_id = ANY(activity_ids);
$$;
