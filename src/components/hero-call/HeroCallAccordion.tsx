
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Swords, Play, Check } from 'lucide-react';
import { StreakTracker } from './StreakTracker';
import { WorkoutDisplay } from './WorkoutDisplay';
import { HeroCallWorkout } from './WorkoutTemplates';

interface HeroCallAccordionProps {
  currentWorkout: HeroCallWorkout;
  selectedLevel: 'easy' | 'medium' | 'hard';
  onLevelChange: (level: 'easy' | 'medium' | 'hard') => void;
  onStartWorkout: () => void;
  stats: any;
}

export const HeroCallAccordion = ({
  currentWorkout,
  selectedLevel,
  onLevelChange,
  onStartWorkout,
  stats
}: HeroCallAccordionProps) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="hero-call" className="border-none">
        <AccordionTrigger className="text-left px-6 py-4">
          <div className="flex items-center justify-between w-full pr-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Swords className="h-5 w-5 text-primary" />
                <span className="font-bold text-primary text-lg">Will you answer the Hero's Call?</span>
              </div>
              <span className="text-sm text-muted-foreground italic">Each dawn is a summons. You may remain unchanged—or rise anew.</span>
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
              onLevelChange={onLevelChange}
            />
            
            {!stats.completedToday && (
              <div className="flex justify-center pt-4">
                <Button 
                  onClick={onStartWorkout}
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <Swords className="h-5 w-5" />
                  Answer the Call
                </Button>
              </div>
            )}
            
            {stats.completedToday && (
              <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                <Check className="h-4 w-4" />
                The deed is done. Return tomorrow. The saga continues.
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
