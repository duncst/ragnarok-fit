
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

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
  const [scoreDialogWorkout, setScoreDialogWorkout] = useState<ValhallaWorkout | null>(null);
  const location = useLocation();

  const showScoreDialog = (workout: ValhallaWorkout) => {
    setScoreDialogWorkout(workout);
  };

  const hideScoreDialog = () => {
    setScoreDialogWorkout(null);
  };

  // Check if we're finishing a Valhalla workout by looking at the location state
  useEffect(() => {
    if (location.state?.completedValhallaWorkout) {
      setScoreDialogWorkout(location.state.completedValhallaWorkout);
      
      // Clear the state to prevent showing the dialog again on refresh
      window.history.replaceState(null, '', location.pathname);
    }
  }, [location.state]);

  return {
    scoreDialogWorkout,
    showScoreDialog,
    hideScoreDialog,
  };
};
