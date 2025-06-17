
import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Exercise } from '@/types';

interface WorkoutSession {
  id: string;
  name: string;
  exercises: Exercise[];
  startTime: Date;
  restDuration: number;
}

export const useWorkoutPersistence = () => {
  const saveWorkoutSession = useCallback(async (session: WorkoutSession) => {
    try {
      localStorage.setItem('workout_session', JSON.stringify({
        ...session,
        startTime: session.startTime.toISOString()
      }));
    } catch (error) {
      console.error('Failed to save workout session:', error);
    }
  }, []);

  const loadWorkoutSession = useCallback((): WorkoutSession | null => {
    try {
      const saved = localStorage.getItem('workout_session');
      if (!saved) return null;
      
      const session = JSON.parse(saved);
      return {
        ...session,
        startTime: new Date(session.startTime)
      };
    } catch (error) {
      console.error('Failed to load workout session:', error);
      return null;
    }
  }, []);

  const clearWorkoutSession = useCallback(() => {
    localStorage.removeItem('workout_session');
  }, []);

  return {
    saveWorkoutSession,
    loadWorkoutSession,
    clearWorkoutSession,
  };
};
