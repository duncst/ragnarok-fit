
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { useCapabilityProgress } from '@/hooks/useCapabilityProgress';
import type { CapabilityPath } from '@/types/capabilities';

interface CapabilityShowcaseProps {
  primaryPath?: number | null;
}

const CapabilityShowcase = ({ primaryPath }: CapabilityShowcaseProps) => {
  const { capabilities, toggleCapability, getPathProgress } = useCapabilityProgress();
  const [openPaths, setOpenPaths] = useState<Record<number, boolean>>({});

  const getNextThreeChallenges = (path: CapabilityPath) => {
    const incompleteTiers = path.tiers.filter(tier => !tier.completed);
    return incompleteTiers.slice(0, 3);
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
        const isOpen = openPaths[pathIndex] || false;
        const isPrimary = primaryPath === pathIndex;
        
        return (
          <Collapsible key={path.name} open={isOpen} onOpenChange={() => togglePath(pathIndex)}>
            <Card className={`${isPrimary ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/30 border-amber-500' : 'bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20'}`}>
              <CollapsibleTrigger asChild>
                <CardHeader className="pb-3 cursor-pointer hover:bg-primary/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{path.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg text-foreground">{path.name}</CardTitle>
                          {isPrimary && (
                            <Badge className="bg-amber-500 text-amber-50 hover:bg-amber-600">
                              <Star className="h-3 w-3 mr-1" />
                              Primary Focus
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{path.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className={`${isPrimary ? 'bg-amber-500/30 text-amber-700 dark:text-amber-300 border-amber-500/50' : 'bg-primary/20 text-foreground border-primary/30'}`}>
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
                            className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors"
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-0 h-auto hover:bg-transparent"
                              onClick={() => handleToggleChallenge(pathIndex, originalTierIndex)}
                            >
                              <Circle className="h-4 w-4 text-muted-foreground hover:text-primary" />
                            </Button>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs bg-primary/10 text-foreground border-primary/30">
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
                      <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">
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
