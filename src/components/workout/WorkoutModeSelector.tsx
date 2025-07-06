
import React from 'react';
import { SimpleWorkoutCreation } from './SimpleWorkoutCreation';
import { AIWorkoutSection } from './AIWorkoutSection';
import { ValhallaSection } from './ValhallaSection';
import type { Exercise } from '@/types';

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
  isGenerating
}: WorkoutModeSelectorProps) => {
  return (
    <div className="space-y-6 pb-16">
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
      />
      
      {/* OR Separator */}
      <div className="flex items-center justify-center py-4">
        <div className="flex-1 border-t border-gray-300"></div>
        <div className="px-4 text-sm text-gray-500 font-medium">OR</div>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* AI Workout Generation Section */}
      <div className="px-4">
        <AIWorkoutSection
          selectedEquipment={selectedEquipment}
          onEquipmentChange={onEquipmentChange}
          focusArea={focusArea}
          onFocusChange={onFocusChange}
          onGenerateWorkout={onGenerateWorkout}
          isGenerating={isGenerating}
        />
      </div>

      {/* Valhalla Section */}
      <div className="px-4">
        <ValhallaSection />
      </div>
    </div>
  );
};
