import React, { useState } from 'react';
import { useCapabilityProgress } from '@/hooks/useCapabilityProgress';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const CapabilityPathsPage = () => {
  const { capabilities: allCapabilities, toggleCapability, getPathProgress } = useCapabilityProgress();
  
  // Filter to only show Strength and Endurance paths
  const capabilities = allCapabilities.filter(path => 
    path.name.toLowerCase() === 'strength' || path.name.toLowerCase() === 'endurance'
  );
  
  const [selectedPath, setSelectedPath] = useState(0);

  const currentPath = capabilities[selectedPath];
  // Need to get the original index in the full capabilities array for progress
  const originalPathIndex = allCapabilities.findIndex(path => path.name === currentPath?.name);
  const progress = getPathProgress(originalPathIndex);

  const getPathIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'strength': return '💪';
      case 'endurance': return '⏱️';
      case 'survival': return '⚠️';
      case 'mobility': return '📈';
      case 'urban readiness': return '🏙️';
      default: return '🎯';
    }
  };

  const getTierStatus = (tierIndex: number, isCompleted: boolean) => {
    const allPreviousCompleted = currentPath.tiers.slice(0, tierIndex).every(tier => tier.completed);
    
    if (isCompleted) return 'completed';
    if (tierIndex === 0 || allPreviousCompleted) return 'available';
    return 'locked';
  };

  const isMilitaryStandard = (requirement: string) => {
    return requirement.includes('Police') || requirement.includes('Army') || requirement.includes('Marines') || requirement.includes('Military');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">CAPABILITY PATHS</h1>
          <p className="text-muted-foreground">Choose your path and forge your legend through disciplined progression</p>
        </div>

        {/* Path Selection Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {capabilities.map((path, index) => (
            <button
              key={path.name}
              onClick={() => setSelectedPath(index)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                selectedPath === index
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <span>{getPathIcon(path.name)}</span>
              {path.name}
            </button>
          ))}
        </div>

        {/* Selected Path Details */}
        <div className="bg-card border rounded-lg p-12 mb-6 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">{getPathIcon(currentPath.name)}</span>
          </div>
          
          <h2 className="text-4xl font-bold text-foreground mb-3">
            {currentPath.name}
          </h2>
          
          <p className="text-muted-foreground text-xl italic">{currentPath.subtitle}</p>
        </div>

        {/* Tiers List */}
        <div className="space-y-4">
          {currentPath.tiers.map((tier, index) => {
            const status = getTierStatus(index, tier.completed);
            const isLocked = status === 'locked';
            const isCompleted = status === 'completed';
            const isMilitary = isMilitaryStandard(tier.requirement);

            return (
              <div
                key={tier.tier}
                onClick={() => !isLocked && toggleCapability(originalPathIndex, index)}
                className={cn(
                  "bg-card border rounded-lg p-4 transition-all cursor-pointer",
                  isCompleted && "border-green-500 bg-green-500/10",
                  isLocked && "opacity-60 cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-4 mb-2">
                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : isLocked ? (
                      <Lock className="w-6 h-6 text-muted-foreground" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-muted-foreground" />
                    )}
                  </div>

                  {/* Tier Badge */}
                  <Badge 
                    variant={isCompleted ? "default" : "secondary"}
                    className={cn(
                      "font-bold px-3 py-1",
                      isCompleted && "bg-green-600 text-white"
                    )}
                  >
                    Tier {tier.tier}
                  </Badge>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-foreground">
                    {tier.title}
                  </h3>
                </div>

                {/* Requirement */}
                <div className="ml-10">
                  <p className="text-sm text-muted-foreground">
                    {tier.requirement}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CapabilityPathsPage;