
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EquipmentSelector } from './EquipmentSelector';
import { FocusAreaSelector } from './FocusAreaSelector';
import { Loader2, Sparkles } from 'lucide-react';

interface AIWorkoutSectionProps {
  selectedEquipment: string[];
  onEquipmentChange: (equipment: string[]) => void;
  focusArea: string;
  onFocusChange: (focus: string) => void;
  onGenerateWorkout: () => void;
  isGenerating: boolean;
}

export const AIWorkoutSection = ({
  selectedEquipment,
  onEquipmentChange,
  focusArea,
  onFocusChange,
  onGenerateWorkout,
  isGenerating,
}: AIWorkoutSectionProps) => {
  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-muted/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-primary" />
          <div>
            <CardTitle className="text-xl font-bold text-primary">
              Generate Workout with AI
            </CardTitle>
            <p className="text-muted-foreground text-sm mt-1">
              Let AI create a personalized workout based on your preferences
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
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
          size="lg"
        >
          {isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate Workout
        </Button>
      </CardContent>
    </Card>
  );
};
