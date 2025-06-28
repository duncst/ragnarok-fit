
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RuneDisplay } from './RuneDisplay';
import { cn } from '@/lib/utils';

interface ValhallaCompletionCeremonyProps {
  isOpen: boolean;
  onClose: () => void;
  challengeName: string;
  tier: 'Adept' | 'Warrior' | 'Berserker';
  runeName: string;
  completionTime: number;
  isNewRune: boolean;
  isTierUpgrade: boolean;
}

const tierMessages = {
  Adept: {
    title: "You Have Entered the Forge",
    message: "You faced the challenge and did not yield. The path of strength begins with a single step.",
    suffix: "You are Adept of the Forge."
  },
  Warrior: {
    title: "Steel Has Been Forged",
    message: "Your sweat and determination have shaped something greater. You have proven your resolve.",
    suffix: "You are named Warrior."
  },
  Berserker: {
    title: "The Challenge Falls Before You",
    message: "Fire and fury, discipline and power. You have conquered what others fear to attempt.",
    suffix: "You are Berserker. Wear this Rune with pride."
  }
};

export const ValhallaCompletionCeremony = ({
  isOpen,
  onClose,
  challengeName,
  tier,
  runeName,
  completionTime,
  isNewRune,
  isTierUpgrade,
}: ValhallaCompletionCeremonyProps) => {
  const [showRune, setShowRune] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowRune(false);
      setShowMessage(false);
      
      const timer1 = setTimeout(() => setShowRune(true), 500);
      const timer2 = setTimeout(() => setShowMessage(true), 1000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isOpen]);

  const ceremonyType = isNewRune ? 'NEW_RUNE' : isTierUpgrade ? 'TIER_UPGRADE' : 'COMPLETION';
  const tierMessage = tierMessages[tier];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-600">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-amber-400 mb-4">
            ⚔️ {tierMessage.title} ⚔️
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 text-center">
          <div className={cn(
            'flex justify-center transition-all duration-1000',
            showRune ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          )}>
            <RuneDisplay
              runeName={runeName}
              tier={tier}
              challengeName={challengeName}
              size="lg"
              className="transform"
            />
          </div>

          <div className={cn(
            'space-y-4 transition-all duration-1000 delay-500',
            showMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-amber-300">
                {challengeName}
              </h3>
              <p className="text-slate-300">
                Completed in {completionTime} minutes
              </p>
            </div>

            <div className="space-y-3 px-4">
              <p className="text-slate-200 leading-relaxed">
                {tierMessage.message}
              </p>
              <p className="text-amber-300 font-semibold text-lg">
                {tierMessage.suffix}
              </p>
            </div>

            {ceremonyType === 'NEW_RUNE' && (
              <div className="bg-amber-900/30 p-3 rounded-lg border border-amber-600/30">
                <p className="text-amber-200 text-sm">
                  <strong>{runeName}</strong> has been added to your collection!
                </p>
              </div>
            )}

            {ceremonyType === 'TIER_UPGRADE' && (
              <div className="bg-blue-900/30 p-3 rounded-lg border border-blue-600/30">
                <p className="text-blue-200 text-sm">
                  Your rune has been upgraded to <strong>{tier}</strong> tier!
                </p>
              </div>
            )}
          </div>

          <Button 
            onClick={onClose}
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-2"
          >
            Continue Your Journey
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
