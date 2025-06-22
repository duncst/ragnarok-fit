
import { useState, useEffect } from 'react';

const HERO_CALL_ONBOARDING_KEY = 'forge-hero-call-onboarding-dismissed';
const CAPABILITY_PATHS_ONBOARDING_KEY = 'forge-capability-paths-onboarding-dismissed';

export const useForgeOnboarding = () => {
  const [showHeroCallOnboarding, setShowHeroCallOnboarding] = useState(false);
  const [showCapabilityPathsOnboarding, setShowCapabilityPathsOnboarding] = useState(false);

  useEffect(() => {
    const heroCallDismissed = localStorage.getItem(HERO_CALL_ONBOARDING_KEY);
    const capabilityPathsDismissed = localStorage.getItem(CAPABILITY_PATHS_ONBOARDING_KEY);
    
    setShowHeroCallOnboarding(heroCallDismissed !== 'true');
    setShowCapabilityPathsOnboarding(capabilityPathsDismissed !== 'true');
  }, []);

  const dismissHeroCallOnboarding = () => {
    localStorage.setItem(HERO_CALL_ONBOARDING_KEY, 'true');
    setShowHeroCallOnboarding(false);
  };

  const dismissCapabilityPathsOnboarding = () => {
    localStorage.setItem(CAPABILITY_PATHS_ONBOARDING_KEY, 'true');
    setShowCapabilityPathsOnboarding(false);
  };

  return {
    showHeroCallOnboarding,
    showCapabilityPathsOnboarding,
    dismissHeroCallOnboarding,
    dismissCapabilityPathsOnboarding,
  };
};
