import { useState, useCallback, useEffect, useRef } from 'react';

export const useRestTimer = (restDuration: number, isValhallaWorkout: boolean) => {
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restTimerDuration, setRestTimerDuration] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleSetCompletion = useCallback((isCompleted: boolean) => {
    if (isCompleted && !isValhallaWorkout) {
      setRestTimerDuration(restDuration);
      setShowRestTimer(true);
      setIsPaused(false);
    }
  }, [restDuration, isValhallaWorkout]);

  const handleTogglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const handleDismissRestTimer = useCallback(() => {
    setShowRestTimer(false);
    setRestTimerDuration(0);
    setIsPaused(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Countdown effect
  useEffect(() => {
    if (showRestTimer && restTimerDuration > 0 && !isPaused) {
      intervalRef.current = setInterval(() => {
        setRestTimerDuration(prev => {
          if (prev <= 1) {
            setShowRestTimer(false);
            setIsPaused(false);
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
  }, [showRestTimer, restTimerDuration, isPaused]);

  return {
    showRestTimer,
    restTimerDuration,
    isPaused,
    handleSetCompletion,
    handleTogglePause,
    handleDismissRestTimer,
  };
};