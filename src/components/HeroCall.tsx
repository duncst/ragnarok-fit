
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Swords, Play, Pause, Check } from 'lucide-react';
import { workoutTemplates } from './hero-call/WorkoutTemplates';
import { StreakTracker } from './hero-call/StreakTracker';
import { WorkoutDisplay } from './hero-call/WorkoutDisplay';
import { HeroCallWorkoutMode } from './hero-call/HeroCallWorkoutMode';
import { getDailyWorkout, getStreakData, updateStreak } from './hero-call/utils';
import { useWorkoutTimer } from '@/hooks/useWorkoutTimer';

export const HeroCall = () => {
  const [currentWorkout, setCurrentWorkout] = useState(getDailyWorkout());
  const [selectedLevel, setSelectedLevel] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [streakData, setStreakData] = useState(getStreakData());
  const [isInWorkoutMode, setIsInWorkoutMode] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  
  const {
    isActive: isWorkoutActive,
    formattedDuration,
    totalDuration,
    toggleWorkout,
    resetTimer
  } = useWorkoutTimer();
  
  const isCompletedToday = () => {
    if (!streakData.lastCompleted) return false;
    const today = new Date().toDateString();
    const lastCompleted = new Date(streakData.lastCompleted).toDateString();
    return today === lastCompleted;
  };

  const handleStartWorkout = () => {
    setIsInWorkoutMode(true);
    toggleWorkout(); // Start the timer
  };

  const handleFinishWorkout = () => {
    setShowCompletion(true);
    setIsInWorkoutMode(false);
  };

  const handleMarkComplete = () => {
    const newStreakData = updateStreak();
    setStreakData(newStreakData);
    setShowCompletion(false);
    resetTimer();
  };

  const handleExitWorkout = () => {
    setIsInWorkoutMode(false);
    setShowCompletion(false);
    resetTimer();
  };

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

  const completedToday = isCompletedToday();

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
            <Button onClick={handleMarkComplete} className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              Mark as Complete
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
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="hero-call">
        <AccordionTrigger className="text-left">
          <div className="flex items-center justify-between w-full pr-2">
            <div className="flex items-center gap-2">
              <Swords className="h-5 w-5 text-primary" />
              <span className="font-bold text-primary">Daily Hero's Call:</span>
              <span className="font-semibold">{currentWorkout.name}</span>
            </div>
            <StreakTracker streakData={streakData} completedToday={completedToday} />
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <Card className="border-0 shadow-none">
            <CardContent className="space-y-4 p-0">
              <StreakTracker 
                streakData={streakData} 
                completedToday={completedToday}
                showFullDisplay={true}
              />
              
              <WorkoutDisplay 
                workout={currentWorkout}
                selectedLevel={selectedLevel}
                onLevelChange={setSelectedLevel}
              />
              
              {!completedToday && (
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
              
              {completedToday && (
                <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                  <Check className="h-4 w-4" />
                  Today's Hero's Call completed! 🔥
                </div>
              )}
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
