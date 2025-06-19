
import { useState, useEffect } from 'react';

const ONBOARDING_COMPLETED_KEY = 'ragnarok-fit-onboarding-completed';

export const useOnboarding = () => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    const completed = localStorage.getItem(ONBOARDING_COMPLETED_KEY);
    setHasCompletedOnboarding(completed === 'true');
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    setHasCompletedOnboarding(true);
  };

  return {
    hasCompletedOnboarding,
    completeOnboarding,
  };
};
