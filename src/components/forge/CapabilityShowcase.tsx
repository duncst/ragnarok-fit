
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
            <Card className={`transition-all duration-200 overflow-hidden ${
              isPrimary 
                ? 'bg-gradient-to-r from-amber-500/10 to-amber-600/20 border-amber-500/50 shadow-lg' 
                : 'bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 hover:border-primary/30'
            }`}>
              <CollapsibleTrigger asChild>
                <CardHeader className="pb-3 cursor-pointer hover:bg-primary/5 transition-colors rounded-t-lg">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="text-3xl flex-shrink-0">{path.icon}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <CardTitle className={`text-xl font-bold truncate ${
                            isPrimary ? 'text-amber-700 dark:text-amber-300' : 'text-foreground'
                          }`}>
                            {path.name}
                          </CardTitle>
                          {isPrimary && (
                            <Badge className="bg-amber-500 text-amber-50 hover:bg-amber-600 shadow-sm flex-shrink-0">
                              <Star className="h-3 w-3 mr-1" />
                              Primary Focus
                            </Badge>
                          )}
                        </div>
                        <p className={`text-sm line-clamp-2 ${
                          isPrimary ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'
                        }`}>
                          {path.subtitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-center">
                        <Badge variant="secondary" className={`mb-2 text-xs ${
                          isPrimary 
                            ? 'bg-amber-500/20 text-amber-800 dark:text-amber-200 border-amber-500/40' 
                            : 'bg-primary/20 text-foreground border-primary/30'
                        }`}>
                          {progress.completed}/{progress.total}
                        </Badge>
                        <div className="w-24">
                          <Progress 
                            value={progress.percentage} 
                            className={`h-2 ${
                              isPrimary ? '[&>div]:bg-amber-500' : ''
                            }`} 
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {progress.percentage}%
                        </p>
                      </div>
                      {isOpen ? (
                        <ChevronUp className={`h-5 w-5 flex-shrink-0 ${
                          isPrimary ? 'text-amber-600' : 'text-muted-foreground'
                        }`} />
                      ) : (
                        <ChevronDown className={`h-5 w-5 flex-shrink-0 ${
                          isPrimary ? 'text-amber-600' : 'text-muted-foreground'
                        }`} />
                      )}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  {nextChallenges.length > 0 ? (
                    <div className="space-y-2">
                      <p className={`text-xs font-medium mb-3 ${
                        isPrimary ? 'text-amber-700 dark:text-amber-300' : 'text-muted-foreground'
                      }`}>
                        Next Challenges:
                      </p>
                      {nextChallenges.map((tier) => {
                        const originalTierIndex = path.tiers.findIndex(t => t.tier === tier.tier);
                        return (
                          <div
                            key={tier.tier}
                            className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                              isPrimary 
                                ? 'bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10' 
                                : 'bg-primary/5 border-primary/20 hover:bg-primary/10'
                            }`}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-0 h-auto hover:bg-transparent flex-shrink-0"
                              onClick={() => handleToggleChallenge(pathIndex, originalTierIndex)}
                            >
                              <Circle className={`h-4 w-4 transition-colors ${
                                isPrimary 
                                  ? 'text-amber-600 hover:text-amber-700' 
                                  : 'text-muted-foreground hover:text-primary'
                              }`} />
                            </Button>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <Badge variant="outline" className={`text-xs flex-shrink-0 ${
                                  isPrimary 
                                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30' 
                                    : 'bg-primary/10 text-foreground border-primary/30'
                                }`}>
                                  Tier {tier.tier}
                                </Badge>
                                <span className="font-medium text-sm text-foreground truncate">{tier.title}</span>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">{tier.requirement}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Badge className={`${
                        isPrimary 
                          ? 'bg-amber-500 text-amber-50 hover:bg-amber-600' 
                          : 'bg-primary text-primary-foreground hover:bg-primary/90'
                      }`}>
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
