
import React from 'react';
import { useNewWorkoutForm } from '@/hooks/useNewWorkoutForm';
import { WorkoutHeader } from '@/components/workout/WorkoutHeader';
import { ExerciseCard } from '@/components/workout/ExerciseCard';
import { WorkoutActions } from '@/components/workout/WorkoutActions';
import { EquipmentSelector } from '@/components/workout/EquipmentSelector';

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
  } = useNewWorkoutForm();

  return (
    <div className="space-y-4 pb-16">
      <WorkoutHeader
        workoutName={workoutName}
        onNameChange={setWorkoutName}
        onFinish={finishWorkout}
        isSaving={saveWorkoutMutation.isPending}
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

      <EquipmentSelector 
        selectedEquipment={selectedEquipment}
        onEquipmentChange={setSelectedEquipment}
      />

      <WorkoutActions
        onAddExercise={addExercise}
        onGenerateAI={() => generateWorkoutMutation.mutate({ equipment: selectedEquipment })}
        isGenerating={generateWorkoutMutation.isPending}
      />
    </div>
  );
};

export default NewWorkoutPage;
