
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CheckCircle2, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import { useCapabilityProgress } from '@/hooks/useCapabilityProgress';
import type { CapabilityPath } from '@/types/capabilities';

const CapabilityShowcase = () => {
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
        
        return (
          <Collapsible key={path.name} open={isOpen} onOpenChange={() => togglePath(pathIndex)}>
            <Card className="bg-card border-border">
              <CollapsibleTrigger asChild>
                <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{path.icon}</span>
                      <div>
                        <CardTitle className="text-lg text-foreground">{path.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{path.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-muted text-muted-foreground">
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
                            className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:bg-muted/30 transition-colors"
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
                                <Badge variant="outline" className="text-xs bg-muted text-muted-foreground border-border">
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
