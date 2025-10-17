-- Create table to track workout generation requests for rate limiting
CREATE TABLE IF NOT EXISTS public.workout_generation_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  ip_address text,
  success boolean NOT NULL DEFAULT true
);

-- Enable RLS
ALTER TABLE public.workout_generation_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own requests
CREATE POLICY "Users can view their own generation requests"
  ON public.workout_generation_requests
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own requests (function will handle this)
CREATE POLICY "Users can insert their own generation requests"
  ON public.workout_generation_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for efficient rate limit queries
CREATE INDEX idx_workout_generation_requests_user_created 
  ON public.workout_generation_requests(user_id, created_at DESC);

-- Function to check rate limits
CREATE OR REPLACE FUNCTION public.check_workout_generation_rate_limit(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  hourly_count INTEGER;
  daily_count INTEGER;
  hourly_limit INTEGER := 10;
  daily_limit INTEGER := 50;
BEGIN
  -- Count requests in last hour
  SELECT COUNT(*) INTO hourly_count
  FROM public.workout_generation_requests
  WHERE user_id = p_user_id
    AND created_at >= NOW() - INTERVAL '1 hour';
  
  -- Count requests in last 24 hours
  SELECT COUNT(*) INTO daily_count
  FROM public.workout_generation_requests
  WHERE user_id = p_user_id
    AND created_at >= NOW() - INTERVAL '24 hours';
  
  -- Return status and limits
  RETURN jsonb_build_object(
    'allowed', (hourly_count < hourly_limit AND daily_count < daily_limit),
    'hourly_count', hourly_count,
    'hourly_limit', hourly_limit,
    'daily_count', daily_count,
    'daily_limit', daily_limit,
    'hourly_remaining', GREATEST(0, hourly_limit - hourly_count),
    'daily_remaining', GREATEST(0, daily_limit - daily_count)
  );
END;
$$;