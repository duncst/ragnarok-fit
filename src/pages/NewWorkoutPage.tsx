
import React, { useCallback } from 'react';
import { useNewWorkoutForm } from '@/hooks/useNewWorkoutForm';
import { WorkoutHeader } from '@/components/workout/WorkoutHeader';
import { ExerciseCard } from '@/components/workout/ExerciseCard';
import { WorkoutActions } from '@/components/workout/WorkoutActions';
import { EquipmentSelector } from '@/components/workout/EquipmentSelector';
import { FocusAreaSelector } from '@/components/workout/FocusAreaSelector';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { RestTimerSettings } from '@/components/workout/RestTimerSettings';
import { RestTimerToast } from '@/components/workout/RestTimerToast';
import { toast as sonnerToast } from 'sonner';

const NewWorkoutPage = () => {
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
  } = useNewWorkoutForm();

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

  return (
    <div className="space-y-4 pb-16">
      <h1 className="text-3xl font-bold tracking-tight">Create new workout</h1>
      <WorkoutHeader
        workoutName={workoutName}
        onNameChange={setWorkoutName}
        onFinish={finishWorkout}
        onCancel={cancelWorkout}
        isSaving={saveWorkoutMutation.isPending}
        onSaveAsTemplate={saveAsTemplate}
        isSavingAsTemplate={saveAsTemplateMutation.isPending}
      />

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

      <WorkoutActions onAddExercise={addExercise} />

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
  );
};

export default NewWorkoutPage;
