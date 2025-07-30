
import { useEffect } from 'react';
import { useWorkoutInitialization } from './useWorkoutInitialization';
import { useWorkoutPersistence } from './useWorkoutPersistence';
import { useExerciseManagement } from './useExerciseManagement';
import { useSetManagement } from './useSetManagement';

export const useWorkoutState = () => {
  const { saveWorkout, clearWorkout } = useWorkoutPersistence();

  const {
    exercises,
    setExercises,
    workoutName,
    setWorkoutName,
    selectedEquipment,
    setSelectedEquipment,
    focusArea,
    setFocusArea,
    restDuration,
    setRestDuration,
    isInitialized,
  } = useWorkoutInitialization();

  const {
    addExercise,
    removeExercise,
    moveExercise,
    updateExerciseName,
  } = useExerciseManagement(exercises, setExercises);

  const {
    addSet,
    updateSet,
    handleToggleSet,
    removeSet,
  } = useSetManagement(exercises, setExercises);

  // Auto-save workout state when it changes
  useEffect(() => {
    if (!isInitialized) return;
    
    // Only persist if there's meaningful workout data
    if (exercises.length > 0 || workoutName.trim() !== '') {
      saveWorkout({
        workoutName,
        exercises,
        selectedEquipment,
        focusArea,
        restDuration,
      });
    }
  }, [exercises, workoutName, selectedEquipment, focusArea, restDuration, isInitialized, saveWorkout]);

  const clearPersistedWorkout = () => {
    clearWorkout();
  };
  
  return {
    workoutName,
    setWorkoutName,
    exercises,
    setExercises,
    addExercise,
    removeExercise,
    moveExercise,
    updateExerciseName,
    addSet,
    removeSet,
    updateSet,
    handleToggleSet,
    selectedEquipment,
    setSelectedEquipment,
    focusArea,
    setFocusArea,
    restDuration,
    setRestDuration,
    clearPersistedWorkout,
  };
};
