
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { X, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import { SimpleExerciseSelector } from './SimpleExerciseSelector';
import { WorkoutHistoryAccordion } from './WorkoutHistoryAccordion';
import { AIWorkoutSection } from './AIWorkoutSection';
import { ValhallaSection } from './ValhallaSection';
import type { Exercise, Workout } from '@/types';

interface SimpleWorkoutCreationProps {
  workoutName: string;
  onWorkoutNameChange: (name: string) => void;
  exercises: Exercise[];
  onAddExercise: (exerciseName: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
  onMoveExercise: (exerciseId: string, direction: 'up' | 'down') => void;
  onAddSet: (exerciseId: string) => void;
  onStartWorkout: () => void;
  onCancel: () => void;
  restDuration: number;
  onRedoWorkout?: (workout: Workout) => void;
  selectedEquipment: string[];
  onEquipmentChange: (equipment: string[]) => void;
  focusArea: string;
  onFocusChange: (focus: string) => void;
  onGenerateWorkout: () => void;
  isGenerating: boolean;
}

export const SimpleWorkoutCreation = ({
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
  onRedoWorkout,
  selectedEquipment,
  onEquipmentChange,
  focusArea,
  onFocusChange,
  onGenerateWorkout,
  isGenerating,
}: SimpleWorkoutCreationProps) => {
  const canStartWorkout = exercises.length > 0;

  const formatRestTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">New Workout</h1>
        <Button 
          onClick={onStartWorkout} 
          disabled={!canStartWorkout}
          className="bg-green-500 hover:bg-green-600"
        >
          Start
        </Button>
      </div>

      {/* Workout Name */}
      <div className="p-4 border-b">
        <Input
          placeholder="Name this Test"
          value={workoutName}
          onChange={(e) => onWorkoutNameChange(e.target.value)}
          className="text-lg font-medium border-none px-0 focus-visible:ring-0 italic placeholder:italic"
        />
      </div>

      {/* Exercise List */}
      <div className="flex-1 overflow-y-auto pb-2">
        <div className="p-4 space-y-3">
          {exercises.map((exercise, index) => (
            <Card key={exercise.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-blue-600">
                      {exercise.name || `Exercise ${index + 1}`}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {exercise.sets.length} set{exercise.sets.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onMoveExercise(exercise.id, 'up')}
                      disabled={index === 0}
                      className="h-8 w-8"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onMoveExercise(exercise.id, 'down')}
                      disabled={index === exercises.length - 1}
                      className="h-8 w-8"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveExercise(exercise.id)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Add Set Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddSet(exercise.id)}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Set ({formatRestTime(restDuration)})
                </Button>
              </CardContent>
            </Card>
          ))}
          
          <SimpleExerciseSelector
            onExerciseSelect={onAddExercise}
            trigger={
              <Button variant="outline" className="w-full justify-center py-6">
                <Plus className="h-5 w-5 mr-2" />
                Add Exercise
              </Button>
            }
          />
          
          {/* OR Separator */}
          <div className="flex items-center justify-center py-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <div className="px-4 text-sm text-gray-500 font-medium">OR</div>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
          
          {/* Workout History Accordion */}
          <WorkoutHistoryAccordion 
            onRedoWorkout={onRedoWorkout}
            className="mb-4"
          />
          
          {/* AI Workout Generation Section */}
          <AIWorkoutSection
            selectedEquipment={selectedEquipment}
            onEquipmentChange={onEquipmentChange}
            focusArea={focusArea}
            onFocusChange={onFocusChange}
            onGenerateWorkout={onGenerateWorkout}
            isGenerating={isGenerating}
          />
          
          {/* Valhalla Section - moved to last */}
          <ValhallaSection />
        </div>
      </div>
    </div>
  );
};
