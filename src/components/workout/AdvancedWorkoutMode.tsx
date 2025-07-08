import React from 'react';
import { WorkoutHeader } from './WorkoutHeader';
import { ExerciseCard } from './ExerciseCard';
import { WorkoutStartOptions } from './WorkoutStartOptions';
import { RestTimerSettings } from './RestTimerSettings';
import type { Exercise } from '@/types';

interface AdvancedWorkoutModeProps {
  // State
  isInWorkoutFlow: boolean;
  workoutName: string;
  exercises: Exercise[];
  restDuration: number;
  isCookMode: boolean;
  isWorkoutActive: boolean;
  formattedDuration: string;
  isValhallaWorkout: boolean;
  hasWorkoutData: boolean;
  
  // Mutation states
  isSaving: boolean;
  isSavingAsTemplate: boolean;
  
  // Handlers
  onNameChange: (name: string) => void;
  onFinish: () => void;
  onCancel: () => void;
  onSaveAsTemplate: () => void;
  onToggleWorkout: () => void;
  onToggleCookMode: (enabled: boolean) => void;
  onRestDurationChange: (duration: number) => void;
  onAddExercise: () => void;
  onRemoveExercise: (id: string) => void;
  onUpdateExerciseName: (id: string, name: string) => void;
  onAddSet: (exerciseId: string) => void;
  onUpdateSet: (exerciseId: string, setId: string, field: string, value: any) => void;
  onToggleSet: (exerciseId: string, setId: string) => void;
  onMoveExercise: (exerciseId: string, direction: 'up' | 'down') => void;
  onStartWorkout: () => void;
}

export const AdvancedWorkoutMode = ({
  isInWorkoutFlow,
  workoutName,
  exercises,
  restDuration,
  isCookMode,
  isWorkoutActive,
  formattedDuration,
  isValhallaWorkout,
  hasWorkoutData,
  isSaving,
  isSavingAsTemplate,
  onNameChange,
  onFinish,
  onCancel,
  onSaveAsTemplate,
  onToggleWorkout,
  onToggleCookMode,
  onRestDurationChange,
  onAddExercise,
  onRemoveExercise,
  onUpdateExerciseName,
  onAddSet,
  onUpdateSet,
  onToggleSet,
  onMoveExercise,
  onStartWorkout,
}: AdvancedWorkoutModeProps) => {
  if (isInWorkoutFlow) {
    return (
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
          onNameChange={onNameChange}
          onFinish={onFinish}
          onCancel={onCancel}
          isSaving={isSaving}
          onSaveAsTemplate={onSaveAsTemplate}
          isSavingAsTemplate={isSavingAsTemplate}
          isWorkoutActive={isWorkoutActive}
          onToggleWorkout={onToggleWorkout}
          isCookMode={isCookMode}
          onToggleCookMode={onToggleCookMode}
          hasWorkoutData={hasWorkoutData}
        />

        {!isValhallaWorkout && (
          <div className="p-4 border rounded-lg">
            <RestTimerSettings
              restDuration={restDuration}
              onRestDurationChange={onRestDurationChange}
            />
          </div>
        )}

        {exercises.map((exercise, exerciseIndex) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            exerciseIndex={exerciseIndex}
            totalExercises={exercises.length}
            onRemove={onRemoveExercise}
            onMove={onMoveExercise}
            onUpdateName={onUpdateExerciseName}
            onAddSet={onAddSet}
            onUpdateSet={onUpdateSet}
            onToggleSet={onToggleSet}
          />
        ))}
      </div>
    );
  }

  return (
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
        onNameChange={onNameChange}
        onAddExercise={onAddExercise}
        exercises={exercises}
        onRemoveExercise={onRemoveExercise}
        onUpdateExerciseName={onUpdateExerciseName}
        onAddSet={onAddSet}
        onUpdateSet={onUpdateSet}
        onToggleSet={onToggleSet}
        restDuration={restDuration}
        onRestDurationChange={onRestDurationChange}
        isCookMode={isCookMode}
        onToggleCookMode={onToggleCookMode}
        onStartWorkout={onStartWorkout}
        onCancel={onCancel}
        isWorkoutActive={isWorkoutActive}
        onToggleWorkout={onToggleWorkout}
      />
    </div>
  );
};