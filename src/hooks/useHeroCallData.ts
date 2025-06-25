
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

  // Fetch Hero's Call statistics including all workout completions
  const { data: stats, isLoading } = useQuery<HeroCallStats>({
    queryKey: ['hero-call-stats', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Get all completions (Hero's Call + regular workouts) for streak calculation
      const [heroCallResult, workoutsResult] = await Promise.all([
        supabase
          .from('hero_call_completions')
          .select('completed_at')
          .order('completed_at', { ascending: false }),
        supabase
          .from('workouts')
          .select('end_time')
          .not('end_time', 'is', null)
          .order('end_time', { ascending: false })
      ]);

      if (heroCallResult.error) throw heroCallResult.error;
      if (workoutsResult.error) throw workoutsResult.error;

      // Combine and sort all completion dates
      const allCompletions = [
        ...(heroCallResult.data || []).map(item => new Date(item.completed_at)),
        ...(workoutsResult.data || []).map(item => new Date(item.end_time!))
      ].sort((a, b) => b.getTime() - a.getTime());

      // Calculate streak from combined completions
      let currentStreak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (allCompletions.length > 0) {
        const lastCompletionDate = new Date(allCompletions[0]);
        lastCompletionDate.setHours(0, 0, 0, 0);
        
        // Check if last completion was today or yesterday
        const daysSinceLastCompletion = Math.floor((today.getTime() - lastCompletionDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSinceLastCompletion <= 1) {
          // Count consecutive days backwards
          const completionDates = new Set(
            allCompletions.map(date => {
              const d = new Date(date);
              d.setHours(0, 0, 0, 0);
              return d.toDateString();
            })
          );
          
          let checkDate = new Date(lastCompletionDate);
          while (completionDates.has(checkDate.toDateString())) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          }
        }
      }

      // Calculate weekly count (Monday to Sunday)
      const startOfWeek = new Date(today);
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 7);

      const weeklyCompletions = allCompletions.filter(date => {
        const completionDate = new Date(date);
        return completionDate >= startOfWeek && completionDate < endOfWeek;
      });

      const uniqueDaysThisWeek = new Set(
        weeklyCompletions.map(date => {
          const d = new Date(date);
          d.setHours(0, 0, 0, 0);
          return d.toDateString();
        })
      ).size;

      // Check if completed today
      const todayString = today.toDateString();
      const completedToday = allCompletions.some(date => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.toDateString() === todayString;
      });

      return {
        currentStreak,
        weeklyCount: uniqueDaysThisWeek,
        completedToday,
        lastCompleted: allCompletions.length > 0 ? allCompletions[0].toISOString() : null
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
      // Invalidate forge progress since it depends on hero call data
      queryClient.invalidateQueries({ queryKey: ['forge-progress', user?.id] });
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
