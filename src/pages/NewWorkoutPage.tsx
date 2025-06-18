
import React, { useCallback, useState } from 'react';
import { useNewWorkoutForm } from '@/hooks/useNewWorkoutForm';
import { useWorkoutTimer } from '@/hooks/useWorkoutTimer';
import { WorkoutHeader } from '@/components/workout/WorkoutHeader';
import { ExerciseCard } from '@/components/workout/ExerciseCard';
import { WorkoutStartOptions } from '@/components/workout/WorkoutStartOptions';
import { WorkoutCookMode } from '@/components/workout/WorkoutCookMode';
import { ValhallaScoreDialog } from '@/components/workout/ValhallaScoreDialog';
import { RestTimerSettings } from '@/components/workout/RestTimerSettings';
import { RestTimerToast } from '@/components/workout/RestTimerToast';
import { toast as sonnerToast } from 'sonner';

const NewWorkoutPage = () => {
  const [isCookMode, setIsCookMode] = useState(false);
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
  };

  const handleFinishWorkout = () => {
    finishWorkout(totalDuration);
  };

  const handleGenerateWorkout = () => {
    generateWorkoutMutation.mutate({ equipment: selectedEquipment, focus: focusArea });
  };

  const handleStartValhalla = (valhallaName: string) => {
    setWorkoutName(valhallaName);
    // Valhalla workouts will be loaded from templates automatically
  };

  if (isCookMode) {
    return (
      <WorkoutCookMode
        workoutName={workoutName}
        exercises={exercises}
        onExitCookMode={handleExitCookMode}
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

        {hasWorkoutData ? (
          <>
            <WorkoutHeader
              workoutName={workoutName}
              onNameChange={setWorkoutName}
              onFinish={handleFinishWorkout}
              onCancel={cancelWorkout}
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
                onRemove={removeExercise}
                onUpdateName={updateExerciseName}
                onAddSet={addSet}
                onUpdateSet={updateSet}
                onToggleSet={handleToggleSet}
              />
            ))}
          </>
        ) : (
          <WorkoutStartOptions
            workoutName={workoutName}
            onNameChange={setWorkoutName}
            onAddExercise={addExercise}
            selectedEquipment={selectedEquipment}
            onEquipmentChange={setSelectedEquipment}
            focusArea={focusArea}
            onFocusChange={setFocusArea}
            onGenerateWorkout={handleGenerateWorkout}
            isGenerating={generateWorkoutMutation.isPending}
            onStartValhalla={handleStartValhalla}
          />
        )}
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
