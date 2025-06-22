
import { useState, useEffect } from 'react';

const HERO_CALL_ONBOARDING_KEY = 'hero-call-onboarding-dismissed';

export const useHeroCallOnboarding = () => {
  const [showHeroCallOnboarding, setShowHeroCallOnboarding] = useState(false);

  useEffect(() => {
    const onboardingDismissed = localStorage.getItem(HERO_CALL_ONBOARDING_KEY);
    setShowHeroCallOnboarding(onboardingDismissed !== 'true');
  }, []);

  const dismissHeroCallOnboarding = () => {
    localStorage.setItem(HERO_CALL_ONBOARDING_KEY, 'true');
    setShowHeroCallOnboarding(false);
  };

  return {
    showHeroCallOnboarding,
    dismissHeroCallOnboarding,
  };
};
