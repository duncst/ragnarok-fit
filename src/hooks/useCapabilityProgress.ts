
import { useState, useEffect } from 'react';
import { CAPABILITY_PATHS, type CapabilityPath } from '@/types/capabilities';

const STORAGE_KEY = 'forge-capability-progress';

export const useCapabilityProgress = () => {
  const [capabilities, setCapabilities] = useState<CapabilityPath[]>(CAPABILITY_PATHS);

  useEffect(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setCapabilities(parsed);
      } catch (error) {
        console.error('Failed to parse saved capability progress:', error);
      }
    }
  }, []);

  const saveProgress = (updatedCapabilities: CapabilityPath[]) => {
    setCapabilities(updatedCapabilities);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCapabilities));
  };

  const toggleCapability = (pathIndex: number, tierIndex: number) => {
    const updated = [...capabilities];
    updated[pathIndex].tiers[tierIndex].completed = !updated[pathIndex].tiers[tierIndex].completed;
    saveProgress(updated);
  };

  const getPathProgress = (pathIndex: number) => {
    const path = capabilities[pathIndex];
    const completed = path.tiers.filter(tier => tier.completed).length;
    const total = path.tiers.length;
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  return {
    capabilities,
    toggleCapability,
    getPathProgress
  };
};
