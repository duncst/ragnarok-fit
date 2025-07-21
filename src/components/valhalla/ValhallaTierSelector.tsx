import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Target, Trophy, Crown, Clock, ArrowLeft, Swords } from 'lucide-react';
import { cn } from '@/lib/utils';

type ValhallaTier = 'Adept' | 'Warrior' | 'Berserker';

interface ValhallaTierSelectorProps {
  workoutName: string;
  workoutIcon: string;
  godName: string;
  description: string;
  theme: string;
  format: string;
  tierThresholds: {
    berserker: number;
    warrior: number;
  };
  exercises: any[];
  selectedTier: ValhallaTier;
  onTierChange: (tier: ValhallaTier) => void;
  onStartWorkout: () => void;
  onGoBack: () => void;
}

const tierInfo = {
  Adept: {
    icon: Target,
    color: 'text-slate-600',
    bgColor: 'bg-slate-50 border-slate-200',
    title: 'Adept',
    description: 'Learn the ways. Every master was once a beginner.',
  },
  Warrior: {
    icon: Trophy,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
    title: 'Warrior',
    description: 'Proven in battle. You know the path.',
  },
  Berserker: {
    icon: Crown,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 border-amber-200',
    title: 'Berserker',
    description: 'Unleash the beast. Accept no limits.',
  },
};

export const ValhallaTierSelector: React.FC<ValhallaTierSelectorProps> = ({
  workoutName,
  workoutIcon,
  godName,
  description,
  theme,
  format,
  tierThresholds,
  exercises,
  selectedTier,
  onTierChange,
  onStartWorkout,
  onGoBack,
}) => {
  const getTierTimeRange = (tier: ValhallaTier) => {
    switch (tier) {
      case 'Berserker':
        return `≤${tierThresholds.berserker} min`;
      case 'Warrior':
        return `${tierThresholds.berserker + 1}-${tierThresholds.warrior} min`;
      case 'Adept':
        return `${tierThresholds.warrior + 1}+ min`;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onGoBack}
          className="hover:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{workoutIcon}</span>
          <div>
            <h1 className="text-2xl font-bold text-primary">{workoutName}</h1>
            <p className="text-lg text-muted-foreground">{godName}</p>
          </div>
        </div>
      </div>

      {/* Workout Info */}
      <Card className="mb-6 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Swords className="h-5 w-5" />
            Challenge Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-primary/30 text-primary">
              {format}
            </Badge>
            <p className="text-sm text-muted-foreground italic">{description}</p>
          </div>
          
          <div className="space-y-2">
            {exercises.map((exercise, index) => (
              <div key={index} className="flex justify-between text-sm py-1">
                <span>{exercise.name}</span>
                <span className="text-muted-foreground">
                  {exercise.suggestedReps}{exercise.type === 'time' ? ' min' : exercise.type === 'distance' ? 'm' : ''}
                </span>
              </div>
            ))}
          </div>
          
          <div className="pt-2 border-t border-border">
            <p className="text-sm italic text-muted-foreground">{theme}</p>
          </div>
        </CardContent>
      </Card>

      {/* Tier Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Choose Your Path
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Select your target tier. This sets your goal completion time.
          </p>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={selectedTier} 
            onValueChange={(value) => onTierChange(value as ValhallaTier)}
            className="space-y-3"
          >
            {(Object.keys(tierInfo) as ValhallaTier[]).map((tier) => {
              const TierIcon = tierInfo[tier].icon;
              const isSelected = selectedTier === tier;
              
              return (
                <div key={tier} className="relative">
                  <Label 
                    htmlFor={tier}
                    className={cn(
                      "flex items-center space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                      isSelected 
                        ? `${tierInfo[tier].bgColor} border-current ${tierInfo[tier].color}` 
                        : "border-muted hover:border-muted-foreground/50"
                    )}
                  >
                    <RadioGroupItem 
                      value={tier} 
                      id={tier}
                      className={cn(
                        "w-5 h-5",
                        isSelected && tierInfo[tier].color
                      )}
                    />
                    <TierIcon className={cn("h-6 w-6", tierInfo[tier].color)} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={cn("font-bold text-lg", tierInfo[tier].color)}>
                            {tierInfo[tier].title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {tierInfo[tier].description}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono text-sm">
                              {getTierTimeRange(tier)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Start Button */}
      <Button 
        onClick={onStartWorkout}
        className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90"
        size="lg"
      >
        Begin {selectedTier} Challenge
      </Button>
    </div>
  );
};