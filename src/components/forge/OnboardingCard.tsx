
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
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">{icon}</div>
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">{title}</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">{description}</p>
            </div>
            <Button size="sm" onClick={onAction} className="bg-blue-600 hover:bg-blue-700">
              {actionText}
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingCard;
