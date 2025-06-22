
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface OnboardingCardProps {
  title: string;
  description: string;
  actionText: string;
  onAction: () => void;
  onDismiss: () => void;
  icon: React.ReactNode;
}

const OnboardingCard = ({ title, description, actionText, onAction, onDismiss, icon }: OnboardingCardProps) => {
  return (
    <Card className="bg-gradient-to-r from-primary/10 to-primary/20 border-primary/30">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">{icon}</div>
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
            <Button size="sm" onClick={onAction} className="bg-primary hover:bg-primary/90">
              {actionText}
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-muted-foreground hover:bg-primary/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingCard;
