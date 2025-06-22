
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, X, Axe, Swords, Flame } from 'lucide-react';

interface HeroCallOnboardingProps {
  onDismiss: () => void;
  onStartChallenge: () => void;
}

const HeroCallOnboarding = ({ onDismiss, onStartChallenge }: HeroCallOnboardingProps) => {
  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <Shield className="h-8 w-8 text-amber-600 mt-1" />
          <div className="flex-1 space-y-4">
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-amber-900 dark:text-amber-100">
                🛡️ Hero's Call
              </h2>
              
              <div className="space-y-2 text-amber-800 dark:text-amber-200">
                <p className="font-medium italic">
                  "You were not made to drift. You were made to forge yourself."
                </p>
                
                <p>Every morning, the gods issue a challenge. They call it the Hero's Call.</p>
                <p>It is not meant to break you. It is meant to build you.</p>
              </div>

              <div className="bg-amber-100 dark:bg-amber-900/30 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold text-amber-900 dark:text-amber-100">⚒️ Your task:</h3>
                <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
                  <li>• Complete the daily challenge</li>
                  <li>• Choose your difficulty: <Axe className="inline h-4 w-4 mx-1" />Easy, <Swords className="inline h-4 w-4 mx-1" />Medium, <Flame className="inline h-4 w-4 mx-1" />Hard</li>
                  <li>• Return tomorrow</li>
                  <li>• Become the man your ancestors will toast in Valhalla</li>
                </ul>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={onStartChallenge}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                Accept the Challenge
              </Button>
              <Button
                variant="outline"
                onClick={onDismiss}
                className="border-amber-300 text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-200"
              >
                Maybe Later
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroCallOnboarding;
