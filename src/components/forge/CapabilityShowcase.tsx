
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useCapabilityProgress } from '@/hooks/useCapabilityProgress';
import CapabilityPathDialog from './CapabilityPathDialog';
import type { CapabilityPath } from '@/types/capabilities';

const CapabilityShowcase = () => {
  const { capabilities, toggleCapability, getPathProgress } = useCapabilityProgress();
  const [selectedPath, setSelectedPath] = useState<CapabilityPath | null>(null);
  const [selectedPathIndex, setSelectedPathIndex] = useState<number>(-1);

  const handlePathClick = (path: CapabilityPath, index: number) => {
    setSelectedPath(path);
    setSelectedPathIndex(index);
  };

  const handleToggleCapability = (tierIndex: number) => {
    if (selectedPathIndex >= 0) {
      toggleCapability(selectedPathIndex, tierIndex);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {capabilities.map((path, pathIndex) => {
          const progress = getPathProgress(pathIndex);
          const nextIncomplete = path.tiers.find(tier => !tier.completed);
          
          return (
            <Card 
              key={path.name} 
              className={`${path.bgColor} cursor-pointer hover:shadow-md transition-shadow`}
              onClick={() => handlePathClick(path, pathIndex)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{path.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{path.name}</h4>
                      <p className="text-xs text-muted-foreground truncate">{path.subtitle}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Progress</span>
                      <Badge variant="secondary" className="text-xs">
                        {progress.completed}/{progress.total}
                      </Badge>
                    </div>
                    <Progress value={progress.percentage} className="h-1.5" />
                  </div>

                  {nextIncomplete && (
                    <div className="pt-1 border-t border-border/50">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Next Goal:</p>
                      <p className="text-xs text-foreground">{nextIncomplete.title}</p>
                    </div>
                  )}

                  {progress.completed === progress.total && (
                    <div className="pt-1 border-t border-green-200 dark:border-green-800">
                      <Badge variant="default" className="text-xs bg-green-600 hover:bg-green-700">
                        ✓ Complete
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <CapabilityPathDialog
        path={selectedPath}
        isOpen={selectedPath !== null}
        onClose={() => {
          setSelectedPath(null);
          setSelectedPathIndex(-1);
        }}
        onToggleCapability={handleToggleCapability}
        progress={selectedPathIndex >= 0 ? getPathProgress(selectedPathIndex) : { completed: 0, total: 0, percentage: 0 }}
      />
    </>
  );
};

export default CapabilityShowcase;
