
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface HeroCallCompletionViewProps {
  workoutName: string;
  formattedDuration: string;
  onMarkComplete: () => void;
  onExit: () => void;
  isLoading: boolean;
}

export const HeroCallCompletionView = ({
  workoutName,
  formattedDuration,
  onMarkComplete,
  onExit,
  isLoading
}: HeroCallCompletionViewProps) => {
  return (
    <Card className="w-full">
      <CardContent className="p-6 text-center space-y-4">
        <div className="space-y-2">
          <Check className="h-12 w-12 text-green-600 mx-auto" />
          <h2 className="text-2xl font-bold text-primary">The Deed is Done.</h2>
          <p className="text-muted-foreground">
            Today, you answered the call. Few do. Fewer return.
          </p>
          <p className="text-sm text-muted-foreground font-medium">
            You met the forge head-on. The embers remember.
          </p>
          <p className="text-sm text-muted-foreground">
            Duration: {formattedDuration}
          </p>
          <p className="text-sm text-primary font-medium mt-2">
            Return tomorrow. The saga continues.
          </p>
        </div>
        
        <div className="flex gap-2 justify-center">
          <Button 
            onClick={onMarkComplete} 
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <Check className="h-4 w-4" />
            {isLoading ? 'Logging Victory...' : 'Log This Victory'}
          </Button>
          <Button variant="outline" onClick={onExit}>
            Return to Home
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
