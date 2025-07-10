import React, { useCallback, useState } from 'react';
import { useNewWorkoutForm } from '@/hooks/useNewWorkoutForm';
import { useWorkoutTimer } from '@/hooks/useWorkoutTimer';
import { useTrialWorkout } from '@/hooks/useTrialWorkout';
import { useRestTimer } from '@/hooks/useRestTimer';
import { WorkoutCookMode } from '@/components/workout/WorkoutCookMode';
import { ValhallaScoreDialog } from '@/components/workout/ValhallaScoreDialog';
import { RestTimerToast } from '@/components/workout/RestTimerToast';
import { TrialWorkoutMode } from '@/components/workout/TrialWorkoutMode';
import { WorkoutModeManager } from '@/components/workout/WorkoutModeManager';
import { AdvancedWorkoutMode } from '@/components/workout/AdvancedWorkoutMode';
import type { Workout } from '@/types';

const NewWorkoutPage = () => {
  const [isCookMode, setIsCookMode] = useState(false);
  const [isInWorkoutFlow, setIsInWorkoutFlow] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [workoutMode, setWorkoutMode] = useState<'simple' | 'advanced'>('simple');
  
  const {
    isActive: isWorkoutActive,
    formattedDuration,
    totalDuration,
    toggleWorkout,
    startWorkout,
  } = useWorkoutTimer();
  
  const {
    workoutName,
    setWorkoutName,
    exercises,
    setExercises,
    addExercise,
    removeExercise,
    moveExercise,
    updateExerciseName,
    addSet,
    updateSet,
    handleToggleSet: originalHandleToggleSet,
    finishWorkout,
    cancelWorkout,
    saveWorkoutMutation,
    generateWorkoutMutation,
    selectedEquipment,
    setSelectedEquipment,
    saveAsTemplate,
    saveAsTemplateMutation,
    focusArea,
    setFocusArea,
    restDuration,
    setRestDuration,
    showValhallaScoreDialog,
    currentValhallaWorkout,
    workoutDuration,
    onCloseValhallaDialog,
    isValhallaWorkout,
  } = useNewWorkoutForm();

  const { trialWorkout, clearTrialWorkout } = useTrialWorkout(setWorkoutName);
  const { 
    showRestTimer, 
    restTimerDuration, 
    handleSetCompletion, 
    handleDismissRestTimer 
  } = useRestTimer(restDuration, isValhallaWorkout);

  // Check if there's meaningful workout data
  const hasWorkoutData = workoutName.trim() !== '' || exercises.some(ex => ex.name.trim() !== '' || ex.sets.length > 0);

  // Set workout flow when trial workout is loaded
  React.useEffect(() => {
    if (trialWorkout) {
      setIsInWorkoutFlow(true);
    }
  }, [trialWorkout]);

  const handleToggleSet = useCallback((exerciseId: string, setId: string) => {
    originalHandleToggleSet(exerciseId, setId, handleSetCompletion);
  }, [originalHandleToggleSet, handleSetCompletion]);

  const handleEnterCookMode = () => {
    setIsCookMode(true);
  };

  const handleExitCookMode = () => {
    setIsCookMode(false);
    setIsInWorkoutFlow(false);
  };

  const handleFinishWorkout = () => {
    finishWorkout(totalDuration);
    setIsInWorkoutFlow(false);
    clearTrialWorkout();
  };

  const handleGenerateWorkout = () => {
    generateWorkoutMutation.mutate({ equipment: selectedEquipment, focus: focusArea });
  };

  const handleStartWorkout = () => {
    setIsInWorkoutFlow(true);
    startWorkout();
    if (isCookMode) {
      handleEnterCookMode();
    }
  };

  const handleCancelWorkout = () => {
    setIsInWorkoutFlow(false);
    clearTrialWorkout();
    cancelWorkout();
  };

  const handleExitTrial = () => {
    clearTrialWorkout();
    setIsInWorkoutFlow(false);
    cancelWorkout();
  };

  const handleAddExerciseByName = (exerciseName: string) => {
    const newExerciseId = Date.now().toString();
    const newExercise = {
      id: newExerciseId,
      name: exerciseName,
      sets: [{
        id: Date.now().toString() + '_set1',
        reps: 0,
        weight: 0,
        completed: false,
        duration: 0,
        distance: 0,
      }],
    };
    
    const updatedExercises = [...exercises, newExercise];
    setExercises(updatedExercises);
  };

  const handleRedoWorkout = (workout: Workout) => {
    // Clear current workout
    setExercises([]);
    setWorkoutName(workout.name || '');
    
    // Load workout exercises
    const loadedExercises = workout.exercises.map((exercise, index) => ({
      id: `${Date.now()}_${index}`,
      name: exercise.name,
      sets: exercise.sets.map((set, setIndex) => ({
        id: `${Date.now()}_${index}_set${setIndex}`,
        reps: set.reps,
        weight: set.weight,
        completed: false, // Reset completion status
        duration: set.duration || 0,
        distance: set.distance || 0,
      }))
    }));
    
    setExercises(loadedExercises);
  };

  return (
    <>
      {/* Trial of Embers workout mode */}
      {trialWorkout && isInWorkoutFlow && (
        <TrialWorkoutMode
          trialWorkout={trialWorkout}
          selectedLevel={selectedLevel}
          onFinish={handleFinishWorkout}
          onExit={handleExitTrial}
          isWorkoutActive={isWorkoutActive}
          formattedDuration={formattedDuration}
          onToggleWorkout={toggleWorkout}
        />
      )}

      {/* Simple workout modes */}
      {!trialWorkout && (
        <WorkoutModeManager
          isInWorkoutFlow={isInWorkoutFlow}
          workoutMode={workoutMode}
          workoutName={workoutName}
          exercises={exercises}
          restDuration={restDuration}
          formattedDuration={formattedDuration}
          selectedEquipment={selectedEquipment}
          focusArea={focusArea}
          isGenerating={generateWorkoutMutation.isPending}
          onWorkoutNameChange={setWorkoutName}
          onAddExercise={handleAddExerciseByName}
          onRemoveExercise={removeExercise}
          onMoveExercise={moveExercise}
          onAddSet={addSet}
          onUpdateSet={updateSet}
          onToggleSet={handleToggleSet}
          onStartWorkout={handleStartWorkout}
          onFinishWorkout={handleFinishWorkout}
          onCancelWorkout={handleCancelWorkout}
          onEquipmentChange={setSelectedEquipment}
          onFocusChange={setFocusArea}
          onGenerateWorkout={handleGenerateWorkout}
          onRestDurationChange={setRestDuration}
          onRedoWorkout={handleRedoWorkout}
        />
      )}

      {/* Cook mode */}
      {isCookMode && isInWorkoutFlow && !trialWorkout && (
        <WorkoutCookMode
          workoutName={workoutName}
          exercises={exercises}
          onExitCookMode={handleExitCookMode}
          onAddExercise={addExercise}
          onRemoveExercise={removeExercise}
          onMoveExercise={moveExercise}
          onUpdateExerciseName={updateExerciseName}
          onAddSet={addSet}
          onUpdateSet={updateSet}
          onToggleSet={handleToggleSet}
          onFinishWorkout={handleFinishWorkout}
          isSaving={saveWorkoutMutation.isPending}
          isWorkoutActive={isWorkoutActive}
          formattedDuration={formattedDuration}
          onToggleWorkout={toggleWorkout}
        />
      )}

      {/* Advanced workout mode */}
      {!trialWorkout && workoutMode === 'advanced' && !isCookMode && (
        <AdvancedWorkoutMode
          isInWorkoutFlow={isInWorkoutFlow}
          workoutName={workoutName}
          exercises={exercises}
          restDuration={restDuration}
          isCookMode={isCookMode}
          isWorkoutActive={isWorkoutActive}
          formattedDuration={formattedDuration}
          isValhallaWorkout={isValhallaWorkout}
          hasWorkoutData={hasWorkoutData}
          isSaving={saveWorkoutMutation.isPending}
          isSavingAsTemplate={saveAsTemplateMutation.isPending}
          onNameChange={setWorkoutName}
          onFinish={handleFinishWorkout}
          onCancel={handleCancelWorkout}
          onSaveAsTemplate={saveAsTemplate}
          onToggleWorkout={toggleWorkout}
          onToggleCookMode={setIsCookMode}
          onRestDurationChange={setRestDuration}
          onAddExercise={addExercise}
          onRemoveExercise={removeExercise}
          onUpdateExerciseName={updateExerciseName}
          onAddSet={addSet}
          onUpdateSet={updateSet}
          onToggleSet={handleToggleSet}
          onMoveExercise={moveExercise}
          onStartWorkout={handleStartWorkout}
        />
      )}

      <ValhallaScoreDialog
        isOpen={showValhallaScoreDialog}
        onClose={onCloseValhallaDialog}
        workoutName={currentValhallaWorkout}
        workoutDuration={workoutDuration}
      />

      {/* Rest Timer Bar */}
      {showRestTimer && (
        <RestTimerToast
          duration={restTimerDuration}
          onDismiss={handleDismissRestTimer}
        />
      )}
    </>
  );
};

export default NewWorkoutPage;
