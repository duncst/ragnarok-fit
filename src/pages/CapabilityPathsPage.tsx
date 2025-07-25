import React, { useState } from 'react';
import { useCapabilityProgress } from '@/hooks/useCapabilityProgress';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const CapabilityPathsPage = () => {
  const { capabilities, toggleCapability, getPathProgress } = useCapabilityProgress();
  const [selectedPath, setSelectedPath] = useState(0);

  const currentPath = capabilities[selectedPath];
  const progress = getPathProgress(selectedPath);

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
          <p className="text-muted-foreground">Master the skills of a modern warrior</p>
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
        <div className="bg-card border rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold" style={{ color: currentPath.color }}>
              {currentPath.name} PATH
            </h2>
            <div className="text-right">
              <div className="text-lg font-bold text-foreground">
                {progress.completed}/{progress.total}
              </div>
            </div>
          </div>
          
          <p className="text-muted-foreground mb-4">{currentPath.subtitle}</p>
          
          <Progress 
            value={progress.percentage} 
            className="h-3"
          />
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
                className={cn(
                  "bg-card border rounded-lg p-4 transition-all",
                  isCompleted && "border-green-500/30 bg-green-500/5",
                  isLocked && "opacity-60"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : isLocked ? (
                      <Lock className="w-6 h-6 text-muted-foreground" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-muted-foreground" />
                    )}
                  </div>

                  {/* Tier Badge */}
                  <div className="flex-shrink-0">
                    <Badge 
                      variant={isCompleted ? "default" : "secondary"}
                      className={cn(
                        "font-bold px-3 py-1",
                        isCompleted && "bg-green-600 text-white"
                      )}
                    >
                      Tier {tier.tier}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-foreground">
                        {tier.title}
                      </h3>
                      {isMilitary && (
                        <Badge variant="destructive" className="text-xs">
                          Military/Police Standard
                        </Badge>
                      )}
                    </div>
                    
                    <p className={cn(
                      "text-sm",
                      isLocked ? "text-muted-foreground" : "text-foreground"
                    )}>
                      {tier.requirement}
                    </p>
                  </div>

                  {/* Toggle Button */}
                  {!isLocked && (
                    <button
                      onClick={() => toggleCapability(selectedPath, index)}
                      className={cn(
                        "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                        isCompleted
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                    >
                      {isCompleted ? 'Completed' : 'Mark Complete'}
                    </button>
                  )}
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