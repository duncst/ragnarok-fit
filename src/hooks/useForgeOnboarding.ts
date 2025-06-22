
import { useState, useEffect } from 'react';

const HERO_CALL_ONBOARDING_KEY = 'forge-hero-call-onboarding-dismissed';
const CAPABILITY_PATHS_ONBOARDING_KEY = 'forge-capability-paths-onboarding-dismissed';
const CAPABILITY_ONBOARDING_KEY = 'forge-capability-onboarding-dismissed';
const PRIMARY_PATH_KEY = 'forge-primary-path';

export const useForgeOnboarding = () => {
  const [showHeroCallOnboarding, setShowHeroCallOnboarding] = useState(false);
  const [showCapabilityPathsOnboarding, setShowCapabilityPathsOnboarding] = useState(false);
  const [showCapabilityOnboarding, setShowCapabilityOnboarding] = useState(false);
  const [primaryPath, setPrimaryPath] = useState<number | null>(null);

  useEffect(() => {
    const heroCallDismissed = localStorage.getItem(HERO_CALL_ONBOARDING_KEY);
    const capabilityPathsDismissed = localStorage.getItem(CAPABILITY_PATHS_ONBOARDING_KEY);
    const capabilityOnboardingDismissed = localStorage.getItem(CAPABILITY_ONBOARDING_KEY);
    const savedPrimaryPath = localStorage.getItem(PRIMARY_PATH_KEY);
    
    setShowHeroCallOnboarding(heroCallDismissed !== 'true');
    setShowCapabilityPathsOnboarding(capabilityPathsDismissed !== 'true');
    setShowCapabilityOnboarding(capabilityOnboardingDismissed !== 'true');
    setPrimaryPath(savedPrimaryPath ? parseInt(savedPrimaryPath) : null);
  }, []);

  const dismissHeroCallOnboarding = () => {
    localStorage.setItem(HERO_CALL_ONBOARDING_KEY, 'true');
    setShowHeroCallOnboarding(false);
  };

  const dismissCapabilityPathsOnboarding = () => {
    localStorage.setItem(CAPABILITY_PATHS_ONBOARDING_KEY, 'true');
    setShowCapabilityPathsOnboarding(false);
  };

  const dismissCapabilityOnboarding = () => {
    localStorage.setItem(CAPABILITY_ONBOARDING_KEY, 'true');
    setShowCapabilityOnboarding(false);
  };

  const selectPrimaryPath = (pathIndex: number) => {
    localStorage.setItem(PRIMARY_PATH_KEY, pathIndex.toString());
    setPrimaryPath(pathIndex);
    dismissCapabilityOnboarding();
  };

  return {
    showHeroCallOnboarding,
    showCapabilityPathsOnboarding,
    showCapabilityOnboarding,
    primaryPath,
    dismissHeroCallOnboarding,
    dismissCapabilityPathsOnboarding,
    dismissCapabilityOnboarding,
    selectPrimaryPath,
  };
};
