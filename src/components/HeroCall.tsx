
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Swords } from 'lucide-react';
import { workoutTemplates } from './hero-call/WorkoutTemplates';
import { StreakTracker } from './hero-call/StreakTracker';
import { WorkoutDisplay } from './hero-call/WorkoutDisplay';
import { getDailyWorkout, getStreakData, updateStreak } from './hero-call/utils';

export const HeroCall = () => {
  const [currentWorkout, setCurrentWorkout] = useState(getDailyWorkout());
  const [selectedLevel, setSelectedLevel] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [streakData, setStreakData] = useState(getStreakData());
  
  const isCompletedToday = () => {
    if (!streakData.lastCompleted) return false;
    const today = new Date().toDateString();
    const lastCompleted = new Date(streakData.lastCompleted).toDateString();
    return today === lastCompleted;
  };

  const handleMarkComplete = () => {
    const newStreakData = updateStreak();
    setStreakData(newStreakData);
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
                onMarkComplete={handleMarkComplete}
                showFullDisplay={true}
              />
              
              <WorkoutDisplay 
                workout={currentWorkout}
                selectedLevel={selectedLevel}
                onLevelChange={setSelectedLevel}
              />
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
