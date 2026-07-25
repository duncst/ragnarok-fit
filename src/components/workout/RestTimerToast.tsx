
import React, { useState, useEffect } from 'react';
import { toast as sonnerToast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Timer, X } from 'lucide-react';

interface RestTimerToastProps {
  duration: number;
  onDismiss: () => void;
}

export const RestTimerToast = ({ duration, onDismiss }: RestTimerToastProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onDismiss();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onDismiss]);

  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="fixed bottom-16 left-0 right-0 z-50 mx-auto max-w-md">
      <div className="mx-4 bg-background border border-border rounded-t-lg shadow-lg">
        <div className="p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-primary" />
              <p className="font-semibold text-sm">Resting...</p>
              <p className="text-lg font-bold">{timeLeft}s</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDismiss}
              className="h-6 w-6"
              aria-label="Dismiss rest timer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Progress value={progress} className="h-1.5" />
          <div className="flex gap-2 justify-end">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setTimeLeft((prev) => prev + 15)}
              className="h-7 text-xs"
            >
              +15s
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={onDismiss}
              className="h-7 text-xs"
            >
              Skip
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
