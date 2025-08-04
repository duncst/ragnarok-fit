import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ActiveWorkout {
  id: string;
  name: string;
  type: 'ritual' | 'hero_call' | 'simple' | 'valhalla';
  startTime: Date;
  returnPath: string;
  templateId?: string;
}

interface ActiveWorkoutContextType {
  activeWorkout: ActiveWorkout | null;
  setActiveWorkout: (workout: ActiveWorkout | null) => void;
  isWorkoutActive: boolean;
}

const ActiveWorkoutContext = createContext<ActiveWorkoutContextType | undefined>(undefined);

export const useActiveWorkout = () => {
  const context = useContext(ActiveWorkoutContext);
  if (context === undefined) {
    throw new Error('useActiveWorkout must be used within an ActiveWorkoutProvider');
  }
  return context;
};

interface ActiveWorkoutProviderProps {
  children: ReactNode;
}

export const ActiveWorkoutProvider: React.FC<ActiveWorkoutProviderProps> = ({ children }) => {
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout | null>(null);

  const value = {
    activeWorkout,
    setActiveWorkout,
    isWorkoutActive: activeWorkout !== null,
  };

  return (
    <ActiveWorkoutContext.Provider value={value}>
      {children}
    </ActiveWorkoutContext.Provider>
  );
};