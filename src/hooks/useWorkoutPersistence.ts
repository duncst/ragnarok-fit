
import { useEffect } from 'react';
import type { Exercise } from '@/types';

const WORKOUT_STORAGE_KEY = 'ragnarok-workout-in-progress';

export interface PersistedWorkout {
  workoutName: string;
  exercises: Exercise[];
  selectedEquipment: string[];
  focusArea: string;
  restDuration: number;
  timestamp: number;
}

export const useWorkoutPersistence = () => {
  const saveWorkout = (workout: Omit<PersistedWorkout, 'timestamp'>) => {
    const persistedWorkout: PersistedWorkout = {
      ...workout,
      timestamp: Date.now(),
    };
    localStorage.setItem(WORKOUT_STORAGE_KEY, JSON.stringify(persistedWorkout));
  };

  const loadWorkout = (): PersistedWorkout | null => {
    try {
      const stored = localStorage.getItem(WORKOUT_STORAGE_KEY);
      if (!stored) return null;
      
      const workout = JSON.parse(stored) as PersistedWorkout;
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
    localStorage.removeItem(WORKOUT_STORAGE_KEY);
  };

  const hasPersistedWorkout = (): boolean => {
    return loadWorkout() !== null;
  };

  return {
    saveWorkout,
    loadWorkout,
    clearWorkout,
    hasPersistedWorkout,
  };
};
