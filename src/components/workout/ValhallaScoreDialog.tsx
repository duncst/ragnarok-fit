
import React from 'react';
import { EnhancedValhallaScoreDialog } from '../valhalla/EnhancedValhallaScoreDialog';

interface ValhallaScoreDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workoutName: string;
  workoutDuration?: number;
}

export const ValhallaScoreDialog = (props: ValhallaScoreDialogProps) => {
  return <EnhancedValhallaScoreDialog {...props} />;
};
