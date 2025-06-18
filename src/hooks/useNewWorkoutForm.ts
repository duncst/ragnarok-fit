
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
  const [workoutDuration, setWorkoutDuration] = useState<number>(0);
  
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

  const isValhallaWorkout = (name: string) => {
    return name.match(/^(THOR|FENRIR|HEL|NJORD|ODIN)$/i);
  };

  const handleValhallaScorePrompt = (workoutName: string, duration: number) => {
    setCurrentValhallaWorkout(workoutName);
    setWorkoutDuration(duration);
    setShowValhallaScoreDialog(true);
  };

  const handleCloseValhallaDialog = () => {
    setShowValhallaScoreDialog(false);
    setCurrentValhallaWorkout('');
    setWorkoutDuration(0);
    navigate('/history');
  };

  const handleFinishWorkout = (totalDuration: number) => {
    finishWorkout({ 
      exercises, 
      name: workoutName,
      onValhallaScorePrompt: (name) => handleValhallaScorePrompt(name, totalDuration)
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
    handleToggleSet: isValhallaWorkout(workoutName) ? 
      (exerciseId: string, setId: string) => handleToggleSet(exerciseId, setId) : 
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
    workoutDuration,
    onCloseValhallaDialog: handleCloseValhallaDialog,
    isValhallaWorkout: isValhallaWorkout(workoutName),
  };
};
