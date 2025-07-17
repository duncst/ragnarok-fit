import React from 'react';
import { HeroCallWorkoutMode } from '@/components/hero-call/HeroCallWorkoutMode';

interface TrialWorkoutModeProps {
  trialWorkout: any;
  selectedLevel: 'easy' | 'medium' | 'hard';
  onFinish: () => void;
  onExit: () => void;
  isWorkoutActive: boolean;
  formattedDuration: string;
  onToggleWorkout: () => void;
  onRestartTimer?: () => void;
}

export const TrialWorkoutMode = ({
  trialWorkout,
  selectedLevel,
  onFinish,
  onExit,
  isWorkoutActive,
  formattedDuration,
  onToggleWorkout,
  onRestartTimer = () => {},
}: TrialWorkoutModeProps) => {
  return (
    <HeroCallWorkoutMode
      workout={trialWorkout}
      selectedLevel={selectedLevel}
      onFinish={onFinish}
      onExit={onExit}
      isWorkoutActive={isWorkoutActive}
      formattedDuration={formattedDuration}
      onToggleWorkout={onToggleWorkout}
      onRestartTimer={onRestartTimer}
    />
  );
};