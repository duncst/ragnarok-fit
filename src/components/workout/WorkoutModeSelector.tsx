
import React from 'react';
import { SimpleWorkoutCreation } from './SimpleWorkoutCreation';
import type { Exercise, Workout } from '@/types';

interface WorkoutModeSelectorProps {
  workoutName: string;
  onWorkoutNameChange: (name: string) => void;
  exercises: Exercise[];
  onAddExercise: (exerciseName: string) => void;
  onRemoveExercise: (id: string) => void;
  onMoveExercise: (exerciseId: string, direction: 'up' | 'down') => void;
  onAddSet: (exerciseId: string) => void;
  onStartWorkout: () => void;
  onCancel: () => void;
  restDuration: number;
  selectedEquipment: string[];
  onEquipmentChange: (equipment: string[]) => void;
  focusArea: string;
  onFocusChange: (focus: string) => void;
  onGenerateWorkout: () => void;
  isGenerating: boolean;
  onRedoWorkout?: (workout: Workout) => void;
}

export const WorkoutModeSelector = ({
  workoutName,
  onWorkoutNameChange,
  exercises,
  onAddExercise,
  onRemoveExercise,
  onMoveExercise,
  onAddSet,
  onStartWorkout,
  onCancel,
  restDuration,
  selectedEquipment,
  onEquipmentChange,
  focusArea,
  onFocusChange,
  onGenerateWorkout,
  isGenerating,
  onRedoWorkout
}: WorkoutModeSelectorProps) => {
  return (
    <div className="space-y-2 pb-16">
      <SimpleWorkoutCreation
        workoutName={workoutName}
        onWorkoutNameChange={onWorkoutNameChange}
        exercises={exercises}
        onAddExercise={onAddExercise}
        onRemoveExercise={onRemoveExercise}
        onMoveExercise={onMoveExercise}
        onAddSet={onAddSet}
        onStartWorkout={onStartWorkout}
        onCancel={onCancel}
        restDuration={restDuration}
        onRedoWorkout={onRedoWorkout}
        selectedEquipment={selectedEquipment}
        onEquipmentChange={onEquipmentChange}
        focusArea={focusArea}
        onFocusChange={onFocusChange}
        onGenerateWorkout={onGenerateWorkout}
        isGenerating={isGenerating}
      />
    </div>
  );
};
