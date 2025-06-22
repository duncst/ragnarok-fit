
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import type { CapabilityPath } from '@/types/capabilities';

interface CapabilityPathDialogProps {
  path: CapabilityPath | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleCapability: (tierIndex: number) => void;
  progress: { completed: number; total: number; percentage: number };
}

const CapabilityPathDialog = ({ path, isOpen, onClose, onToggleCapability, progress }: CapabilityPathDialogProps) => {
  if (!path) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-2xl">{path.icon}</span>
            <div>
              <div className="text-xl font-bold">{path.name}</div>
              <div className="text-sm font-normal text-muted-foreground">{path.subtitle}</div>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Progress</span>
              <Badge variant="secondary">{progress.completed}/{progress.total}</Badge>
            </div>
            <Progress value={progress.percentage} className="h-2" />
          </div>

          <ScrollArea className="h-96">
            <div className="space-y-2">
              {path.tiers.map((tier, index) => (
                <div
                  key={tier.tier}
                  className={`p-3 rounded-lg border transition-colors ${
                    tier.completed 
                      ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' 
                      : 'bg-card border-border hover:bg-accent/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={tier.completed}
                      onCheckedChange={() => onToggleCapability(index)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Tier {tier.tier}
                        </Badge>
                        <span className={`font-medium ${tier.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {tier.title}
                        </span>
                      </div>
                      <p className={`text-sm ${tier.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                        {tier.requirement}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CapabilityPathDialog;
