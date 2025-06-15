
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Sparkles } from 'lucide-react';

interface WorkoutActionsProps {
  onAddExercise: () => void;
  onGenerateAI: () => void;
  isGenerating: boolean;
}

export const WorkoutActions = ({ onAddExercise, onGenerateAI, isGenerating }: WorkoutActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button variant="secondary" className="w-full" onClick={onAddExercise}>
        <Plus className="h-4 w-4 mr-2" /> Add Exercise
      </Button>
      <Button 
        variant="outline" 
        className="w-full" 
        onClick={onGenerateAI}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        )}
        Generate with AI
      </Button>
    </div>
  );
};
