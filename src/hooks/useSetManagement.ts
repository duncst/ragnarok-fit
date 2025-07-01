
import { useCallback } from 'react';
import type { Exercise, WorkoutSet } from '@/types';
import { getExerciseType } from '@/utils/exerciseTypes';
import { useExerciseHistory } from './useExerciseHistory';
import { useOneRepMax } from './useOneRepMax';

export const useSetManagement = (
  exercises: Exercise[],
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>
) => {
  const { getExerciseDefaults } = useExerciseHistory();
  const { checkAndSave1RM } = useOneRepMax();

  const addSet = (exerciseId: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id === exerciseId) {
          const lastSet = ex.sets[ex.sets.length - 1];
          const exerciseType = ex.type || getExerciseType(ex.name);
          const defaults = getExerciseDefaults(ex.name);
          
          const newSet: WorkoutSet = {
            id: `set-${Date.now()}`,
            reps: exerciseType === 'distance' ? 1 : (lastSet?.reps || defaults.reps),
            weight: ['weight', 'weight_distance_time'].includes(exerciseType) ? (lastSet?.weight || defaults.weight) : 0,
            completed: false,
            duration: ['time', 'distance', 'weight_distance_time'].includes(exerciseType) ? (lastSet?.duration || 60) : undefined,
            distance: ['distance', 'weight_distance_time'].includes(exerciseType) ? (lastSet?.distance || 1000) : undefined,
          };
          return { ...ex, sets: [...ex.sets, newSet] };
        }
        return ex;
      })
    );
  };

  const updateSet = (
    exerciseId: string,
    setId: string,
    field: 'reps' | 'weight' | 'duration' | 'distance',
    value: number
  ) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: ex.sets.map((set) => {
              if (set.id === setId) {
                return { ...set, [field]: value };
              }
              return set;
            }),
          };
        }
        return ex;
      })
    );
  };

  const handleToggleSet = useCallback((
    exerciseId: string,
    setId: string,
    onToggleCallback?: (isCompleted: boolean) => void
  ) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: ex.sets.map((set) => {
              if (set.id === setId) {
                const isCompleted = !set.completed;
                onToggleCallback?.(isCompleted);
                const updatedSet = { ...set, completed: isCompleted };
                if (updatedSet.completed) {
                  checkAndSave1RM(ex, updatedSet);
                }
                return updatedSet;
              }
              return set;
            }),
          };
        }
        return ex;
      })
    );
  }, [checkAndSave1RM]);

  return {
    addSet,
    updateSet,
    handleToggleSet,
  };
};
