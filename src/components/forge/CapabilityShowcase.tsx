
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle } from 'lucide-react';
import { useCapabilityProgress } from '@/hooks/useCapabilityProgress';
import type { CapabilityPath } from '@/types/capabilities';

const CapabilityShowcase = () => {
  const { capabilities, toggleCapability, getPathProgress } = useCapabilityProgress();

  const getNextThreeChallenges = (path: CapabilityPath) => {
    const incompleteTiers = path.tiers.filter(tier => !tier.completed);
    return incompleteTiers.slice(0, 3);
  };

  const handleToggleChallenge = (pathIndex: number, tierIndex: number) => {
    toggleCapability(pathIndex, tierIndex);
  };

  return (
    <div className="space-y-4">
      {capabilities.map((path, pathIndex) => {
        const progress = getPathProgress(pathIndex);
        const nextChallenges = getNextThreeChallenges(path);
        
        return (
          <Card key={path.name} className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{path.icon}</span>
                  <div>
                    <CardTitle className="text-lg text-foreground">{path.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{path.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {progress.completed}/{progress.total}
                  </Badge>
                  <div className="w-24">
                    <Progress value={progress.percentage} className="h-2" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {nextChallenges.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground mb-3">Next Challenges:</p>
                  {nextChallenges.map((tier) => {
                    const originalTierIndex = path.tiers.findIndex(t => t.tier === tier.tier);
                    return (
                      <div
                        key={tier.tier}
                        className="flex items-center gap-3 p-2 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-auto"
                          onClick={() => handleToggleChallenge(pathIndex, originalTierIndex)}
                        >
                          <Circle className="h-4 w-4 text-slate-400" />
                        </Button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs bg-slate-50 dark:bg-slate-800">
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
                  <Badge variant="default" className="bg-green-600 hover:bg-green-600">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Path Complete
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CapabilityShowcase;
