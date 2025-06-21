
import { useState, useEffect, useRef } from 'react';

export const useWorkoutTimer = () => {
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [totalDuration, setTotalDuration] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startWorkout = () => {
    if (!isActive) {
      setIsActive(true);
      if (!startTime) {
        setStartTime(new Date());
      }
    }
  };

  const pauseWorkout = () => {
    setIsActive(false);
  };

  const toggleWorkout = () => {
    if (isActive) {
      pauseWorkout();
    } else {
      startWorkout();
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setStartTime(null);
    setTotalDuration(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (isActive && startTime) {
      intervalRef.current = setInterval(() => {
        setTotalDuration(Date.now() - startTime.getTime());
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
  }, [isActive, startTime]);

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
    }
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return {
    isActive,
    startTime,
    totalDuration,
    formattedDuration: formatDuration(totalDuration),
    toggleWorkout,
    startWorkout,
    pauseWorkout,
    resetTimer,
  };
};
