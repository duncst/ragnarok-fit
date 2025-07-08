import { useState, useCallback } from 'react';

export const useRestTimer = (restDuration: number, isValhallaWorkout: boolean) => {
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restTimerDuration, setRestTimerDuration] = useState(0);

  const handleSetCompletion = useCallback((isCompleted: boolean) => {
    if (isCompleted && !isValhallaWorkout) {
      setRestTimerDuration(restDuration);
      setShowRestTimer(true);
    }
  }, [restDuration, isValhallaWorkout]);

  const handleDismissRestTimer = useCallback(() => {
    setShowRestTimer(false);
    setRestTimerDuration(0);
  }, []);

  return {
    showRestTimer,
    restTimerDuration,
    handleSetCompletion,
    handleDismissRestTimer,
  };
};