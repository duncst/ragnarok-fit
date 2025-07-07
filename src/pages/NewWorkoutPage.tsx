import React, { useCallback, useState, useEffect } from 'react';
import { useNewWorkoutForm } from '@/hooks/useNewWorkoutForm';
import { useWorkoutTimer } from '@/hooks/useWorkoutTimer';
import { WorkoutHeader } from '@/components/workout/WorkoutHeader';
import { ExerciseCard } from '@/components/workout/ExerciseCard';
import { WorkoutStartOptions } from '@/components/workout/WorkoutStartOptions';
import { WorkoutCookMode } from '@/components/workout/WorkoutCookMode';
import { ValhallaScoreDialog } from '@/components/workout/ValhallaScoreDialog';
import { RestTimerSettings } from '@/components/workout/RestTimerSettings';
import { RestTimerToast } from '@/components/workout/RestTimerToast';
import { HeroCallWorkoutMode } from '@/components/hero-call/HeroCallWorkoutMode';
import { SimpleWorkoutExecution } from '@/components/workout/SimpleWorkoutExecution';
import { WorkoutModeSelector } from '@/components/workout/WorkoutModeSelector';
import { toast as sonnerToast } from 'sonner';

const NewWorkoutPage = () => {
  const [isCookMode, setIsCookMode] = useState(false);
  const [isInWorkoutFlow, setIsInWorkoutFlow] = useState(false);
  const [trialWorkout, setTrialWorkout] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [workoutMode, setWorkoutMode] = useState<'simple' | 'advanced'>('simple');
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restTimerDuration, setRestTimerDuration] = useState(0);
  
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

  // Check for Trial of Embers workout on component mount
  useEffect(() => {
    const storedTrialWorkout = localStorage.getItem('hero-call-trial-workout');
    if (storedTrialWorkout) {
      const parsedWorkout = JSON.parse(storedTrialWorkout);
      setTrialWorkout(parsedWorkout);
      setWorkoutName(parsedWorkout.name);
      setIsInWorkoutFlow(true);
      // Clean up the stored workout
      localStorage.removeItem('hero-call-trial-workout');
    }
  }, [setWorkoutName]);

  // Check if there's meaningful workout data
  const hasWorkoutData = workoutName.trim() !== '' || exercises.some(ex => ex.name.trim() !== '' || ex.sets.length > 0);

  const handleToggleSet = useCallback((exerciseId: string, setId: string) => {
    originalHandleToggleSet(exerciseId, setId, (isCompleted) => {
      if (isCompleted && !isValhallaWorkout) {
        setRestTimerDuration(restDuration);
        setShowRestTimer(true);
      }
    });
  }, [originalHandleToggleSet, restDuration, isValhallaWorkout]);

  const handleDismissRestTimer = () => {
    setShowRestTimer(false);
    setRestTimerDuration(0);
  };

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
    setTrialWorkout(null);
  };

  const handleGenerateWorkout = () => {
    generateWorkoutMutation.mutate({ equipment: selectedEquipment, focus: focusArea });
  };

  const handleStartWorkout = () => {
    setIsInWorkoutFlow(true);
    startWorkout(); // Start the timer when workout begins
    if (isCookMode) {
      handleEnterCookMode();
    }
  };

  const handleCancelWorkout = () => {
    setIsInWorkoutFlow(false);
    setTrialWorkout(null);
    cancelWorkout();
  };

  const handleExitTrial = () => {
    setTrialWorkout(null);
    setIsInWorkoutFlow(false);
    cancelWorkout();
  };

  const handleAddExerciseByName = (exerciseName: string) => {
    // Create a new exercise with the selected name
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
    
    // Add the exercise directly with the name
    const updatedExercises = [...exercises, newExercise];
    setExercises(updatedExercises);
  };

  return (
    <>
      {/* If we have a Trial of Embers workout, show the Hero Call workout mode */}
      {trialWorkout && isInWorkoutFlow && (
        <HeroCallWorkoutMode
          workout={trialWorkout}
          selectedLevel={selectedLevel}
          onFinish={handleFinishWorkout}
          onExit={handleExitTrial}
          isWorkoutActive={isWorkoutActive}
          formattedDuration={formattedDuration}
          onToggleWorkout={toggleWorkout}
        />
      )}

      {/* Simple workout creation mode (when not in workout flow) */}
      {!isInWorkoutFlow && workoutMode === 'simple' && (
        <WorkoutModeSelector
          workoutName={workoutName}
          onWorkoutNameChange={setWorkoutName}
          exercises={exercises}
          onAddExercise={handleAddExerciseByName}
          onRemoveExercise={removeExercise}
          onMoveExercise={moveExercise}
          onAddSet={addSet}
          onStartWorkout={handleStartWorkout}
          onCancel={handleCancelWorkout}
          restDuration={restDuration}
          selectedEquipment={selectedEquipment}
          onEquipmentChange={setSelectedEquipment}
          focusArea={focusArea}
          onFocusChange={setFocusArea}
          onGenerateWorkout={handleGenerateWorkout}
          isGenerating={generateWorkoutMutation.isPending}
        />
      )}

      {/* Simple workout execution mode (when in workout flow) */}
      {isInWorkoutFlow && workoutMode === 'simple' && !isCookMode && (
        <SimpleWorkoutExecution
          workoutName={workoutName}
          exercises={exercises}
          onAddExercise={handleAddExerciseByName}
          onRemoveExercise={removeExercise}
          onMoveExercise={moveExercise}
          onAddSet={addSet}
          onUpdateSet={updateSet}
          onToggleSet={handleToggleSet}
          onFinishWorkout={handleFinishWorkout}
          onCancelWorkout={handleCancelWorkout}
          workoutTimer={formattedDuration}
          restDuration={restDuration}
          onRestDurationChange={setRestDuration}
        />
      )}

      {isCookMode && isInWorkoutFlow && (
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

      {isInWorkoutFlow && !isCookMode && workoutMode === 'advanced' && (
        <div className="space-y-4 pb-16">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">Workout in Progress</h1>
            {isWorkoutActive && (
              <div className="text-lg font-semibold text-green-600">
                {formattedDuration}
              </div>
            )}
          </div>

          <WorkoutHeader
            workoutName={workoutName}
            onNameChange={setWorkoutName}
            onFinish={handleFinishWorkout}
            onCancel={handleCancelWorkout}
            isSaving={saveWorkoutMutation.isPending}
            onSaveAsTemplate={saveAsTemplate}
            isSavingAsTemplate={saveAsTemplateMutation.isPending}
            isWorkoutActive={isWorkoutActive}
            onToggleWorkout={toggleWorkout}
            isCookMode={isCookMode}
            onToggleCookMode={setIsCookMode}
            hasWorkoutData={hasWorkoutData}
          />

          {!isValhallaWorkout && (
            <div className="p-4 border rounded-lg">
              <RestTimerSettings
                restDuration={restDuration}
                onRestDurationChange={setRestDuration}
              />
            </div>
          )}

          {exercises.map((exercise, exerciseIndex) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              exerciseIndex={exerciseIndex}
              totalExercises={exercises.length}
              onRemove={removeExercise}
              onMove={moveExercise}
              onUpdateName={updateExerciseName}
              onAddSet={addSet}
              onUpdateSet={updateSet}
              onToggleSet={handleToggleSet}
            />
          ))}
        </div>
      )}

      {!isInWorkoutFlow && workoutMode === 'advanced' && (
        <div className="space-y-4 pb-16">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">Choose your Destiny</h1>
            {isWorkoutActive && (
              <div className="text-lg font-semibold text-green-600">
                {formattedDuration}
              </div>
            )}
          </div>

          <WorkoutStartOptions
            workoutName={workoutName}
            onNameChange={setWorkoutName}
            onAddExercise={addExercise}
            exercises={exercises}
            onRemoveExercise={removeExercise}
            onUpdateExerciseName={updateExerciseName}
            onAddSet={addSet}
            onUpdateSet={updateSet}
            onToggleSet={handleToggleSet}
            restDuration={restDuration}
            onRestDurationChange={setRestDuration}
            isCookMode={isCookMode}
            onToggleCookMode={setIsCookMode}
            onStartWorkout={handleStartWorkout}
            onCancel={handleCancelWorkout}
            isWorkoutActive={isWorkoutActive}
            onToggleWorkout={toggleWorkout}
          />
        </div>
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
