import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Flame, Sparkles, Zap } from 'lucide-react';
import { useForgeData } from '@/hooks/useForgeData';

interface ForgeCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  workoutName: string;
  workoutDuration: string;
}

export const ForgeCelebration = ({ 
  isOpen, 
  onClose, 
  workoutName, 
  workoutDuration 
}: ForgeCelebrationProps) => {
  const [showRune, setShowRune] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const { forgeProgress, currentQuote } = useForgeData();

  useEffect(() => {
    if (isOpen) {
      // Reset states
      setShowRune(false);
      setShowMessage(false);
      setShowProgress(false);
      
      // Animate sequence
      const timer1 = setTimeout(() => setShowRune(true), 300);
      const timer2 = setTimeout(() => setShowMessage(true), 800);
      const timer3 = setTimeout(() => setShowProgress(true), 1300);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isOpen]);

  const encouragingMessages = [
    "The forge burns brighter with your dedication.",
    "Another step forged in the fires of discipline.",
    "Your commitment shapes the steel of your spirit.",
    "The anvil of effort rings with your progress.",
    "Each workout is a hammer blow upon greatness.",
    "The flames of consistency forge legends."
  ];

  const randomMessage = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-card border-border p-0 overflow-hidden">
        <div className="relative p-8 text-center space-y-6 bg-gradient-to-b from-card to-card/80">
          {/* Animated Rune */}
          <div className="relative mx-auto">
            <div className={cn(
              "w-24 h-24 rounded-full border-4 border-primary/30 flex items-center justify-center transition-all duration-1000 ease-out",
              showRune ? "scale-100 opacity-100 border-primary bg-primary/10" : "scale-75 opacity-0"
            )}>
              <Flame className={cn(
                "h-12 w-12 transition-all duration-1000",
                showRune ? "text-primary animate-pulse" : "text-muted-foreground"
              )} />
            </div>
            
            {/* Sparkle effects */}
            {showRune && (
              <>
                <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-500 animate-bounce" style={{animationDelay: '0s'}} />
                <Zap className="absolute -bottom-2 -left-2 h-5 w-5 text-primary animate-bounce" style={{animationDelay: '0.5s'}} />
                <Sparkles className="absolute top-1/2 -right-4 h-4 w-4 text-yellow-400 animate-bounce" style={{animationDelay: '1s'}} />
              </>
            )}
          </div>

          {/* Victory Message */}
          <div className={cn(
            "space-y-3 transition-all duration-700 transform",
            showMessage ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}>
            <h2 className="text-2xl font-bold text-primary">The Forge Remembers</h2>
            <p className="text-muted-foreground text-lg">
              {randomMessage}
            </p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><span className="font-medium">Workout:</span> {workoutName}</p>
              <p><span className="font-medium">Duration:</span> {workoutDuration}</p>
            </div>
          </div>

          {/* Progress Update */}
          <div className={cn(
            "space-y-3 transition-all duration-700 transform",
            showProgress ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Forge Progress</span>
                <span className="font-medium text-primary">{forgeProgress.currentTitle}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${forgeProgress.progressPercentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground italic">
                "{currentQuote}"
              </p>
            </div>
          </div>

          {/* Continue Button */}
          <div className={cn(
            "transition-all duration-500",
            showProgress ? "opacity-100" : "opacity-0"
          )}>
            <Button 
              onClick={onClose}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Continue Your Journey
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};