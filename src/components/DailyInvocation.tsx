import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Lock, ChevronDown } from 'lucide-react';
import { ImageIcon } from './ImageIcon';
import { HeroCall } from './HeroCall';
import { MobilityRoutine } from './recovery/MobilityRoutine';
import { useHeroCallData } from '@/hooks/useHeroCallData';
import { useNavigate } from 'react-router-dom';
import heroIcon from '@/assets/hero-icon.png';
import hammerIcon from '@/assets/hammer-icon.png';
import recoveryIcon from '@/assets/recovery-icon.png';
import enduranceIcon from '@/assets/endurance-icon.png';

type WorkoutPath = 'hero-call' | 'strength' | 'endurance' | 'recovery';

interface WorkoutOption {
  id: WorkoutPath;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
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
      icon: heroIcon,
      buttonText: 'Answer the Hero\'s Call'
    },
    {
      id: 'strength',
      title: 'Strength Trial',
      subtitle: 'Focused feats of power and control.',
      description: 'Test your sinew, and earn the right to bear the iron.',
      icon: hammerIcon,
      buttonText: 'Begin Trial of Strength'
    },
    {
      id: 'endurance',
      title: 'Endurance March',
      subtitle: 'Runs, rucks, and relentless motion.',
      description: 'Prove you can endure, not just prevail.',
      icon: enduranceIcon,
      buttonText: 'Endure'
    },
    {
      id: 'recovery',
      title: 'Recovery & Ritual',
      subtitle: 'Active recovery, mobility, or reflection.',
      description: 'Even the gods must rest before the next battle.',
      icon: recoveryIcon,
      buttonText: 'Recovery Ritual',
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
      <CardContent className="p-4 space-y-4">
        {/* Compact Header */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-primary">{getDailyPhrase()}</h2>
          <p className="text-sm text-muted-foreground italic">
            To remain unchanged, or to rise anew.
          </p>
        </div>

        {/* Collapsible Path Options */}
        <div className="space-y-2">
        {workoutOptions.map((option) => {
            const IconComponent = option.icon;
            const isLocked = option.isLocked;
            const isCustomIcon = typeof IconComponent === 'string';
            
            return (
              <Collapsible key={option.id}>
                <Card className={`${isLocked ? 'opacity-60' : ''}`}>
                  <CardContent className="p-0">
                    <div className="flex items-center gap-2">
                      <Button
                        variant={isLocked ? "outline" : "default"}
                        className="flex-1 justify-start gap-3 h-auto py-3 px-4"
                        onClick={() => !isLocked && handlePathSelection(option.id)}
                        disabled={isLocked}
                      >
                        {isCustomIcon ? (
                          <ImageIcon src={IconComponent} alt={option.title} className="h-7 w-7" />
                        ) : (
                          <IconComponent className="h-7 w-7" />
                        )}
                        <span className="font-semibold">{option.buttonText}</span>
                        {isLocked && <Lock className="h-4 w-4 ml-auto" />}
                      </Button>
                      
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    
                    <CollapsibleContent>
                      <div className="px-4 pb-3 pt-1 space-y-2 border-t">
                        <p className="text-sm font-medium">{option.subtitle}</p>
                        <p className="text-sm text-muted-foreground italic">
                          "{option.description}"
                        </p>
                        {isLocked && (
                          <Badge variant="outline" className="text-xs">
                            <Lock className="h-3 w-3 mr-1" />
                            {option.lockReason}
                          </Badge>
                        )}
                      </div>
                    </CollapsibleContent>
                  </CardContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};