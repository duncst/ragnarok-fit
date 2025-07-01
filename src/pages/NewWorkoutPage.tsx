
import React, { useCallback, useState, useEffect } from 'react';
import { useNewWorkoutForm } from '@/hooks/useNewWorkoutForm';
import { useWorkoutTimer } from '@/hooks/useWorkoutTimer';
import { SimpleWorkoutCreation } from '@/components/workout/SimpleWorkoutCreation';
import { SimpleWorkoutExecution } from '@/components/workout/SimpleWorkoutExecution';
import { ValhallaScoreDialog } from '@/components/workout/ValhallaScoreDialog';
import { RestTimerToast } from '@/components/workout/RestTimerToast';
import { HeroCallWorkoutMode } from '@/components/hero-call/HeroCallWorkoutMode';
import { toast as sonnerToast } from 'sonner';
import type { Exercise } from '@/types';

const NewWorkoutPage = () => {
  const [isInWorkoutFlow, setIsInWorkoutFlow] = useState(false);
  const [trialWorkout, setTrialWorkout] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState<'easy' | 'medium' | 'hard'>('medium');
  
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
    setExercises,
    addSet,
    updateSet,
    handleToggleSet: originalHandleToggleSet,
    finishWorkout,
    cancelWorkout,
    saveWorkoutMutation,
    restDuration,
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
      localStorage.removeItem('hero-call-trial-workout');
    }
  }, [setWorkoutName]);

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

  const handleStartWorkout = (name: string, workoutExercises: Exercise[]) => {
    setWorkoutName(name);
    setExercises(workoutExercises);
    setIsInWorkoutFlow(true);
  };

  const handleFinishWorkout = () => {
    finishWorkout(totalDuration);
    setIsInWorkoutFlow(false);
    setTrialWorkout(null);
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

  // Workout execution phase
  if (isInWorkoutFlow) {
    return (
      <>
        <SimpleWorkoutExecution
          workoutName={workoutName}
          exercises={exercises}
          onAddSet={addSet}
          onUpdateSet={updateSet}
          onToggleSet={handleToggleSet}
          onFinishWorkout={handleFinishWorkout}
          onCancelWorkout={handleCancelWorkout}
          isWorkoutActive={isWorkoutActive}
          formattedDuration={formattedDuration}
          onToggleWorkout={toggleWorkout}
          isSaving={saveWorkoutMutation.isPending}
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

  // Workout creation phase
  return (
    <SimpleWorkoutCreation
      onStartWorkout={handleStartWorkout}
      onCancel={() => window.history.back()}
    />
  );
};

export default NewWorkoutPage;
