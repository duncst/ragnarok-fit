import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useForgeData } from '@/hooks/useForgeData';

interface ForgedWeekCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  weekNumber: number;
}

// Five runes representing the days of a forged week
const FORGE_WEEK_RUNES = ['ᛗ', 'ᛏ', 'ᚹ', 'ᚨ', 'ᚠ'];

const FORGE_WEEK_QUOTES = [
  "Five flames united. One week forged in the fires of discipline.",
  "Each rune a day conquered. Each day a step toward legend.",
  "The forge remembers your dedication. Five days of unwavering will.",
  "In the crucible of consistency, true strength is born.",
  "Five strikes upon the anvil. Your legend grows stronger.",
];

export const ForgedWeekCelebration = ({ 
  isOpen, 
  onClose, 
  weekNumber 
}: ForgedWeekCelebrationProps) => {
  const [showTitle, setShowTitle] = useState(false);
  const [litRunes, setLitRunes] = useState<number[]>([]);
  const [showMessage, setShowMessage] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const { forgeProgress } = useForgeData();

  useEffect(() => {
    if (isOpen) {
      // Reset states
      setShowTitle(false);
      setLitRunes([]);
      setShowMessage(false);
      setShowProgress(false);
      
      // Animate sequence
      const timer1 = setTimeout(() => setShowTitle(true), 300);
      
      // Light up runes one by one
      FORGE_WEEK_RUNES.forEach((_, index) => {
        setTimeout(() => {
          setLitRunes(prev => [...prev, index]);
        }, 800 + index * 400);
      });
      
      const timer2 = setTimeout(() => setShowMessage(true), 3000);
      const timer3 = setTimeout(() => setShowProgress(true), 3500);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isOpen]);

  const currentQuote = FORGE_WEEK_QUOTES[weekNumber % FORGE_WEEK_QUOTES.length];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto bg-card border-border p-0 overflow-hidden">
        <div className="relative p-6 text-center space-y-6 bg-gradient-to-b from-card to-card/80">
          {/* Title */}
          <div className={cn(
            "transition-all duration-1000 transform",
            showTitle ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}>
            <h1 className="text-2xl font-bold text-primary mb-2">WEEK FORGED</h1>
            <p className="text-lg text-muted-foreground">Week #{weekNumber}</p>
          </div>

          {/* Five Runes Lighting Up */}
          <div className="flex justify-center items-center gap-4 py-8">
            {FORGE_WEEK_RUNES.map((rune, index) => (
              <div
                key={index}
                className={cn(
                  "text-6xl font-bold transition-all duration-1000 transform",
                  litRunes.includes(index)
                    ? "text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.9)] scale-110 opacity-100" 
                    : "text-muted-foreground/20 scale-75 opacity-30"
                )}
                style={{
                  transitionDelay: litRunes.includes(index) ? '0ms' : '0ms'
                }}
              >
                {rune}
              </div>
            ))}
          </div>

          {/* Message */}
          <div className={cn(
            "space-y-4 transition-all duration-700 transform",
            showMessage ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}>
            <h2 className="text-xl font-bold text-foreground">
              The Forge Acknowledges Your Dedication
            </h2>
            
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-foreground">This Week You Forged:</h3>
              <ul className="text-left space-y-1 text-muted-foreground">
                <li>• Five days of unwavering discipline</li>
                <li>• Your mental fortitude</li>
                <li>• A stronger version of yourself</li>
                <li>• Progress toward your legend</li>
              </ul>
            </div>
          </div>

          {/* Progress Section */}
          <div className={cn(
            "space-y-4 transition-all duration-700 transform",
            showProgress ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}>
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Current Rank:</span>
                  <span className="font-bold text-primary">{forgeProgress.currentTitle}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Weeks Forged:</span>
                  <span className="font-bold text-primary">{weekNumber}</span>
                </div>
              </div>
              
              <p className="text-muted-foreground italic text-sm border-t pt-3">
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
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              Continue Forging Your Legend
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};