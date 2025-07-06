
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
          <h2 className="text-2xl font-bold text-primary">Challenge Complete!</h2>
          <p className="text-muted-foreground">
            You've completed today's Hero's Call: <strong>{workoutName}</strong>
          </p>
          <p className="text-sm text-muted-foreground">
            Duration: {formattedDuration}
          </p>
        </div>
        
        <div className="flex gap-2 justify-center">
          <Button 
            onClick={onMarkComplete} 
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <Check className="h-4 w-4" />
            {isLoading ? 'Saving...' : 'Mark as Complete'}
          </Button>
          <Button variant="outline" onClick={onExit}>
            Exit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
