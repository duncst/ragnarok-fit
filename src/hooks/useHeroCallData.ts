
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface HeroCallCompletion {
  id: string;
  workout_name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed_at: string;
}

interface HeroCallStats {
  currentStreak: number;
  weeklyCount: number;
  completedToday: boolean;
  lastCompleted: string | null;
}

export const useHeroCallData = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch Hero's Call statistics
  const { data: stats, isLoading } = useQuery<HeroCallStats>({
    queryKey: ['hero-call-stats', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const [streakResult, weeklyResult, todayResult] = await Promise.all([
        supabase.rpc('get_hero_call_streak', { p_user_id: user.id }),
        supabase.rpc('get_hero_call_weekly_count', { p_user_id: user.id }),
        supabase.rpc('hero_call_completed_today', { p_user_id: user.id })
      ]);

      if (streakResult.error) throw streakResult.error;
      if (weeklyResult.error) throw weeklyResult.error;
      if (todayResult.error) throw todayResult.error;

      // Get last completion date
      const { data: lastCompletion } = await supabase
        .from('hero_call_completions')
        .select('completed_at')
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      return {
        currentStreak: streakResult.data || 0,
        weeklyCount: weeklyResult.data || 0,
        completedToday: todayResult.data || false,
        lastCompleted: lastCompletion?.completed_at || null
      };
    },
    enabled: !!user,
  });

  // Mutation to complete a Hero's Call workout
  const completeHeroCall = useMutation({
    mutationFn: async ({ workoutName, difficulty }: { workoutName: string; difficulty: 'easy' | 'medium' | 'hard' }) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('hero_call_completions')
        .insert({
          user_id: user.id,
          workout_name: workoutName,
          difficulty: difficulty,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate and refetch Hero's Call stats
      queryClient.invalidateQueries({ queryKey: ['hero-call-stats', user?.id] });
      // Also invalidate home page data to update analytics
      queryClient.invalidateQueries({ queryKey: ['workouts', user?.id] });
    },
  });

  // Migrate localStorage data to database (one-time operation)
  const migrateLocalStorageData = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const localData = localStorage.getItem('heroCallStreak');
      if (!localData) return;

      try {
        const data = JSON.parse(localData);
        if (data.lastCompleted && data.currentStreak > 0) {
          // Check if we already have data in the database
          const { data: existingData } = await supabase
            .from('hero_call_completions')
            .select('id')
            .limit(1)
            .maybeSingle();

          if (!existingData) {
            // Insert a completion record based on localStorage data
            const { error } = await supabase
              .from('hero_call_completions')
              .insert({
                user_id: user.id,
                workout_name: 'Migrated from localStorage',
                difficulty: 'medium',
                completed_at: data.lastCompleted
              });

            if (error) throw error;

            // Remove localStorage data after successful migration
            localStorage.removeItem('heroCallStreak');
          }
        }
      } catch (error) {
        console.error('Error migrating localStorage data:', error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-call-stats', user?.id] });
    },
  });

  return {
    stats: stats || {
      currentStreak: 0,
      weeklyCount: 0,
      completedToday: false,
      lastCompleted: null
    },
    isLoading,
    completeHeroCall,
    migrateLocalStorageData,
  };
};
