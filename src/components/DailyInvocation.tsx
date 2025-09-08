import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Swords, Shield, Zap, Leaf, Lock } from 'lucide-react';
import { HeroCall } from './HeroCall';
import { MobilityRoutine } from './recovery/MobilityRoutine';
import { useHeroCallData } from '@/hooks/useHeroCallData';
import { useNavigate } from 'react-router-dom';

type WorkoutPath = 'hero-call' | 'strength' | 'endurance' | 'recovery';

interface WorkoutOption {
  id: WorkoutPath;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  buttonText: string;
  isLocked?: boolean;
  lockReason?: string;
}

export const DailyInvocation = () => {
  const [selectedPath, setSelectedPath] = useState<WorkoutPath | null>(null);
  const { stats } = useHeroCallData();
  const navigate = useNavigate();

  // Daily rotating phrases
  const getDailyPhrase = () => {
    const phrases = [
      "How will you ready yourself for the trials ahead?",
      "What will you forge within yourself today?", 
      "How will you earn your place among the worthy?",
      "What effort will you offer the forge today?",
      "How will you steel yourself for the path?",
      "How will you rise to meet your calling today?"
    ];
    const today = new Date();
    const dayIndex = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    return phrases[dayIndex % phrases.length];
  };

  // Check if recovery is unlocked (example: 3+ active days this week)
  const weeklyWorkouts = stats.weeklyCount || 0;
  const isRecoveryUnlocked = weeklyWorkouts >= 3;

  const workoutOptions: WorkoutOption[] = [
    {
      id: 'hero-call',
      title: 'The Hero\'s Call',
      subtitle: 'A daily, all-around challenge—bodyweight and grit.',
      description: 'The forge is hot. Step into it.',
      icon: Swords,
      buttonText: 'Answer the Call'
    },
    {
      id: 'strength',
      title: 'Strength Trial',
      subtitle: 'Focused feats of power and control.',
      description: 'Test your sinew, and earn the right to bear the iron.',
      icon: Shield,
      buttonText: 'Begin Strength Trial'
    },
    {
      id: 'endurance',
      title: 'Endurance March',
      subtitle: 'Runs, rucks, and relentless motion.',
      description: 'Prove you can endure, not just prevail.',
      icon: Zap,
      buttonText: 'Start Endurance March'
    },
    {
      id: 'recovery',
      title: 'Recovery & Ritual',
      subtitle: 'Active recovery, mobility, or reflection.',
      description: 'Even the gods must rest before the next battle.',
      icon: Leaf,
      buttonText: 'Enter the Ritual',
      isLocked: !isRecoveryUnlocked,
      lockReason: `Complete ${3 - weeklyWorkouts} more active days this week to unlock`
    }
  ];

  const handlePathSelection = (path: WorkoutPath) => {
    switch (path) {
      case 'hero-call':
        setSelectedPath('hero-call');
        break;
      case 'strength':
        navigate('/workout/new');
        break;
      case 'endurance':
        navigate('/run');
        break;
      case 'recovery':
        setSelectedPath('recovery');
        break;
    }
  };

  if (selectedPath === 'hero-call') {
    return <HeroCall />;
  }

  if (selectedPath === 'recovery') {
    return <MobilityRoutine onBack={() => setSelectedPath(null)} />;
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-primary">{getDailyPhrase()}</h1>
          <div className="space-y-2">
            <p className="text-lg text-muted-foreground">
              Each dawn brings a choice:
            </p>
            <p className="text-muted-foreground italic">
              To remain unchanged, or to rise anew.
            </p>
          </div>
        </div>

        <div className="border-t border-dashed border-muted-foreground/30 pt-6">
          <h2 className="text-xl font-semibold text-center mb-6">Choose Your Path:</h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            {workoutOptions.map((option) => {
              const IconComponent = option.icon;
              const isLocked = option.isLocked;
              
              return (
                <Card 
                  key={option.id}
                  className={`transition-all duration-200 cursor-pointer border-2 ${
                    isLocked 
                      ? 'border-muted bg-muted/10 opacity-60' 
                      : 'border-border hover:border-primary hover:shadow-md hover:scale-[1.02]'
                  }`}
                  onClick={() => !isLocked && handlePathSelection(option.id)}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">
                            {option.title}
                          </h3>
                          {isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {option.subtitle}
                        </p>
                      </div>
                      <IconComponent className={`h-6 w-6 ${isLocked ? 'text-muted-foreground' : 'text-primary'}`} />
                    </div>
                    
                    <div className="space-y-3">
                      <p className={`text-sm font-medium italic ${isLocked ? 'text-muted-foreground' : 'text-foreground'}`}>
                        "{option.description}"
                      </p>
                      
                      {isLocked ? (
                        <div className="space-y-2">
                          <Badge variant="outline" className="w-full justify-center text-xs">
                            <Lock className="h-3 w-3 mr-1" />
                            Locked
                          </Badge>
                          <p className="text-xs text-muted-foreground text-center">
                            {option.lockReason}
                          </p>
                        </div>
                      ) : (
                        <Button 
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePathSelection(option.id);
                          }}
                        >
                          {option.buttonText}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-dashed border-muted-foreground/30 pt-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Choose your proving ground.
            </p>
            <p className="text-xs text-muted-foreground italic">
              "The day awaits. What will you forge?"
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};