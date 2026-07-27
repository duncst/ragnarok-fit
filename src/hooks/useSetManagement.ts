
import { useCallback } from 'react';
import { useExerciseHistory } from './useExerciseHistory';
import type { Exercise, WorkoutSet } from '@/types';

export const useSetManagement = (
  exercises: Exercise[],
  setExercises: (exercises: Exercise[]) => void
) => {
  const { getExerciseDefaults } = useExerciseHistory();

  const addSet = useCallback((exerciseId: string) => {
    setExercises(exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        const defaults = getExerciseDefaults(exercise.name);
        
        const newSet: WorkoutSet = {
          id: Date.now().toString(),
          reps: defaults.reps,
          weight: defaults.weight,
          duration: defaults.duration,
          distance: defaults.distance,
          completed: false,
        };
        return {
          ...exercise,
          sets: [...exercise.sets, newSet]
        };
      }
      return exercise;
    }));
  }, [exercises, setExercises, getExerciseDefaults]);

  const updateSet = useCallback((exerciseId: string, setId: string, field: 'reps' | 'weight' | 'duration' | 'distance', value: number) => {
    setExercises(exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          sets: exercise.sets.map(set => 
            set.id === setId ? { ...set, [field]: value } : set
          )
        };
      }
      return exercise;
    }));
  }, [exercises, setExercises]);

  const handleToggleSet = useCallback((exerciseId: string, setId: string, onToggle?: (isCompleted: boolean) => void) => {
    setExercises(exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          sets: exercise.sets.map(set => {
            if (set.id === setId) {
              const newCompleted = !set.completed;
              if (onToggle) {
                onToggle(newCompleted);
              }
              return { ...set, completed: newCompleted };
            }
            return set;
          })
        };
      }
      return exercise;
    }));
  }, [exercises, setExercises]);

  const removeSet = useCallback((exerciseId: string, setId: string) => {
    setExercises(exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        // Don't allow removing the last set
        if (exercise.sets.length <= 1) {
          return exercise;
        }
        return {
          ...exercise,
          sets: exercise.sets.filter(set => set.id !== setId)
        };
      }
      return exercise;
    }));
  }, [exercises, setExercises]);

  return {
    addSet,
    updateSet,
    handleToggleSet,
    removeSet,
  };
};
