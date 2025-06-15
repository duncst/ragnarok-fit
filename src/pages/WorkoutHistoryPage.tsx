
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { Workout, Run } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Tables } from '@/integrations/supabase/types';
import WorkoutCard from '@/components/history/WorkoutCard';
import RunCard from '@/components/history/RunCard';

const WorkoutHistoryPage = () => {
  const { user } = useAuth();

  const { data: workoutHistory, isLoading: isLoadingWorkouts } = useQuery<Workout[]>({
    queryKey: ['workouts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase.rpc('get_user_workouts');

      if (error) {
        console.error('Error fetching workouts:', error);
        throw new Error('Failed to fetch workout history.');
      }

      if (!data) return [];
      
      // The RPC returns a JSONB object, which Tanstack Query will parse.
      // We need to convert date strings to Date objects.
      const parsedWorkouts = (data as any[]).map(workout => ({
        ...workout,
        startTime: new Date(workout.startTime),
        endTime: workout.endTime ? new Date(workout.endTime) : undefined,
      }));

      return parsedWorkouts;
    },
    enabled: !!user,
  });

  const { data: runHistory, isLoading: isLoadingRuns } = useQuery<Run[]>({
    queryKey: ['runs', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('runs')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching runs:', error);
        throw new Error('Failed to fetch run history.');
      }

      if (!data) return [];
      
      const parsedRuns = (data as Tables<'runs'>[]).map(run => ({
        id: run.id,
        distance: run.distance,
        duration: run.duration,
        runType: run.run_type,
        date: new Date(run.date),
        notes: run.notes,
        elevation: run.elevation,
        avgHr: run.avg_hr,
      }));

      return parsedRuns;
    },
    enabled: !!user,
  });

  const isLoading = isLoadingWorkouts || isLoadingRuns;

  const combinedHistory = [
    ...(workoutHistory || []).map(w => ({ ...w, type: 'workout' as const, date: w.startTime })),
    ...(runHistory || []).map(r => ({ ...r, type: 'run' as const }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">History</h1>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">History</h1>
        <p className="text-secondary text-sm">{combinedHistory.length} total activities</p>
      </div>
      
      {combinedHistory.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <p>No activities recorded yet.</p>
            <p>Go to "New Workout" to log your first session!</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {combinedHistory.map(item => {
          if (item.type === 'workout') {
            return <WorkoutCard key={item.id} workout={item} />
          }
          if (item.type === 'run') {
            return <RunCard key={item.id} run={item} />
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default WorkoutHistoryPage;
