
import React, { useCallback, useState } from 'react';
import { useNewWorkoutForm } from '@/hooks/useNewWorkoutForm';
import { useWorkoutTimer } from '@/hooks/useWorkoutTimer';
import { useValhallaScoreDialog } from '@/hooks/useValhallaScoreDialog';
import { WorkoutHeader } from '@/components/workout/WorkoutHeader';
import { ExerciseCard } from '@/components/workout/ExerciseCard';
import { WorkoutActions } from '@/components/workout/WorkoutActions';
import { EquipmentSelector } from '@/components/workout/EquipmentSelector';
import { FocusAreaSelector } from '@/components/workout/FocusAreaSelector';
import { WorkoutCookMode } from '@/components/workout/WorkoutCookMode';
import { ScoreRecordingDialog } from '@/components/workout/ScoreRecordingDialog';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { ImageIcon } from '@/components/ImageIcon';
import { Loader2, Sparkles } from 'lucide-react';
import { RestTimerSettings } from '@/components/workout/RestTimerSettings';
import { RestTimerToast } from '@/components/workout/RestTimerToast';
import { toast as sonnerToast } from 'sonner';

// Mock Valhalla workout data - in real app this would come from a database or API
const valhallaWorkouts = [
  {
    id: 'thor',
    name: 'Thor\'s Thunder',
    godName: 'Thor',
    description: 'A powerful strength workout',
    theme: 'thunder',
    icon: '⚡',
    format: 'For Time',
    scoreInstructions: 'Complete all rounds as quickly as possible. Record your total time.',
  },
  {
    id: 'odin',
    name: 'Odin\'s Wisdom',
    godName: 'Odin',
    description: 'A tactical endurance challenge',
    theme: 'wisdom',
    icon: '🦅',
    format: 'For Time',
    scoreInstructions: 'Complete all exercises in order. Record your total completion time.',
  },
];

const NewWorkoutPage = () => {
  const [isCookMode, setIsCookMode] = useState(false);
  const {
    isActive: isWorkoutActive,
    formattedDuration,
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
    finishWorkout: originalFinishWorkout,
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
  } = useNewWorkoutForm();

  const { isOpen, currentWorkout, openDialog, closeDialog } = useValhallaScoreDialog();

  const handleToggleSet = useCallback((exerciseId: string, setId: string) => {
    originalHandleToggleSet(exerciseId, setId, (isCompleted) => {
      if (isCompleted) {
        sonnerToast.custom(
          (t) => <RestTimerToast duration={restDuration} toastId={t} />,
          { duration: restDuration * 1000 + 5000, position: 'top-center' }
        );
      }
    });
  }, [originalHandleToggleSet, restDuration]);

  const finishWorkout = () => {
    // Check if this is a Valhalla workout by looking at the workout name
    const valhallaWorkout = valhallaWorkouts.find(vw => 
      workoutName.toLowerCase().includes(vw.name.toLowerCase()) ||
      workoutName.toLowerCase().includes(vw.godName.toLowerCase())
    );

    if (valhallaWorkout) {
      // Open the score recording dialog for Valhalla workouts
      openDialog(valhallaWorkout);
    } else {
      // Proceed with normal workout finish
      originalFinishWorkout();
    }
  };

  const handleEnterCookMode = () => {
    setIsCookMode(true);
  };

  const handleExitCookMode = () => {
    setIsCookMode(false);
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
        onFinishWorkout={finishWorkout}
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
          <h1 className="text-3xl font-bold tracking-tight">Create new workout</h1>
          {isWorkoutActive && (
            <div className="text-lg font-semibold text-green-600">
              {formattedDuration}
            </div>
          )}
        </div>
        
        <WorkoutHeader
          workoutName={workoutName}
          onNameChange={setWorkoutName}
          onFinish={finishWorkout}
          onCancel={cancelWorkout}
          isSaving={saveWorkoutMutation.isPending}
          onSaveAsTemplate={saveAsTemplate}
          isSavingAsTemplate={saveAsTemplateMutation.isPending}
          isWorkoutActive={isWorkoutActive}
          onToggleWorkout={toggleWorkout}
          isCookMode={isCookMode}
          onToggleCookMode={setIsCookMode}
        />

        <WorkoutActions onAddExercise={addExercise} />

        <div className="p-4 border rounded-lg">
          <RestTimerSettings
            restDuration={restDuration}
            onRestDurationChange={setRestDuration}
          />
        </div>

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

        <div className="p-4 border rounded-lg space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => generateWorkoutMutation.mutate({ equipment: selectedEquipment, focus: focusArea })}
            disabled={generateWorkoutMutation.isPending}
          >
            {generateWorkoutMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate with AI
          </Button>
          <FocusAreaSelector
            selectedFocus={focusArea}
            onFocusChange={setFocusArea}
          />
          <EquipmentSelector
            selectedEquipment={selectedEquipment}
            onEquipmentChange={setSelectedEquipment}
          />
        </div>
      </div>

      <ScoreRecordingDialog
        workout={currentWorkout}
        isOpen={isOpen}
        onClose={closeDialog}
      />
    </>
  );
};

export default NewWorkoutPage;
