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
import { SimpleWorkoutCreation } from '@/components/workout/SimpleWorkoutCreation';
import { SimpleWorkoutExecution } from '@/components/workout/SimpleWorkoutExecution';
import { AIWorkoutSection } from '@/components/workout/AIWorkoutSection';
import { ValhallaSection } from '@/components/workout/ValhallaSection';
import { toast as sonnerToast } from 'sonner';

const NewWorkoutPage = () => {
  const [isCookMode, setIsCookMode] = useState(false);
  const [isInWorkoutFlow, setIsInWorkoutFlow] = useState(false);
  const [trialWorkout, setTrialWorkout] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [workoutMode, setWorkoutMode] = useState<'simple' | 'advanced'>('simple');
  
  const {
    isActive: isWorkoutActive,
    formattedDuration,
    totalDuration,
    toggleWorkout,
  } = useWorkoutTimer();
  
  const {
    workoutName,
    setWorkoutName,
    exercises,
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
        sonnerToast.custom(
          (t) => <RestTimerToast duration={restDuration} toastId={t} />,
          { duration: restDuration * 1000 + 5000, position: 'top-center' }
        );
      }
    });
  }, [originalHandleToggleSet, restDuration, isValhallaWorkout]);

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

  const handleStartValhalla = (valhallaName: string) => {
    setWorkoutName(valhallaName);
    // Valhalla workouts will be loaded from templates automatically
  };

  const handleStartWorkout = () => {
    setIsInWorkoutFlow(true);
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
    addExercise();
    // Update the last added exercise with the selected name
    setTimeout(() => {
      const lastExercise = exercises[exercises.length];
      if (lastExercise?.id) {
        updateExerciseName(lastExercise.id, exerciseName);
      }
    }, 0);
  };

  // If we have a Trial of Embers workout, show the Hero Call workout mode
  if (trialWorkout && isInWorkoutFlow) {
    return (
      <HeroCallWorkoutMode
        workout={trialWorkout}
        selectedLevel={selectedLevel}
        onFinish={handleFinishWorkout}
        onExit={handleExitTrial}
        isWorkoutActive={isWorkoutActive}
        formattedDuration={formattedDuration}
        onToggleWorkout={toggleWorkout}
      />
    );
  }

  // Simple workout creation mode (when not in workout flow)
  if (!isInWorkoutFlow && workoutMode === 'simple') {
    return (
      <div className="space-y-6 pb-16">
        <SimpleWorkoutCreation
          workoutName={workoutName}
          onWorkoutNameChange={setWorkoutName}
          exercises={exercises}
          onAddExercise={handleAddExerciseByName}
          onRemoveExercise={removeExercise}
          onStartWorkout={handleStartWorkout}
          onCancel={handleCancelWorkout}
        />
        
        {/* AI Workout Generation Section */}
        <div className="px-4">
          <AIWorkoutSection
            selectedEquipment={selectedEquipment}
            onEquipmentChange={setSelectedEquipment}
            focusArea={focusArea}
            onFocusChange={setFocusArea}
            onGenerateWorkout={handleGenerateWorkout}
            isGenerating={generateWorkoutMutation.isPending}
          />
        </div>

        {/* Valhalla Section */}
        <div className="px-4">
          <ValhallaSection />
        </div>
      </div>
    );
  }

  // Simple workout execution mode (when in workout flow)
  if (isInWorkoutFlow && workoutMode === 'simple' && !isCookMode) {
    return (
      <>
        <SimpleWorkoutExecution
          workoutName={workoutName}
          exercises={exercises}
          onAddExercise={handleAddExerciseByName}
          onAddSet={addSet}
          onUpdateSet={updateSet}
          onToggleSet={handleToggleSet}
          onFinishWorkout={handleFinishWorkout}
          onCancelWorkout={handleCancelWorkout}
          workoutTimer={formattedDuration}
        />
        
        <ValhallaScoreDialog
          isOpen={showValhallaScoreDialog}
          onClose={onCloseValhallaDialog}
          workoutName={currentValhallaWorkout}
          workoutDuration={workoutDuration}
        />
      </>
    );
  }

  if (isCookMode && isInWorkoutFlow) {
    return (
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
    );
  }

  if (isInWorkoutFlow) {
    return (
      <>
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

        <ValhallaScoreDialog
          isOpen={showValhallaScoreDialog}
          onClose={onCloseValhallaDialog}
          workoutName={currentValhallaWorkout}
          workoutDuration={workoutDuration}
        />
      </>
    );
  }

  return (
    <>
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

      <ValhallaScoreDialog
        isOpen={showValhallaScoreDialog}
        onClose={onCloseValhallaDialog}
        workoutName={currentValhallaWorkout}
        workoutDuration={workoutDuration}
      />
    </>
  );
};

export default NewWorkoutPage;
