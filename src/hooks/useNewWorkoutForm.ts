
import { useWorkoutState } from './useWorkoutState';
import { useSaveWorkout } from './useSaveWorkout';
import { useSaveAsTemplate } from './useSaveAsTemplate';
import { useGenerateWorkout } from './useGenerateWorkout';
import { useNavigate } from 'react-router-dom';
import { toast as sonnerToast } from 'sonner';
import { useState } from 'react';

export const useNewWorkoutForm = () => {
  const navigate = useNavigate();
  const [showValhallaScoreDialog, setShowValhallaScoreDialog] = useState(false);
  const [currentValhallaWorkout, setCurrentValhallaWorkout] = useState<string>('');
  
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
    restDuration,
    setRestDuration,
    clearPersistedWorkout,
  } = useWorkoutState();

  const { saveWorkoutMutation, finishWorkout } = useSaveWorkout();
  const { saveAsTemplateMutation, saveAsTemplate } = useSaveAsTemplate();
  const { generateWorkoutMutation } = useGenerateWorkout({ setWorkoutName, setExercises });

  const handleValhallaScorePrompt = (workoutName: string) => {
    setCurrentValhallaWorkout(workoutName);
    setShowValhallaScoreDialog(true);
  };

  const handleCloseValhallaDialog = () => {
    setShowValhallaScoreDialog(false);
    setCurrentValhallaWorkout('');
    navigate('/history');
  };

  const handleFinishWorkout = () => {
    finishWorkout({ 
      exercises, 
      name: workoutName,
      onValhallaScorePrompt: handleValhallaScorePrompt
    });
    clearPersistedWorkout();
  };

  const handleCancelWorkout = () => {
    clearPersistedWorkout();
    sonnerToast.success("Workout cancelled");
    navigate('/');
  };

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
    finishWorkout: handleFinishWorkout,
    cancelWorkout: handleCancelWorkout,
    saveWorkoutMutation,
    generateWorkoutMutation,
    selectedEquipment,
    setSelectedEquipment,
    focusArea,
    setFocusArea,
    saveAsTemplate: () => saveAsTemplate({ exercises, name: workoutName }),
    saveAsTemplateMutation,
    restDuration,
    setRestDuration,
    showValhallaScoreDialog,
    currentValhallaWorkout,
    onCloseValhallaDialog: handleCloseValhallaDialog,
  };
};
