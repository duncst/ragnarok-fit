
-- Create table for tracking individual Valhalla challenge attempts
CREATE TABLE public.valhalla_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_name TEXT NOT NULL,
  completion_time_minutes NUMERIC NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('Adept', 'Warrior', 'Berserker')),
  notes TEXT,
  quarter_year INTEGER NOT NULL DEFAULT EXTRACT(QUARTER FROM NOW()),
  quarter_date DATE NOT NULL DEFAULT DATE_TRUNC('quarter', NOW()),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create table for tracking earned runes
CREATE TABLE public.valhalla_runes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_name TEXT NOT NULL,
  rune_name TEXT NOT NULL,
  highest_tier TEXT NOT NULL CHECK (highest_tier IN ('Adept', 'Warrior', 'Berserker')),
  first_earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, challenge_name)
);

-- Enable Row Level Security
ALTER TABLE public.valhalla_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valhalla_runes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for valhalla_challenges
CREATE POLICY "Users can view their own challenges" ON public.valhalla_challenges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own challenges" ON public.valhalla_challenges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own challenges" ON public.valhalla_challenges FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own challenges" ON public.valhalla_challenges FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for valhalla_runes
CREATE POLICY "Users can view their own runes" ON public.valhalla_runes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own runes" ON public.valhalla_runes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own runes" ON public.valhalla_runes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own runes" ON public.valhalla_runes FOR DELETE USING (auth.uid() = user_id);

-- Public policy to allow viewing runes for Brotherhood Ledger (leaderboard)
CREATE POLICY "Public can view runes for leaderboard" ON public.valhalla_runes FOR SELECT USING (true);

-- Function to calculate tier based on completion time
CREATE OR REPLACE FUNCTION public.calculate_valhalla_tier(challenge_name TEXT, completion_time_minutes NUMERIC)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  -- Tier thresholds based on challenge difficulty and expected completion times
  IF challenge_name = 'THOR' THEN
    IF completion_time_minutes <= 8 THEN
      RETURN 'Berserker';
    ELSIF completion_time_minutes <= 12 THEN
      RETURN 'Warrior';
    ELSE
      RETURN 'Adept';
    END IF;
  ELSIF challenge_name = 'FENRIR' THEN
    IF completion_time_minutes <= 15 THEN
      RETURN 'Berserker';
    ELSIF completion_time_minutes <= 25 THEN
      RETURN 'Warrior';
    ELSE
      RETURN 'Adept';
    END IF;
  ELSIF challenge_name = 'HEL' THEN
    IF completion_time_minutes <= 20 THEN
      RETURN 'Berserker';
    ELSIF completion_time_minutes <= 30 THEN
      RETURN 'Warrior';
    ELSE
      RETURN 'Adept';
    END IF;
  ELSIF challenge_name = 'NJORD' THEN
    IF completion_time_minutes <= 18 THEN
      RETURN 'Berserker';
    ELSIF completion_time_minutes <= 28 THEN
      RETURN 'Warrior';
    ELSE
      RETURN 'Adept';
    END IF;
  ELSIF challenge_name = 'ODIN' THEN
    IF completion_time_minutes <= 12 THEN
      RETURN 'Berserker';
    ELSIF completion_time_minutes <= 20 THEN
      RETURN 'Warrior';
    ELSE
      RETURN 'Adept';
    END IF;
  ELSE
    RETURN 'Adept';
  END IF;
END;
$$;

-- Function to upsert Valhalla challenge and manage runes
CREATE OR REPLACE FUNCTION public.record_valhalla_challenge(
  p_challenge_name TEXT,
  p_completion_time_minutes NUMERIC,
  p_notes TEXT DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_tier TEXT;
  v_rune_name TEXT;
  v_existing_tier TEXT;
  v_challenge_id UUID;
  v_is_new_rune BOOLEAN := FALSE;
  v_is_tier_upgrade BOOLEAN := FALSE;
BEGIN
  -- Calculate tier
  v_tier := calculate_valhalla_tier(p_challenge_name, p_completion_time_minutes);
  
  -- Map challenge to rune name
  IF p_challenge_name = 'THOR' THEN
    v_rune_name := 'Rune of Thunder';
  ELSIF p_challenge_name = 'FENRIR' THEN
    v_rune_name := 'Rune of the Beast';
  ELSIF p_challenge_name = 'HEL' THEN
    v_rune_name := 'Rune of the Underworld';
  ELSIF p_challenge_name = 'NJORD' THEN
    v_rune_name := 'Rune of the Sea';
  ELSIF p_challenge_name = 'ODIN' THEN
    v_rune_name := 'Rune of Wisdom';
  ELSE
    v_rune_name := 'Unknown Rune';
  END IF;
  
  -- Insert challenge record
  INSERT INTO valhalla_challenges (user_id, challenge_name, completion_time_minutes, tier, notes)
  VALUES (auth.uid(), p_challenge_name, p_completion_time_minutes, v_tier, p_notes)
  RETURNING id INTO v_challenge_id;
  
  -- Check existing rune
  SELECT highest_tier INTO v_existing_tier
  FROM valhalla_runes
  WHERE user_id = auth.uid() AND challenge_name = p_challenge_name;
  
  -- Determine if this is new or upgrade
  IF v_existing_tier IS NULL THEN
    v_is_new_rune := TRUE;
  ELSIF (v_tier = 'Berserker' AND v_existing_tier != 'Berserker') OR
        (v_tier = 'Warrior' AND v_existing_tier = 'Adept') THEN
    v_is_tier_upgrade := TRUE;
  END IF;
  
  -- Upsert rune record
  INSERT INTO valhalla_runes (user_id, challenge_name, rune_name, highest_tier, first_earned_at, last_updated_at)
  VALUES (auth.uid(), p_challenge_name, v_rune_name, v_tier, NOW(), NOW())
  ON CONFLICT (user_id, challenge_name)
  DO UPDATE SET
    highest_tier = CASE 
      WHEN (EXCLUDED.highest_tier = 'Berserker') OR 
           (EXCLUDED.highest_tier = 'Warrior' AND valhalla_runes.highest_tier = 'Adept')
      THEN EXCLUDED.highest_tier
      ELSE valhalla_runes.highest_tier
    END,
    last_updated_at = NOW();
  
  -- Return result with ceremony info
  RETURN jsonb_build_object(
    'challenge_id', v_challenge_id,
    'tier', v_tier,
    'rune_name', v_rune_name,
    'is_new_rune', v_is_new_rune,
    'is_tier_upgrade', v_is_tier_upgrade,
    'completion_time_minutes', p_completion_time_minutes
  );
END;
$$;

-- Function to get user's Valhalla progress
CREATE OR REPLACE FUNCTION public.get_valhalla_progress()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN (
    SELECT jsonb_build_object(
      'runes', COALESCE(
        (SELECT jsonb_agg(
          jsonb_build_object(
            'challenge_name', challenge_name,
            'rune_name', rune_name,
            'highest_tier', highest_tier,
            'first_earned_at', first_earned_at,
            'last_updated_at', last_updated_at
          )
        )
        FROM valhalla_runes
        WHERE user_id = auth.uid()),
        '[]'::jsonb
      ),
      'best_times', COALESCE(
        (SELECT jsonb_object_agg(
          challenge_name,
          jsonb_build_object(
            'best_time_minutes', MIN(completion_time_minutes),
            'best_tier', (
              SELECT tier 
              FROM valhalla_challenges vc2 
              WHERE vc2.user_id = auth.uid() 
              AND vc2.challenge_name = vc1.challenge_name 
              AND vc2.completion_time_minutes = MIN(vc1.completion_time_minutes)
              LIMIT 1
            ),
            'total_attempts', COUNT(*),
            'last_attempt', MAX(completed_at)
          )
        )
        FROM valhalla_challenges vc1
        WHERE user_id = auth.uid()
        GROUP BY challenge_name),
        '{}'::jsonb
      )
    )
  );
END;
$$;
