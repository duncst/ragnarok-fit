import React, { createContext, useContext, useCallback } from 'react';
import { useForgedWeekCelebration } from '@/hooks/useForgedWeekCelebration';

interface ForgedWeekContextType {
  showCelebration: boolean;
  newlyForgedWeek: number;
  checkForNewForgedWeek: () => Promise<void>;
  closeCelebration: () => void;
}

const ForgedWeekContext = createContext<ForgedWeekContextType | undefined>(undefined);

export const ForgedWeekProvider = ({ children }: { children: React.ReactNode }) => {
  const { showCelebration, newlyForgedWeek, checkForNewForgedWeek, closeCelebration } = useForgedWeekCelebration();

  const triggerCheck = useCallback(async () => {
    // Small delay to ensure database operations are complete
    setTimeout(() => {
      checkForNewForgedWeek();
    }, 500);
  }, [checkForNewForgedWeek]);

  return (
    <ForgedWeekContext.Provider
      value={{ showCelebration, newlyForgedWeek, checkForNewForgedWeek: triggerCheck, closeCelebration }}
    >
      {children}
    </ForgedWeekContext.Provider>
  );
};

export const useForgedWeekCheck = () => {
  const context = useContext(ForgedWeekContext);
  if (context === undefined) {
    // Return no-op defaults if not within provider
    return {
      showCelebration: false,
      newlyForgedWeek: 0,
      checkForNewForgedWeek: async () => {},
      closeCelebration: () => {},
    };
  }
  return context;
};
