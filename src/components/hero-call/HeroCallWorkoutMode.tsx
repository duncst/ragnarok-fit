
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Swords, Shield, Flame, X, Play, Pause, Check, Clock, Target } from 'lucide-react';
import { HeroCallWorkout } from './WorkoutTemplates';

interface HeroCallWorkoutModeProps {
  workout: HeroCallWorkout;
  selectedLevel: 'easy' | 'medium' | 'hard';
  onFinish: () => void;
  onExit: () => void;
  isWorkoutActive: boolean;
  formattedDuration: string;
  onToggleWorkout: () => void;
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

export const HeroCallWorkoutMode = ({
  workout,
  selectedLevel,
  onFinish,
  onExit,
  isWorkoutActive,
  formattedDuration,
  onToggleWorkout,
}: HeroCallWorkoutModeProps) => {
  const currentLevel = workout.levels.find(level => level.difficulty === selectedLevel);
  
  if (!currentLevel) return null;

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      <div className="min-h-screen p-4 space-y-6">
        {/* Header */}
        <div className="sticky top-4 bg-background/95 backdrop-blur-sm z-10 p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Swords className="h-8 w-8 text-primary flex-shrink-0" />
              <h1 className="text-xl sm:text-2xl font-bold truncate">
                Hero's Call: {workout.name}
              </h1>
            </div>
            <Button variant="outline" size="icon" onClick={onExit} className="flex-shrink-0">
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Controls Row */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="text-lg font-semibold text-white bg-green-600 px-3 py-1 rounded-md">
              {formattedDuration}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onToggleWorkout}
              className="flex items-center gap-2"
            >
              {isWorkoutActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span className="hidden sm:inline">
                {isWorkoutActive ? 'Pause' : 'Resume'}
              </span>
            </Button>
            <Button 
              onClick={onFinish}
              size="sm"
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              <span>Finish</span>
            </Button>
          </div>
        </div>

        {/* Workout Content */}
        <div className="space-y-6 pb-6">
          {/* Motivation Quote */}
          <Card className="border-2 border-primary/20">
            <CardContent className="p-4">
              <p className="text-center text-lg italic text-primary font-medium">
                "{workout.motivation}"
              </p>
            </CardContent>
          </Card>

          {/* Current Level Display */}
          <Card className="border-2">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getIcon(currentLevel.icon)}
                  <Badge variant="outline" className="font-medium">
                    {currentLevel.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {currentLevel.duration}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-card border rounded-lg p-4 space-y-2">
                {currentLevel.exercises.map((exercise, index) => (
                  <div key={index} className={`text-sm ${exercise.startsWith('•') ? 'ml-4' : exercise.includes('rounds:') || exercise.includes('EMOM') || exercise.includes('circuit') ? 'font-semibold text-primary' : ''}`}>
                    {exercise}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                <Target className="h-4 w-4" />
                <span><strong>Rest:</strong> {currentLevel.rest}</span>
              </div>
            </CardContent>
          </Card>

          {/* Motivational Footer */}
          <Card className="bg-primary/5">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground font-medium">
                Remember, warrior: <span className="text-primary">Consistency conquers perfection.</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
