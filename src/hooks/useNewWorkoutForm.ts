
import { useWorkoutState } from './useWorkoutState';
import { useSaveWorkout } from './useSaveWorkout';
import { useSaveAsTemplate } from './useSaveAsTemplate';
import { useGenerateWorkout } from './useGenerateWorkout';

export const useNewWorkoutForm = () => {
  const {
    workoutName,
    setWorkoutName,
    exercises,
    setExercises,
    addExercise,
    removeExercise,
    updateExerciseName,
    addSet,
    updateSet,
    handleToggleSet,
    selectedEquipment,
    setSelectedEquipment,
    focusArea,
    setFocusArea,
  } = useWorkoutState();

  const { saveWorkoutMutation, finishWorkout } = useSaveWorkout();
  const { saveAsTemplateMutation, saveAsTemplate } = useSaveAsTemplate();
  const { generateWorkoutMutation } = useGenerateWorkout({ setWorkoutName, setExercises });

  return {
    workoutName,
    setWorkoutName,
    exercises,
    addExercise,
    removeExercise,
    updateExerciseName,
    addSet,
    updateSet,
    handleToggleSet,
    finishWorkout: () => finishWorkout({ exercises, name: workoutName }),
    saveWorkoutMutation,
    generateWorkoutMutation,
    selectedEquipment,
    setSelectedEquipment,
    focusArea,
    setFocusArea,
    saveAsTemplate: () => saveAsTemplate({ exercises, name: workoutName }),
    saveAsTemplateMutation,
  };
};
