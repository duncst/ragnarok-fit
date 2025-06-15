
import React, { useState, useEffect } from 'react';
import { toast as sonnerToast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Timer } from 'lucide-react';

interface RestTimerToastProps {
  duration: number;
  toastId: string | number;
}

export const RestTimerToast = ({ duration, toastId }: RestTimerToastProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      sonnerToast.dismiss(toastId);
      // You could play a sound here in the future!
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, toastId]);

  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-2">
        <Timer className="h-5 w-5 text-primary" />
        <p className="font-semibold">Resting...</p>
        <p className="ml-auto text-lg font-bold">{timeLeft}s</p>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex gap-2 justify-end">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setTimeLeft((prev) => prev + 15)}
        >
          +15s
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => sonnerToast.dismiss(toastId)}
        >
          Skip
        </Button>
      </div>
    </div>
  );
};
