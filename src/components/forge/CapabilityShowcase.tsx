
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CheckCircle2, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import { useCapabilityProgress } from '@/hooks/useCapabilityProgress';
import type { CapabilityPath } from '@/types/capabilities';

interface CapabilityShowcaseProps {
  primaryPath: number | null;
}

const CapabilityShowcase = ({ primaryPath }: CapabilityShowcaseProps) => {
  const { capabilities, toggleCapability, getPathProgress } = useCapabilityProgress();
  const [openPaths, setOpenPaths] = useState<Record<number, boolean>>({});

  const getNextThreeChallenges = (path: CapabilityPath) => {
    const incompleteTiers = path.tiers.filter(tier => !tier.completed);
    return incompleteTiers.slice(0, 3);
  };

  const getNextChallenge = (path: CapabilityPath) => {
    const incompleteTiers = path.tiers.filter(tier => !tier.completed);
    return incompleteTiers.length > 0 ? incompleteTiers[0] : null;
  };

  const handleToggleChallenge = (pathIndex: number, tierIndex: number) => {
    toggleCapability(pathIndex, tierIndex);
  };

  const togglePath = (pathIndex: number) => {
    setOpenPaths(prev => ({
      ...prev,
      [pathIndex]: !prev[pathIndex]
    }));
  };

  return (
    <div className="space-y-3">
      {capabilities.map((path, pathIndex) => {
        const progress = getPathProgress(pathIndex);
        const nextChallenges = getNextThreeChallenges(path);
        const nextChallenge = getNextChallenge(path);
        const isOpen = openPaths[pathIndex] || false;
        const isPrimaryPath = primaryPath === pathIndex;
        
        return (
          <Collapsible key={path.name} open={isOpen} onOpenChange={() => togglePath(pathIndex)}>
            <Card className={`bg-gradient-to-r from-orange-500/5 to-red-500/10 ${
              isPrimaryPath ? 'border-orange-500 border-2' : 'border-orange-500/20'
            }`}>
              <CollapsibleTrigger asChild>
                <CardHeader className="pb-3 cursor-pointer hover:bg-orange-500/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{path.icon}</span>
                      <div>
                        <CardTitle className="text-lg text-foreground">{path.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{path.subtitle}</p>
                        {isPrimaryPath && (
                          <Badge variant="secondary" className="bg-orange-500/20 text-orange-600 border-orange-500/30 mt-1">
                            Primary Focus
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-orange-500/20 text-foreground border-orange-500/30">
                        {progress.completed}/{progress.total}
                      </Badge>
                      <div className="w-24">
                        <Progress value={progress.percentage} className="h-2" />
                      </div>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  {/* Show next challenge when collapsed */}
                  {!isOpen && nextChallenge && (
                    <div className="mt-2 p-2 rounded bg-gray-100 dark:bg-gray-800 opacity-60">
                      <div className="flex items-center gap-2 text-sm">
                        <Circle className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          Next: Tier {nextChallenge.tier} - {nextChallenge.title}
                        </span>
                      </div>
                    </div>
                  )}
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  {nextChallenges.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground mb-3">Next Challenges:</p>
                      {nextChallenges.map((tier) => {
                        const originalTierIndex = path.tiers.findIndex(t => t.tier === tier.tier);
                        return (
                          <div
                            key={tier.tier}
                            className="flex items-center gap-3 p-3 rounded-lg bg-orange-500/5 border border-orange-500/20 hover:bg-orange-500/10 transition-colors"
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-0 h-auto hover:bg-transparent"
                              onClick={() => handleToggleChallenge(pathIndex, originalTierIndex)}
                            >
                              <Circle className="h-4 w-4 text-muted-foreground hover:text-orange-500" />
                            </Button>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs bg-orange-500/10 text-foreground border-orange-500/30">
                                  Tier {tier.tier}
                                </Badge>
                                <span className="font-medium text-sm text-foreground">{tier.title}</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{tier.requirement}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Badge className="bg-orange-500 text-white hover:bg-orange-600">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Path Complete
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        );
      })}
    </div>
  );
};

export default CapabilityShowcase;
