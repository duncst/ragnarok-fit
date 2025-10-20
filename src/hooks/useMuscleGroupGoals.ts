import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface MuscleGroupGoal {
  id: string;
  user_id: string;
  muscle_group: string;
  weekly_target_sets: number;
  created_at: string;
  updated_at: string;
}

export const useMuscleGroupGoals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<MuscleGroupGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGoals = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('muscle_group_volume_goals')
        .select('*')
        .order('muscle_group');

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching muscle group goals:', error);
      toast.error('Failed to load muscle group goals');
    } finally {
      setIsLoading(false);
    }
  };

  const setGoal = async (muscleGroup: string, targetSets: number) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('muscle_group_volume_goals')
        .upsert({
          user_id: user.id,
          muscle_group: muscleGroup,
          weekly_target_sets: targetSets,
        }, {
          onConflict: 'user_id,muscle_group'
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchGoals();
      toast.success(`${muscleGroup} goal set to ${targetSets} sets/week`);
    } catch (error) {
      console.error('Error setting muscle group goal:', error);
      toast.error('Failed to set goal');
    }
  };

  const deleteGoal = async (muscleGroup: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('muscle_group_volume_goals')
        .delete()
        .eq('muscle_group', muscleGroup);

      if (error) throw error;
      
      await fetchGoals();
      toast.success(`${muscleGroup} goal removed`);
    } catch (error) {
      console.error('Error deleting muscle group goal:', error);
      toast.error('Failed to remove goal');
    }
  };

  const getGoal = (muscleGroup: string): MuscleGroupGoal | undefined => {
    return goals.find(g => g.muscle_group === muscleGroup);
  };

  useEffect(() => {
    fetchGoals();
  }, [user]);

  return {
    goals,
    isLoading,
    setGoal,
    deleteGoal,
    getGoal,
    refetchGoals: fetchGoals
  };
};
