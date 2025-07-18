import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useChallengeCount = () => {
  const { user } = useAuth();

  const { data: challengeCount, isLoading } = useQuery({
    queryKey: ['challenge-count', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Get all completions (Hero's Call + regular workouts + Valhalla)
      const [heroCallResult, workoutsResult, valhallaResult] = await Promise.all([
        supabase
          .from('hero_call_completions')
          .select('completed_at')
          .order('completed_at', { ascending: false }),
        supabase
          .from('workouts')
          .select('end_time')
          .not('end_time', 'is', null)
          .order('end_time', { ascending: false }),
        supabase
          .from('valhalla_challenges')
          .select('completed_at')
          .order('completed_at', { ascending: false })
      ]);

      if (heroCallResult.error) throw heroCallResult.error;
      if (workoutsResult.error) throw workoutsResult.error;
      if (valhallaResult.error) throw valhallaResult.error;

      // Count total challenges
      const heroCalls = heroCallResult.data?.length || 0;
      const workouts = workoutsResult.data?.length || 0;
      const valhalla = valhallaResult.data?.length || 0;

      return heroCalls + workouts + valhalla;
    },
    enabled: !!user,
  });

  return {
    challengeCount: challengeCount || 0,
    isLoading,
  };
};