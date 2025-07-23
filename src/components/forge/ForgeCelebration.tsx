import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useForgeData } from '@/hooks/useForgeData';

interface ForgeCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  activityName: string;
  activityDuration: string;
  activityType?: 'workout' | 'endurance' | 'challenge';
}

// Weekday runes mapping
const WEEKDAY_RUNES = {
  0: 'ᛊ', // Sunday - Sowilo (Sun)
  1: 'ᛗ', // Monday - Mannaz (Moon/Man)
  2: 'ᛏ', // Tuesday - Tiwaz (Tyr/War)
  3: 'ᚹ', // Wednesday - Wunjo (Odin/Wisdom)
  4: 'ᚨ', // Thursday - Ansuz (Thor)
  5: 'ᚠ', // Friday - Fehu (Freya/Prosperity)
  6: 'ᛋ', // Saturday - Sowilo (Saturn/Structure)
};

const ROTATING_QUOTES = [
  "You struck the steel again. You grow sharper with each blow.",
  "The fire remembers. So does your future self.",
  "Discipline leaves marks the eye can't see.",
  "Every rep, a rune. Every breath, a vow.",
  "The forge knows no shortcuts, only dedication.",
  "Your will is the hammer. Your body is the anvil."
];

export const ForgeCelebration = ({ 
  isOpen, 
  onClose, 
  activityName, 
  activityDuration,
  activityType = 'workout'
}: ForgeCelebrationProps) => {
  const [showRune, setShowRune] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const { forgeProgress } = useForgeData();

  useEffect(() => {
    if (isOpen) {
      // Reset states
      setShowRune(false);
      setShowMessage(false);
      setShowProgress(false);
      
      // Animate sequence
      const timer1 = setTimeout(() => setShowRune(true), 300);
      const timer2 = setTimeout(() => setShowMessage(true), 1000);
      const timer3 = setTimeout(() => setShowProgress(true), 1500);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isOpen]);

  // Get today's rune based on current day of week
  const currentDayRune = WEEKDAY_RUNES[new Date().getDay() as keyof typeof WEEKDAY_RUNES];
  
  // Get rotating quote based on current week
  const currentQuote = ROTATING_QUOTES[forgeProgress.currentWeek % ROTATING_QUOTES.length];
  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-card border-border p-0 overflow-hidden">
        <div className="relative p-6 text-center space-y-6 bg-gradient-to-b from-card to-card/80">
          {/* Large Animated Rune */}
          <div className="relative mx-auto flex items-center justify-center">
            <div className={cn(
              "text-8xl font-bold transition-all duration-3000 ease-out transform",
              showRune 
                ? "text-red-500 drop-shadow-[0_0_16px_rgba(239,68,68,0.8)] animate-pulse scale-100 opacity-100" 
                : "text-muted-foreground/30 scale-75 opacity-40"
            )}>
              {currentDayRune}
            </div>
          </div>

          {/* Victory Message */}
          <div className={cn(
            "space-y-4 transition-all duration-700 transform",
            showMessage ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}>
            <h1 className="text-xl font-bold text-foreground">You have answered the call.</h1>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                {activityType === 'endurance' ? 'Endurance Challenge Completed:' : 'Challenge Completed:'}
              </h3>
              <p className="text-primary font-medium">{activityName}</p>
              <p className="text-muted-foreground">Duration: {activityDuration}</p>
            </div>
          </div>

          {/* Progress Section */}
          <div className={cn(
            "space-y-4 transition-all duration-700 transform",
            showProgress ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Your Flame Grows</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Forge Rank:</span>
                  <span className="font-bold text-primary">{forgeProgress.currentTitle}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress to Next Title:</span>
                    <span className="text-primary font-medium">{forgeProgress.progressPercentage}%</span>
                  </div>
                  <Progress 
                    value={forgeProgress.progressPercentage} 
                    className="h-3 bg-muted"
                  />
                </div>
              </div>
              <p className="text-muted-foreground italic text-sm">
                "{currentQuote}"
              </p>
            </div>

            {/* What You Forged Today */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-foreground">What You Forged Today:</h4>
              <ul className="text-left space-y-1 text-muted-foreground">
                <li>• Your Willpower</li>
                <li>• Your Body</li>
                <li>• Momentum</li>
              </ul>
            </div>
          </div>

          {/* Continue Button */}
          <div className={cn(
            "transition-all duration-500",
            showProgress ? "opacity-100" : "opacity-0"
          )}>
            <Button 
              onClick={onClose}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              Continue Your Journey
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};