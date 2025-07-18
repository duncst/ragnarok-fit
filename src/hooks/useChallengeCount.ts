import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useChallengeCount = () => {
  const { user } = useAuth();

  const { data: challengeCount, isLoading } = useQuery({
    queryKey: ['challenge-count', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Get all completions (Hero's Call + regular workouts + runs + Valhalla)
      const [heroCallResult, workoutsResult, runsResult, valhallaResult] = await Promise.all([
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
          .from('runs')
          .select('date')
          .order('date', { ascending: false }),
        supabase
          .from('valhalla_challenges')
          .select('completed_at')
          .order('completed_at', { ascending: false })
      ]);

      if (heroCallResult.error) throw heroCallResult.error;
      if (workoutsResult.error) throw workoutsResult.error;
      if (runsResult.error) throw runsResult.error;
      if (valhallaResult.error) throw valhallaResult.error;

      // Count total challenges
      const heroCalls = heroCallResult.data?.length || 0;
      const workouts = workoutsResult.data?.length || 0;
      const runs = runsResult.data?.length || 0;
      const valhalla = valhallaResult.data?.length || 0;

      return heroCalls + workouts + runs + valhalla;
    },
    enabled: !!user,
  });

  return {
    challengeCount: challengeCount || 0,
    isLoading,
  };
};

export const useActiveDaysCount = () => {
  const { user } = useAuth();

  const { data: activeDaysCount, isLoading } = useQuery({
    queryKey: ['active-days-count', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Get unique dates from all activity tables
      const [heroCallResult, workoutResult, runResult, valhallaResult] = await Promise.all([
        supabase
          .from('hero_call_completions')
          .select('completed_at'),
        supabase
          .from('workouts')
          .select('end_time')
          .not('end_time', 'is', null),
        supabase
          .from('runs')
          .select('date'),
        supabase
          .from('valhalla_challenges')
          .select('completed_at')
      ]);

      if (heroCallResult.error) throw heroCallResult.error;
      if (workoutResult.error) throw workoutResult.error;
      if (runResult.error) throw runResult.error;
      if (valhallaResult.error) throw valhallaResult.error;

      // Collect all unique dates
      const allDates = new Set<string>();

      // Add hero call dates
      heroCallResult.data?.forEach(item => {
        if (item.completed_at) {
          const date = new Date(item.completed_at).toDateString();
          allDates.add(date);
        }
      });

      // Add workout dates
      workoutResult.data?.forEach(item => {
        if (item.end_time) {
          const date = new Date(item.end_time).toDateString();
          allDates.add(date);
        }
      });

      // Add run dates
      runResult.data?.forEach(item => {
        if (item.date) {
          const date = new Date(item.date).toDateString();
          allDates.add(date);
        }
      });

      // Add valhalla dates
      valhallaResult.data?.forEach(item => {
        if (item.completed_at) {
          const date = new Date(item.completed_at).toDateString();
          allDates.add(date);
        }
      });

      return allDates.size;
    },
    enabled: !!user,
  });

  return {
    activeDaysCount: activeDaysCount || 0,
    isLoading,
  };
};