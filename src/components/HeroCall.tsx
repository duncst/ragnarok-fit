
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getDailyWorkout } from './hero-call/utils';
import { HeroCallWorkoutMode } from './hero-call/HeroCallWorkoutMode';
import { HeroCallCompletionView } from './hero-call/HeroCallCompletionView';
import { HeroCallChallenge } from './hero-call/HeroCallChallenge';
import { useWorkoutTimer } from '@/hooks/useWorkoutTimer';
import { useHeroCallData } from '@/hooks/useHeroCallData';
import { useSaveWorkout } from '@/hooks/useSaveWorkout';
import type { Exercise } from '@/types';

export const HeroCall = () => {
  const [currentWorkout, setCurrentWorkout] = useState(getDailyWorkout());
  const [selectedLevel, setSelectedLevel] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isInWorkoutMode, setIsInWorkoutMode] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  
  const { stats, isLoading, completeHeroCall, migrateLocalStorageData } = useHeroCallData();
  const { finishWorkout } = useSaveWorkout();
  
  const {
    isActive: isWorkoutActive,
    formattedDuration,
    toggleWorkout,
    resetTimer
  } = useWorkoutTimer();

  // Migrate localStorage data on component mount
  useEffect(() => {
    migrateLocalStorageData.mutate();
  }, []);

  useEffect(() => {
    // Update workout at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timeout = setTimeout(() => {
      setCurrentWorkout(getDailyWorkout());
    }, timeUntilMidnight);

    return () => clearTimeout(timeout);
  }, []);

  const handleStartWorkout = () => {
    setIsInWorkoutMode(true);
    toggleWorkout(); // Start the timer
  };

  const handleFinishWorkout = () => {
    setShowCompletion(true);
    setIsInWorkoutMode(false);
  };

  const handleMarkComplete = async () => {
    try {
      // Save to Hero's Call completions table
      await completeHeroCall.mutateAsync({
        workoutName: currentWorkout.name,
        difficulty: selectedLevel
      });

      // Also save as a regular workout for analytics
      const currentLevel = currentWorkout.levels.find(level => level.difficulty === selectedLevel);
      if (currentLevel) {
        const exercises: Exercise[] = [{
          id: `hero-call-${currentWorkout.name}`,
          name: `Hero's Call: ${currentWorkout.name} (${currentLevel.label})`,
          sets: [{
            id: 'completed-set',
            reps: 1,
            weight: 0,
            completed: true,
          }]
        }];

        finishWorkout({
          exercises,
          name: `Hero's Call: ${currentWorkout.name}`,
        });
      }

      setShowCompletion(false);
      resetTimer();
    } catch (error) {
      console.error('Error completing Hero\'s Call:', error);
    }
  };

  const handleExitWorkout = () => {
    setIsInWorkoutMode(false);
    setShowCompletion(false);
    resetTimer();
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <div className="animate-pulse">Loading Hero's Call...</div>
        </CardContent>
      </Card>
    );
  }

  // Workout Mode View
  if (isInWorkoutMode) {
    return (
      <HeroCallWorkoutMode
        workout={currentWorkout}
        selectedLevel={selectedLevel}
        onFinish={handleFinishWorkout}
        onExit={handleExitWorkout}
        isWorkoutActive={isWorkoutActive}
        formattedDuration={formattedDuration}
        onToggleWorkout={toggleWorkout}
      />
    );
  }

  // Completion View
  if (showCompletion) {
    return (
      <HeroCallCompletionView
        workoutName={currentWorkout.name}
        formattedDuration={formattedDuration}
        onMarkComplete={handleMarkComplete}
        onExit={handleExitWorkout}
        isLoading={completeHeroCall.isPending}
      />
    );
  }

  return (
    <HeroCallChallenge
      currentWorkout={currentWorkout}
      selectedLevel={selectedLevel}
      onLevelChange={setSelectedLevel}
      onStartWorkout={handleStartWorkout}
      stats={stats}
    />
  );
};
