
import { useState, useEffect } from 'react';

const ONBOARDING_COMPLETED_KEY = 'ragnarok-fit-onboarding-completed';

export const useOnboarding = () => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    // Add a small delay to ensure localStorage is ready
    const checkOnboarding = () => {
      try {
        const completed = localStorage.getItem(ONBOARDING_COMPLETED_KEY);
        console.log('Onboarding check:', { completed, key: ONBOARDING_COMPLETED_KEY });
        
        // If the key doesn't exist or is not 'true', show onboarding
        const shouldShowOnboarding = completed !== 'true';
        setHasCompletedOnboarding(!shouldShowOnboarding);
        
        console.log('Should show onboarding:', shouldShowOnboarding);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // If there's an error, default to showing onboarding
        setHasCompletedOnboarding(false);
      }
    };

    // Check immediately and also after a small delay
    checkOnboarding();
    const timeoutId = setTimeout(checkOnboarding, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  const completeOnboarding = () => {
    try {
      localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
      setHasCompletedOnboarding(true);
      console.log('Onboarding completed and saved to localStorage');
    } catch (error) {
      console.error('Error saving onboarding completion:', error);
    }
  };

  const resetOnboarding = () => {
    try {
      localStorage.removeItem(ONBOARDING_COMPLETED_KEY);
      setHasCompletedOnboarding(false);
      console.log('Onboarding reset');
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  };

  return {
    hasCompletedOnboarding,
    completeOnboarding,
    resetOnboarding,
  };
};
