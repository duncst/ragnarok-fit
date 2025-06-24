
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Swords, Play, Check } from 'lucide-react';
import { getDailyWorkout } from './hero-call/utils';
import { StreakTracker } from './hero-call/StreakTracker';
import { WorkoutDisplay } from './hero-call/WorkoutDisplay';
import { HeroCallWorkoutMode } from './hero-call/HeroCallWorkoutMode';
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
      <Card className="w-full">
        <CardContent className="p-6 text-center space-y-4">
          <div className="space-y-2">
            <Check className="h-12 w-12 text-green-600 mx-auto" />
            <h2 className="text-2xl font-bold text-primary">Challenge Complete!</h2>
            <p className="text-muted-foreground">
              You've completed today's Hero's Call: <strong>{currentWorkout.name}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Duration: {formattedDuration}
            </p>
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button 
              onClick={handleMarkComplete} 
              className="flex items-center gap-2"
              disabled={completeHeroCall.isPending}
            >
              <Check className="h-4 w-4" />
              {completeHeroCall.isPending ? 'Saving...' : 'Mark as Complete'}
            </Button>
            <Button variant="outline" onClick={handleExitWorkout}>
              Exit
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="hero-call" className="border-none">
            <AccordionTrigger className="text-left px-6 py-4">
              <div className="flex items-center justify-between w-full pr-2">
                <div className="flex items-center gap-2">
                  <Swords className="h-5 w-5 text-primary" />
                  <span className="font-bold text-primary">Daily Hero's Call:</span>
                  <span className="font-semibold">{currentWorkout.name}</span>
                </div>
                <StreakTracker streakData={stats} completedToday={stats.completedToday} />
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <div className="space-y-4">
                <StreakTracker 
                  streakData={stats} 
                  completedToday={stats.completedToday}
                  showFullDisplay={true}
                />
                
                <WorkoutDisplay 
                  workout={currentWorkout}
                  selectedLevel={selectedLevel}
                  onLevelChange={setSelectedLevel}
                />
                
                {!stats.completedToday && (
                  <div className="flex justify-center pt-4">
                    <Button 
                      onClick={handleStartWorkout}
                      size="lg"
                      className="flex items-center gap-2"
                    >
                      <Play className="h-5 w-5" />
                      Start Hero's Call
                    </Button>
                  </div>
                )}
                
                {stats.completedToday && (
                  <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                    <Check className="h-4 w-4" />
                    Today's Hero's Call completed! 🔥
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};
