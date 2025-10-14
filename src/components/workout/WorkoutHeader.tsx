
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { ImageIcon } from '@/components/ImageIcon';
import { Loader2, Save, X, Play, Pause } from 'lucide-react';

interface WorkoutHeaderProps {
  workoutName: string;
  onNameChange: (name: string) => void;
  onSaveAsTemplate: () => void;
  onCancel: () => void;
  isSavingAsTemplate: boolean;
  isWorkoutActive: boolean;
  onToggleWorkout: () => void;
  isCookMode: boolean;
  onToggleCookMode: (pressed: boolean) => void;
  hasWorkoutData?: boolean;
}

export const WorkoutHeader = ({ 
  workoutName, 
  onNameChange, 
  onSaveAsTemplate, 
  onCancel,
  isSavingAsTemplate,
  isWorkoutActive,
  onToggleWorkout,
  isCookMode,
  onToggleCookMode,
  hasWorkoutData = false
}: WorkoutHeaderProps) => {
  return (
    <div className="space-y-2">
      {/* Workout name input */}
      <Input
        placeholder="Workout Name (e.g. Push Day)"
        value={workoutName}
        onChange={(e) => onNameChange(e.target.value)}
        className="text-2xl font-bold h-auto"
      />
      
      {/* Action buttons */}
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
          disabled={isSavingAsTemplate}
        >
          {isWorkoutActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          <span className="sr-only">{isWorkoutActive ? 'Pause workout' : 'Start workout'}</span>
        </Button>
        {hasWorkoutData && (
          <>
            <Button variant="outline" size="icon" onClick={onCancel} disabled={isSavingAsTemplate}>
              <X className="h-4 w-4" />
              <span className="sr-only">Cancel workout</span>
            </Button>
            <Button onClick={onSaveAsTemplate} disabled={isSavingAsTemplate}>
              {isSavingAsTemplate && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Save as Template
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
