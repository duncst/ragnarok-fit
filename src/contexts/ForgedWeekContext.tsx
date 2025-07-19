import React, { createContext, useContext, useCallback } from 'react';
import { useForgedWeekCelebration } from '@/hooks/useForgedWeekCelebration';

interface ForgedWeekContextType {
  checkForNewForgedWeek: () => Promise<void>;
}

const ForgedWeekContext = createContext<ForgedWeekContextType | undefined>(undefined);

export const ForgedWeekProvider = ({ children }: { children: React.ReactNode }) => {
  const { checkForNewForgedWeek } = useForgedWeekCelebration();

  const triggerCheck = useCallback(async () => {
    // Small delay to ensure database operations are complete
    setTimeout(() => {
      checkForNewForgedWeek();
    }, 500);
  }, [checkForNewForgedWeek]);

  return (
    <ForgedWeekContext.Provider value={{ checkForNewForgedWeek: triggerCheck }}>
      {children}
    </ForgedWeekContext.Provider>
  );
};

export const useForgedWeekCheck = () => {
  const context = useContext(ForgedWeekContext);
  if (context === undefined) {
    // Return a no-op function if not within provider
    return { checkForNewForgedWeek: async () => {} };
  }
  return context;
};