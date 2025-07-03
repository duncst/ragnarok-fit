
import { useState, useEffect } from 'react';

const ONBOARDING_COMPLETED_KEY = 'ragnarok-fit-onboarding-completed';

export const useOnboarding = () => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    // Always set onboarding as completed to disable the modal
    setHasCompletedOnboarding(true);
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
