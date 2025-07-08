import { useState, useEffect } from 'react';

interface TrialWorkout {
  name: string;
  [key: string]: any;
}

export const useTrialWorkout = (setWorkoutName: (name: string) => void) => {
  const [trialWorkout, setTrialWorkout] = useState<TrialWorkout | null>(null);

  useEffect(() => {
    const storedTrialWorkout = localStorage.getItem('hero-call-trial-workout');
    if (storedTrialWorkout) {
      const parsedWorkout = JSON.parse(storedTrialWorkout);
      setTrialWorkout(parsedWorkout);
      setWorkoutName(parsedWorkout.name);
      // Clean up the stored workout
      localStorage.removeItem('hero-call-trial-workout');
    }
  }, [setWorkoutName]);

  const clearTrialWorkout = () => {
    setTrialWorkout(null);
  };

  return {
    trialWorkout,
    clearTrialWorkout,
  };
};