
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toggle } from '@/components/ui/toggle';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { EquipmentSelector } from './EquipmentSelector';
import { FocusAreaSelector } from './FocusAreaSelector';
import { RestTimerSettings } from './RestTimerSettings';
import { ExerciseCard } from './ExerciseCard';
import { ImageIcon } from '@/components/ImageIcon';
import { ValhallaSection } from './ValhallaSection';
import { Loader2, Sparkles, Plus, Play, Trash2 } from 'lucide-react';
import type { Exercise } from '@/types';

interface WorkoutStartOptionsProps {
  workoutName: string;
  onNameChange: (name: string) => void;
  onAddExercise: () => void;
  selectedEquipment: string[];
  onEquipmentChange: (equipment: string[]) => void;
  focusArea: string;
  onFocusChange: (focus: string) => void;
  onGenerateWorkout: () => void;
  isGenerating: boolean;
  onStartValhalla: (workoutName: string) => void;
  exercises: Exercise[];
  onRemoveExercise: (exerciseId: string) => void;
  onUpdateExerciseName: (exerciseId: string, name: string) => void;
  onAddSet: (exerciseId: string) => void;
  onUpdateSet: (exerciseId: string, setId: string, field: 'reps' | 'weight' | 'duration' | 'distance', value: number) => void;
  onToggleSet: (exerciseId: string, setId: string) => void;
  restDuration: number;
  onRestDurationChange: (duration: number) => void;
  isCookMode: boolean;
  onToggleCookMode: (pressed: boolean) => void;
  onStartWorkout: () => void;
  onCancel: () => void;
  isWorkoutActive: boolean;
  onToggleWorkout: () => void;
}

export const WorkoutStartOptions = ({
  workoutName,
  onNameChange,
  onAddExercise,
  selectedEquipment,
  onEquipmentChange,
  focusArea,
  onFocusChange,
  onGenerateWorkout,
  isGenerating,
  onStartValhalla,
  exercises,
  onRemoveExercise,
  onUpdateExerciseName,
  onAddSet,
  onUpdateSet,
  onToggleSet,
  restDuration,
  onRestDurationChange,
  isCookMode,
  onToggleCookMode,
  onStartWorkout,
  onCancel,
  isWorkoutActive,
  onToggleWorkout,
}: WorkoutStartOptionsProps) => {
  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem value="create-own" className="border rounded-lg">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-3">
              <Plus className="h-5 w-5" />
              <span className="font-medium">Create Your Own Workout</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              {/* Workout Name */}
              <div>
                <label className="text-sm font-medium mb-2 block">Workout Name</label>
                <Input
                  placeholder="Enter workout name (e.g. Push Day)"
                  value={workoutName}
                  onChange={(e) => onNameChange(e.target.value)}
                />
              </div>

              {/* Rest Timer */}
              <RestTimerSettings
                restDuration={restDuration}
                onRestDurationChange={onRestDurationChange}
              />

              {/* Control Buttons Row */}
              <div className="flex items-center gap-2 flex-wrap">
                <Button 
                  onClick={onStartWorkout} 
                  className="flex items-center gap-2"
                  disabled={exercises.length === 0}
                >
                  <Play className="h-4 w-4" />
                  Start
                </Button>
                <Button variant="outline" onClick={onCancel}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Toggle
                  pressed={isCookMode}
                  onPressedChange={onToggleCookMode}
                  variant="outline"
                  className="flex items-center gap-2 px-3 py-2 h-auto"
                >
                  <ImageIcon 
                    src="/lovable-uploads/6ace109c-b935-4cbe-ae24-b2adfe21bde8.png"
                    alt="Workout Mode"
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Workout Mode</span>
                </Toggle>
              </div>

              {/* Exercises */}
              {exercises.map((exercise, exerciseIndex) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  exerciseIndex={exerciseIndex}
                  onRemove={onRemoveExercise}
                  onUpdateName={onUpdateExerciseName}
                  onAddSet={onAddSet}
                  onUpdateSet={onUpdateSet}
                  onToggleSet={onToggleSet}
                />
              ))}

              {/* Add Exercise Button */}
              <Button onClick={onAddExercise} variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Exercise {exercises.length + 1}
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="select-template" className="border rounded-lg">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-3">
              <ImageIcon 
                src="/lovable-uploads/99083c33-ce99-4041-8791-0d26ae1fbf22.png" 
                alt="Template icon"
                className="h-6 w-6 text-white"
              />
              <span className="font-medium">Select a Template</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">Choose from your saved workout templates</p>
              <Button variant="outline" onClick={() => window.location.href = '/templates'}>
                Browse Templates
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="ai-generate" className="border rounded-lg">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5" />
              <span className="font-medium">Generate Workout with AI</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              <FocusAreaSelector
                selectedFocus={focusArea}
                onFocusChange={onFocusChange}
              />
              <EquipmentSelector
                selectedEquipment={selectedEquipment}
                onEquipmentChange={onEquipmentChange}
              />
              <Button
                onClick={onGenerateWorkout}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Workout
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <ValhallaSection />
    </div>
  );
};
