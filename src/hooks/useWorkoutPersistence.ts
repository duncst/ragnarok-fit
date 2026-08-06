
import { useEffect } from 'react';
import type { Exercise } from '@/types';
import { secureStorage } from '@/lib/secureStorage';

const WORKOUT_STORAGE_KEY = 'ragnarok-workout-in-progress';

export interface PersistedWorkout {
  workoutName: string;
  exercises: Exercise[];
  selectedEquipment: string[];
  focusArea: string;
  restDuration: number;
  timestamp: number;
  // Identifies which workout session this draft belongs to (e.g. a specific
  // ritual/template), so we only ever resume a draft into the matching
  // session instead of bleeding progress between unrelated workouts.
  sessionId?: string;
}

export const useWorkoutPersistence = () => {
  const saveWorkout = async (workout: Omit<PersistedWorkout, 'timestamp'>) => {
    const persistedWorkout: PersistedWorkout = {
      ...workout,
      timestamp: Date.now(),
    };
    await secureStorage.setItem(WORKOUT_STORAGE_KEY, persistedWorkout);
  };

  const loadWorkout = async (): Promise<PersistedWorkout | null> => {
    try {
      const workout = await secureStorage.getItem(WORKOUT_STORAGE_KEY) as PersistedWorkout;
      if (!workout) return null;
      
      // Check if workout is less than 24 hours old
      const isRecent = Date.now() - workout.timestamp < 24 * 60 * 60 * 1000;
      
      if (!isRecent) {
        clearWorkout();
        return null;
      }
      
      return workout;
    } catch (error) {
      console.error('Error loading persisted workout:', error);
      clearWorkout();
      return null;
    }
  };

  const clearWorkout = () => {
    secureStorage.removeItem(WORKOUT_STORAGE_KEY);
  };

  const hasPersistedWorkout = async (): Promise<boolean> => {
    const workout = await loadWorkout();
    return workout !== null;
  };

  return {
    saveWorkout,
    loadWorkout,
    clearWorkout,
    hasPersistedWorkout,
  };
};
