
import React from 'react';
import { useNewWorkoutForm } from '@/hooks/useNewWorkoutForm';
import { WorkoutHeader } from '@/components/workout/WorkoutHeader';
import { ExerciseCard } from '@/components/workout/ExerciseCard';
import { WorkoutActions } from '@/components/workout/WorkoutActions';
import { EquipmentSelector } from '@/components/workout/EquipmentSelector';
import { FocusAreaSelector } from '@/components/workout/FocusAreaSelector';

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
    handleToggleSet,
    finishWorkout,
    saveWorkoutMutation,
    generateWorkoutMutation,
    selectedEquipment,
    setSelectedEquipment,
    saveAsTemplate,
    saveAsTemplateMutation,
    focusArea,
    setFocusArea,
  } = useNewWorkoutForm();

  return (
    <div className="space-y-4 pb-16">
      <WorkoutHeader
        workoutName={workoutName}
        onNameChange={setWorkoutName}
        onFinish={finishWorkout}
        isSaving={saveWorkoutMutation.isPending}
        onSaveAsTemplate={saveAsTemplate}
        isSavingAsTemplate={saveAsTemplateMutation.isPending}
      />

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EquipmentSelector 
          selectedEquipment={selectedEquipment}
          onEquipmentChange={setSelectedEquipment}
        />
        <FocusAreaSelector
          selectedFocus={focusArea}
          onFocusChange={setFocusArea}
        />
      </div>

      <WorkoutActions
        onAddExercise={addExercise}
        onGenerateAI={() => generateWorkoutMutation.mutate({ equipment: selectedEquipment, focus: focusArea })}
        isGenerating={generateWorkoutMutation.isPending}
      />
    </div>
  );
};

export default NewWorkoutPage;
