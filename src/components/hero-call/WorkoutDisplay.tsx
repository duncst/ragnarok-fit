
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Swords, Shield, Flame, Clock, Target } from 'lucide-react';
import { HeroCallWorkout } from './WorkoutTemplates';

interface WorkoutDisplayProps {
  workout: HeroCallWorkout;
  selectedLevel: 'easy' | 'medium' | 'hard';
  onLevelChange: (level: 'easy' | 'medium' | 'hard') => void;
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Swords':
      return <Swords className="h-4 w-4" />;
    case 'Shield':
      return <Shield className="h-4 w-4" />;
    case 'Flame':
      return <Flame className="h-4 w-4" />;
    default:
      return <Swords className="h-4 w-4" />;
  }
};

export const WorkoutDisplay = ({ workout, selectedLevel, onLevelChange }: WorkoutDisplayProps) => {
  return (
    <>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground italic">
          "{workout.motivation}"
        </p>
        <div className="bg-muted/50 p-3 rounded-lg">
          <p className="text-sm leading-relaxed font-medium text-foreground">The forge is hot. Step into it.</p>
          <p className="text-sm leading-relaxed mt-2">{workout.description}</p>
        </div>
      </div>

      <Tabs value={selectedLevel} onValueChange={(value) => onLevelChange(value as 'easy' | 'medium' | 'hard')} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="easy" className="flex items-center gap-2">
            <Swords className="h-4 w-4" />
            Easy
          </TabsTrigger>
          <TabsTrigger value="medium" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Medium
          </TabsTrigger>
          <TabsTrigger value="hard" className="flex items-center gap-2">
            <Flame className="h-4 w-4" />
            Hard
          </TabsTrigger>
        </TabsList>

        {workout.levels.map((level) => (
          <TabsContent key={level.difficulty} value={level.difficulty} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getIcon(level.icon)}
                <Badge variant="outline" className="font-medium">
                  {level.label}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {level.duration}
              </div>
            </div>

            <div className="bg-card border rounded-lg p-3 space-y-2">
              {level.exercises.map((exercise, index) => (
                <div key={index} className={`text-sm ${exercise.startsWith('•') ? 'ml-4' : exercise.includes('rounds:') || exercise.includes('EMOM') || exercise.includes('circuit') ? 'font-semibold text-primary' : ''}`}>
                  {exercise}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-lg">
              <Target className="h-4 w-4" />
              <span><strong>Rest:</strong> {level.rest}</span>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Separator />

      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground font-medium">
          Are you ready to begin? <span className="text-primary">Will you honor this commitment?</span>
        </p>
        <p className="text-xs text-muted-foreground">
          This is no mere exercise. It is a test of will, discipline, and respect for the craft.
        </p>
      </div>
    </>
  );
};
