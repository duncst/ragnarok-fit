
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Workout, Run, PersonalRecord } from '@/types';
import { Tables } from '@/integrations/supabase/types';
import { useAnalyticsData } from './useAnalyticsData';

export const useHomePageData = () => {
  const { user } = useAuth();

  const { data: workoutHistory, isLoading: isLoadingWorkouts } = useQuery<Workout[]>({
    queryKey: ['workouts', user?.id],
    queryFn: async () => {
        if (!user) return [];
        const { data, error } = await supabase.rpc('get_user_workouts');
        if (error) throw new Error('Failed to fetch workout history.');
        if (!data) return [];
        return (data as any[]).map(workout => ({
            ...workout,
            startTime: new Date(workout.startTime),
            endTime: workout.endTime ? new Date(workout.endTime) : undefined,
        }));
    },
    enabled: !!user,
  });

  const { data: runHistory, isLoading: isLoadingRuns } = useQuery<Run[]>({
      queryKey: ['runs', user?.id],
      queryFn: async () => {
          if (!user) return [];
          const { data, error } = await supabase.from('runs').select('*').order('date', { ascending: false });
          if (error) throw new Error('Failed to fetch run history.');
          if (!data) return [];
          return (data as Tables<'runs'>[]).map(run => ({
              id: run.id,
              distance: run.distance,
              duration: run.duration,
              runType: run.run_type,
              date: new Date(run.date),
              notes: run.notes,
              elevation: run.elevation,
              avgHr: run.avg_hr,
          }));
      },
      enabled: !!user,
  });

  const { data: personalRecords, isLoading: isLoadingPRs } = useQuery<PersonalRecord[]>({
    queryKey: ['personal_records', user?.id],
    queryFn: async () => {
        if (!user) return [];
        const { data, error } = await supabase
            .from('personal_records')
            .select('*')
            .order('date', { ascending: false });
        if (error) throw new Error('Failed to fetch personal records.');
        return data || [];
    },
    enabled: !!user,
  });

  const isLoading = isLoadingWorkouts || isLoadingRuns || isLoadingPRs;

  const analytics = useAnalyticsData(workoutHistory, runHistory);
  const totalPRs = personalRecords?.length || 0;

  return {
    workoutHistory,
    runHistory,
    personalRecords,
    isLoading,
    totalPRs,
    ...analytics
  };
};
