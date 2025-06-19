
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, HelpCircle } from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';

const OnboardingSettings = () => {
  const { resetOnboarding } = useOnboarding();

  const handleResetOnboarding = () => {
    resetOnboarding();
    // Reload the page to trigger the onboarding flow
    window.location.reload();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          Getting Started
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Need a refresher?</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Replay the onboarding experience to get familiar with all the features again.
            </p>
            <Button onClick={handleResetOnboarding} variant="outline" className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" />
              Replay Onboarding
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingSettings;
