
import type { Exercise } from '@/types';
import { getExerciseType } from '@/utils/exerciseTypes';
import { useExerciseHistory } from './useExerciseHistory';

export const useExerciseManagement = (
  exercises: Exercise[],
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>
) => {
  const { getExerciseDefaults } = useExerciseHistory();

  const addExercise = (exerciseName?: string) => {
    const newExercise: Exercise = {
      id: `ex-${Date.now()}`,
      name: exerciseName || '',
      sets: [{ id: `set-${Date.now()}`, reps: 8, weight: 20, completed: false }],
    };
    setExercises((prev) => [...prev, newExercise]);
  };

  const removeExercise = (exerciseId: string) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== exerciseId));
  };

  const moveExercise = (exerciseId: string, direction: 'up' | 'down') => {
    setExercises((prev) => {
      const currentIndex = prev.findIndex(ex => ex.id === exerciseId);
      if (currentIndex === -1) return prev;

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;

      const newExercises = [...prev];
      [newExercises[currentIndex], newExercises[newIndex]] = [newExercises[newIndex], newExercises[currentIndex]];
      return newExercises;
    });
  };

  const updateExerciseName = (exerciseId: string, name: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id === exerciseId) {
          const exerciseType = getExerciseType(name);
          const defaults = getExerciseDefaults(name);
          
          // Update existing sets with historical data
          const updatedSets = ex.sets.map(set => ({
            ...set,
            weight: ['weight', 'weight_distance_time'].includes(exerciseType) ? defaults.weight : set.weight,
            reps: exerciseType === 'distance' ? 1 : defaults.reps,
          }));
          
          return { ...ex, name, type: exerciseType, sets: updatedSets };
        }
        return ex;
      })
    );
  };

  return {
    addExercise,
    removeExercise,
    moveExercise,
    updateExerciseName,
  };
};
