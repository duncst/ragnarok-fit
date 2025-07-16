import { useState, useCallback, useEffect, useRef } from 'react';

export const useRestTimer = (restDuration: number, isValhallaWorkout: boolean) => {
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restTimerDuration, setRestTimerDuration] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleSetCompletion = useCallback((isCompleted: boolean) => {
    if (isCompleted && !isValhallaWorkout) {
      setRestTimerDuration(restDuration);
      setShowRestTimer(true);
    }
  }, [restDuration, isValhallaWorkout]);

  const handleDismissRestTimer = useCallback(() => {
    setShowRestTimer(false);
    setRestTimerDuration(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Countdown effect
  useEffect(() => {
    if (showRestTimer && restTimerDuration > 0) {
      intervalRef.current = setInterval(() => {
        setRestTimerDuration(prev => {
          if (prev <= 1) {
            setShowRestTimer(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [showRestTimer, restTimerDuration]);

  return {
    showRestTimer,
    restTimerDuration,
    handleSetCompletion,
    handleDismissRestTimer,
  };
};