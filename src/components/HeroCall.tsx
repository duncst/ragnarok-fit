
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getDailyWorkout } from './hero-call/utils';
import { HeroCallWorkoutMode } from './hero-call/HeroCallWorkoutMode';
import { HeroCallChallenge } from './hero-call/HeroCallChallenge';
import { WorkoutCompletionDialog } from './workout/WorkoutCompletionDialog';
import { useWorkoutTimer } from '@/hooks/useWorkoutTimer';
import { useHeroCallData } from '@/hooks/useHeroCallData';
import { useSaveWorkout } from '@/hooks/useSaveWorkout';
import { useBrotherhoodActivities } from '@/hooks/useBrotherhoodActivities';
import { useActiveWorkout } from '@/contexts/ActiveWorkoutContext';
import { useLocation } from 'react-router-dom';
import type { Exercise } from '@/types';

export const HeroCall = () => {
  const [currentWorkout, setCurrentWorkout] = useState(getDailyWorkout());
  const [selectedLevel, setSelectedLevel] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isInWorkoutMode, setIsInWorkoutMode] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  
  const { stats, isLoading, completeHeroCall, migrateLocalStorageData } = useHeroCallData();
  const { finishWorkout } = useSaveWorkout();
  const { addActivity } = useBrotherhoodActivities();
  const { setActiveWorkout } = useActiveWorkout();
  const location = useLocation();
  
  const {
    isActive: isWorkoutActive,
    formattedDuration,
    toggleWorkout,
    resetTimer,
    startTime
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
    // Register active workout
    setActiveWorkout({
      id: 'hero-call',
      name: currentWorkout.name,
      type: 'hero_call',
      startTime: new Date(),
      returnPath: location.pathname,
    });
    // Don't start timer automatically - user will start it manually
  };

  const handleFinishWorkout = () => {
    setShowCompletion(true);
    setIsInWorkoutMode(false);
  };

  const handleMarkComplete = async (forgeMessage?: string) => {
    try {
      // Save to Hero's Call completions table
      await completeHeroCall.mutateAsync({
        workoutName: currentWorkout.name,
        difficulty: selectedLevel
      });

      // Record brotherhood activity
      await addActivity(
        'hero_call',
        `Answered the Hero's Call: ${currentWorkout.name}`,
        undefined,
        forgeMessage
      );

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
          forgeMessage,
        });
      }

      setShowCompletion(false);
      resetTimer();
      setActiveWorkout(null);
    } catch (error) {
      console.error('Error completing Hero\'s Call:', error);
    }
  };

  const handleExitWorkout = () => {
    setIsInWorkoutMode(false);
      setShowCompletion(false);
      resetTimer();
      setActiveWorkout(null);
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
        onRestartTimer={resetTimer}
      />
    );
  }

  // Completion View
  if (showCompletion) {
    return (
      <WorkoutCompletionDialog
        isOpen={showCompletion}
        workoutName={`Hero's Call: ${currentWorkout.name}`}
        workoutDuration={formattedDuration}
        onComplete={handleMarkComplete}
        onCancel={handleExitWorkout}
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
