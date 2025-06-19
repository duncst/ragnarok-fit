import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Mountain, ArrowRight, ArrowLeft, Sparkles, Play, TrendingUp, Target } from 'lucide-react';
import { ImageIcon } from '@/components/ImageIcon';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Ragnarok Fit",
      subtitle: "Your journey to Valhalla begins here",
      content: (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <Mountain className="h-24 w-24 text-primary mx-auto" />
              <Sparkles className="h-8 w-8 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>
          <p className="text-lg text-muted-foreground">
            Forge your strength like the Norse gods and track your epic fitness journey
          </p>
        </div>
      )
    },
    {
      title: "Start Your Workout",
      subtitle: "Multiple paths to glory",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Play className="h-6 w-6 text-primary" />
              <div>
                <h4 className="font-semibold">Create Your Own</h4>
                <p className="text-sm text-muted-foreground">Build custom workouts from scratch</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <ImageIcon 
                src="/lovable-uploads/99083c33-ce99-4041-8791-0d26ae1fbf22.png" 
                alt="Template icon"
                className="h-6 w-6"
              />
              <div>
                <h4 className="font-semibold">Use Templates</h4>
                <p className="text-sm text-muted-foreground">Quick start with proven routines</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Sparkles className="h-6 w-6 text-primary" />
              <div>
                <h4 className="font-semibold">AI Generation</h4>
                <p className="text-sm text-muted-foreground">Let our digital seer design your ideal session</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Track Your Progress",
      subtitle: "Every rep carved into your saga",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-4 bg-muted rounded-lg">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold text-sm">Personal Records</h4>
              <p className="text-xs text-muted-foreground">Track your PRs</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Target className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold text-sm">Analytics</h4>
              <p className="text-xs text-muted-foreground">See your progress</p>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg">
            <h4 className="font-semibold text-orange-800 mb-2">⚔️ Valhalla Mode</h4>
            <p className="text-sm text-orange-700">
              Push your limits with our most intense challenges and earn your place
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Begin Your Saga",
      subtitle: "Your path is yours to shape",
      content: (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <ImageIcon 
                src="/lovable-uploads/6ace109c-b935-4cbe-ae24-b2adfe21bde8.png"
                alt="Workout Mode"
                className="h-24 w-24 mx-auto"
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full blur opacity-75 animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold">You're ready to write your legend!</p>
            <p className="text-muted-foreground">
              Step into the world of Ragnarok Fit and rise stronger every day.
            </p>
          </div>
          <Button onClick={onComplete} size="lg" className="w-full">
            <Mountain className="mr-2 h-5 w-5" />
            Become Ragnarok Fit
          </Button>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">{currentStepData.title}</h2>
              <p className="text-muted-foreground">{currentStepData.subtitle}</p>
            </div>

            <div className="py-4">
              {currentStepData.content}
            </div>
          </div>

          {currentStep < steps.length - 1 && (
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={nextStep}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingFlow;
