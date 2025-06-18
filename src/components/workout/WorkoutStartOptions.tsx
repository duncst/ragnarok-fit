
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { EquipmentSelector } from './EquipmentSelector';
import { FocusAreaSelector } from './FocusAreaSelector';
import { ImageIcon } from '@/components/ImageIcon';
import { Loader2, Sparkles, Plus, Zap } from 'lucide-react';

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
}: WorkoutStartOptionsProps) => {
  const valhallaWorkouts = ['THOR', 'FENRIR', 'HEL', 'NJORD', 'ODIN'];

  return (
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
            <div>
              <label className="text-sm font-medium mb-2 block">Workout Name</label>
              <Input
                placeholder="Enter workout name (e.g. Push Day)"
                value={workoutName}
                onChange={(e) => onNameChange(e.target.value)}
              />
            </div>
            <Button onClick={onAddExercise} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add First Exercise
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="select-template" className="border rounded-lg">
        <AccordionTrigger className="px-4 py-3 hover:no-underline">
          <div className="flex items-center gap-3">
            <ImageIcon src="/lovable-uploads/0567b95e-46c3-4a2c-8526-2cd6c62d1522.png" alt="Template" className="h-5 w-5" />
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
            <span className="font-medium">Generate with AI</span>
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

      <AccordionItem value="valhalla" className="border rounded-lg">
        <AccordionTrigger className="px-4 py-3 hover:no-underline">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5" />
            <span className="font-medium">Start Valhalla Challenge</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Choose a Valhalla workout for a timed challenge. Complete as fast as possible!
            </p>
            <div className="grid grid-cols-2 gap-2">
              {valhallaWorkouts.map((workout) => (
                <Button
                  key={workout}
                  variant="outline"
                  onClick={() => onStartValhalla(workout)}
                  className="h-12"
                >
                  {workout}
                </Button>
              ))}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
