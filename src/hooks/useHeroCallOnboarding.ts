
import { useState, useEffect } from 'react';

const HERO_CALL_ONBOARDING_KEY = 'hero-call-onboarding-dismissed';

export const useHeroCallOnboarding = () => {
  const [showHeroCallOnboarding, setShowHeroCallOnboarding] = useState(false);

  useEffect(() => {
    // Always set to false to disable the hero call onboarding modal
    setShowHeroCallOnboarding(false);
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
