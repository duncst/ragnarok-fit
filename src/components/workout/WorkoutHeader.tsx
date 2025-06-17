
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { ImageIcon } from '@/components/ImageIcon';
import { Loader2, Save, X, Play, Pause } from 'lucide-react';

interface WorkoutHeaderProps {
  workoutName: string;
  onNameChange: (name: string) => void;
  onFinish: () => void;
  onCancel: () => void;
  isSaving: boolean;
  onSaveAsTemplate: () => void;
  isSavingAsTemplate: boolean;
  isWorkoutActive: boolean;
  onToggleWorkout: () => void;
  isCookMode: boolean;
  onToggleCookMode: (pressed: boolean) => void;
}

export const WorkoutHeader = ({ 
  workoutName, 
  onNameChange, 
  onFinish, 
  onCancel,
  isSaving, 
  onSaveAsTemplate, 
  isSavingAsTemplate,
  isWorkoutActive,
  onToggleWorkout,
  isCookMode,
  onToggleCookMode
}: WorkoutHeaderProps) => {
  return (
    <div className="space-y-2">
      {/* Top row: Workout name and save as template button */}
      <div className="flex justify-between items-center gap-2">
        <Input
          placeholder="Workout Name (e.g. Push Day)"
          value={workoutName}
          onChange={(e) => onNameChange(e.target.value)}
          className="text-2xl font-bold h-auto"
        />
        <Button variant="outline" size="icon" onClick={onSaveAsTemplate} disabled={isSavingAsTemplate || isSaving}>
          {isSavingAsTemplate ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span className="sr-only">Save as template</span>
        </Button>
      </div>
      
      {/* Bottom row: All interaction buttons including workout mode and finish */}
      <div className="flex items-center gap-2">
        <Toggle
          pressed={isCookMode}
          onPressedChange={onToggleCookMode}
          variant="outline"
          className="flex items-center gap-2 px-3 py-2 h-auto"
        >
          <ImageIcon 
            src="/lovable-uploads/6ace109c-b935-4cbe-ae24-b2adfe21bde8.png"
            alt="Workout Mode"
            className="w-5 h-5"
          />
          <span className="text-sm font-medium">Workout Mode</span>
        </Toggle>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onToggleWorkout} 
          disabled={isSaving || isSavingAsTemplate}
        >
          {isWorkoutActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          <span className="sr-only">{isWorkoutActive ? 'Pause workout' : 'Start workout'}</span>
        </Button>
        <Button variant="outline" size="icon" onClick={onCancel} disabled={isSaving || isSavingAsTemplate}>
          <X className="h-4 w-4" />
          <span className="sr-only">Cancel workout</span>
        </Button>
        <Button onClick={onFinish} disabled={isSaving || isSavingAsTemplate}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Finish
        </Button>
      </div>
    </div>
  );
};
