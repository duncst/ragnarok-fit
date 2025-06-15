
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from 'sonner';

export const useDeleteActivity = () => {
  const queryClient = useQueryClient();

  const deleteWorkoutMutation = useMutation({
    mutationFn: async (workoutId: string) => {
      const { error } = await supabase.from('workouts').delete().eq('id', workoutId);
      if (error) throw error;
    },
    onSuccess: () => {
      sonnerToast.success('Workout deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      queryClient.invalidateQueries({ queryKey: ['runs'] });
    },
    onError: (error) => {
      sonnerToast.error('Failed to delete workout.', { description: (error as Error).message });
    },
  });

  const deleteRunMutation = useMutation({
    mutationFn: async (runId: string) => {
      const { error } = await supabase.from('runs').delete().eq('id', runId);
      if (error) throw error;
    },
    onSuccess: () => {
      sonnerToast.success('Run deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      queryClient.invalidateQueries({ queryKey: ['runs'] });
    },
    onError: (error) => {
      sonnerToast.error('Failed to delete run.', { description: (error as Error).message });
    },
  });

  return {
    deleteWorkout: deleteWorkoutMutation.mutate,
    isDeletingWorkout: deleteWorkoutMutation.isPending,
    deleteRun: deleteRunMutation.mutate,
    isDeletingRun: deleteRunMutation.isPending,
  };
};
