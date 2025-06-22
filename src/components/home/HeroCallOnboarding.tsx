
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Swords, X, Axe, Flame } from 'lucide-react';

interface HeroCallOnboardingProps {
  onDismiss: () => void;
  onStartChallenge: () => void;
}

const HeroCallOnboarding = ({ onDismiss, onStartChallenge }: HeroCallOnboardingProps) => {
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border-primary/30">
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <Swords className="h-8 w-8 text-primary mt-1" />
          <div className="flex-1 space-y-4">
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">
                You were not made to drift. You were made to forge yourself.
              </h2>
              
              <div className="space-y-2 text-muted-foreground">
                <p>Every morning, the gods issue a challenge. They call it the Hero's Call.</p>
                <p>It is not meant to break you. It is meant to build you.</p>
              </div>

              <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold text-foreground">⚒️ Your task:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Choose your difficulty: <Axe className="inline h-4 w-4 mx-1" />Easy, <Swords className="inline h-4 w-4 mx-1" />Medium, <Flame className="inline h-4 w-4 mx-1" />Hard</li>
                  <li>• Complete the daily challenge</li>
                  <li>• Return tomorrow</li>
                  <li>• Become the man your ancestors will toast in Valhalla</li>
                </ul>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={onStartChallenge}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Accept the Challenge
              </Button>
              <Button
                variant="outline"
                onClick={onDismiss}
                className="border-primary/30 text-foreground hover:bg-primary/10"
              >
                Maybe Later
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-primary hover:bg-primary/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroCallOnboarding;
