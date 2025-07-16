import React from 'react';
import { WorkoutModeSelector } from './WorkoutModeSelector';
import { SimpleWorkoutExecution } from './SimpleWorkoutExecution';
import type { Exercise, Workout } from '@/types';

interface WorkoutModeManagerProps {
  // Workout state
  isInWorkoutFlow: boolean;
  workoutMode: 'simple' | 'advanced';
  workoutName: string;
  exercises: Exercise[];
  restDuration: number;
  formattedDuration: string;
  isStarted: boolean;
  
  // Rest timer
  showRestTimer?: boolean;
  restTimerDuration?: number;
  onDismissRestTimer?: () => void;
  
  // Equipment and focus
  selectedEquipment: string[];
  focusArea: string;
  isGenerating: boolean;
  
  // Handlers
  onWorkoutNameChange: (name: string) => void;
  onAddExercise: (exerciseName: string) => void;
  onRemoveExercise: (id: string) => void;
  onMoveExercise: (exerciseId: string, direction: 'up' | 'down') => void;
  onAddSet: (exerciseId: string) => void;
  onUpdateSet: (exerciseId: string, setId: string, field: string, value: any) => void;
  onToggleSet: (exerciseId: string, setId: string) => void;
  onStartWorkout: () => void;
  onFinishWorkout: () => void;
  onCancelWorkout: () => void;
  onEquipmentChange: (equipment: string[]) => void;
  onFocusChange: (focus: string) => void;
  onGenerateWorkout: () => void;
  onRestDurationChange: (duration: number) => void;
  onRedoWorkout?: (workout: Workout) => void;
}

export const WorkoutModeManager = ({
  isInWorkoutFlow,
  workoutMode,
  workoutName,
  exercises,
  restDuration,
  formattedDuration,
  isStarted,
  showRestTimer = false,
  restTimerDuration = 0,
  onDismissRestTimer = () => {},
  selectedEquipment,
  focusArea,
  isGenerating,
  onWorkoutNameChange,
  onAddExercise,
  onRemoveExercise,
  onMoveExercise,
  onAddSet,
  onUpdateSet,
  onToggleSet,
  onStartWorkout,
  onFinishWorkout,
  onCancelWorkout,
  onEquipmentChange,
  onFocusChange,
  onGenerateWorkout,
  onRestDurationChange,
  onRedoWorkout,
}: WorkoutModeManagerProps) => {
  // Simple workout creation mode (when not in workout flow)
  if (!isInWorkoutFlow && workoutMode === 'simple') {
    return (
      <WorkoutModeSelector
        workoutName={workoutName}
        onWorkoutNameChange={onWorkoutNameChange}
        exercises={exercises}
        onAddExercise={onAddExercise}
        onRemoveExercise={onRemoveExercise}
        onMoveExercise={onMoveExercise}
        onAddSet={onAddSet}
        onStartWorkout={onStartWorkout}
        onCancel={onCancelWorkout}
        restDuration={restDuration}
        selectedEquipment={selectedEquipment}
        onEquipmentChange={onEquipmentChange}
        focusArea={focusArea}
        onFocusChange={onFocusChange}
        onGenerateWorkout={onGenerateWorkout}
        isGenerating={isGenerating}
        onRedoWorkout={onRedoWorkout}
      />
    );
  }

  // Simple workout execution mode (when in workout flow)
  if (isInWorkoutFlow && workoutMode === 'simple') {
    return (
      <SimpleWorkoutExecution
        workoutName={workoutName}
        exercises={exercises}
        onAddExercise={onAddExercise}
        onRemoveExercise={onRemoveExercise}
        onMoveExercise={onMoveExercise}
        onAddSet={onAddSet}
        onUpdateSet={onUpdateSet}
        onToggleSet={onToggleSet}
        onStartWorkout={onStartWorkout}
        onFinishWorkout={onFinishWorkout}
        onCancelWorkout={onCancelWorkout}
        workoutTimer={formattedDuration}
        isStarted={isStarted}
        restDuration={restDuration}
        onRestDurationChange={onRestDurationChange}
        showRestTimer={showRestTimer}
        restTimerDuration={restTimerDuration}
        onDismissRestTimer={onDismissRestTimer}
      />
    );
  }

  return null;
};