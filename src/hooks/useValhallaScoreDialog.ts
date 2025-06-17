
import { useState } from 'react';

interface ValhallaWorkout {
  id: string;
  name: string;
  godName: string;
  description: string;
  theme: string;
  icon: string;
  format: string;
  scoreInstructions: string;
}

export const useValhallaScoreDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState<ValhallaWorkout | null>(null);

  const openDialog = (workout: ValhallaWorkout) => {
    setCurrentWorkout(workout);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setCurrentWorkout(null);
  };

  return {
    isOpen,
    currentWorkout,
    openDialog,
    closeDialog,
  };
};
