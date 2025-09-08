import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface WeeklyDistanceGoal {
  id: string;
  user_id: string;
  target_distance: number;
  week_start: string;
  created_at: string;
  updated_at: string;
}

export const useWeeklyDistanceGoal = () => {
  const { user } = useAuth();
  const [goal, setGoal] = useState<WeeklyDistanceGoal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get start of current week (Monday)
  const getWeekStart = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek.toISOString().split('T')[0];
  };

  const fetchGoal = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const weekStart = getWeekStart();
      const { data, error } = await supabase
        .from('weekly_distance_goals')
        .select('*')
        .eq('week_start', weekStart)
        .maybeSingle();

      if (error) throw error;
      setGoal(data);
    } catch (error) {
      console.error('Error fetching weekly distance goal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setWeeklyGoal = async (targetDistance: number) => {
    if (!user) return;

    try {
      const weekStart = getWeekStart();
      
      const { data, error } = await supabase
        .from('weekly_distance_goals')
        .upsert({
          target_distance: targetDistance,
          week_start: weekStart,
        })
        .select()
        .single();

      if (error) throw error;
      
      setGoal(data);
      toast.success(`Weekly goal set to ${targetDistance}km`);
    } catch (error) {
      console.error('Error setting weekly distance goal:', error);
      toast.error('Failed to set weekly goal');
    }
  };

  const deleteGoal = async () => {
    if (!user || !goal) return;

    try {
      const { error } = await supabase
        .from('weekly_distance_goals')
        .delete()
        .eq('id', goal.id);

      if (error) throw error;
      
      setGoal(null);
      toast.success('Weekly goal removed');
    } catch (error) {
      console.error('Error deleting weekly distance goal:', error);
      toast.error('Failed to remove weekly goal');
    }
  };

  useEffect(() => {
    fetchGoal();
  }, [user]);

  return {
    goal,
    isLoading,
    setWeeklyGoal,
    deleteGoal,
    refetchGoal: fetchGoal
  };
};