
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Mountain, Swords, Shield, Target, Flame, Users, Crown } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const NewOnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userIntent, setUserIntent] = useState<string[]>([]);
  const [selectedPaths, setSelectedPaths] = useState<string[]>([]);
  const [oathAccepted, setOathAccepted] = useState(false);

  const totalSteps = 8;

  const handleIntentSelection = (intent: string) => {
    setUserIntent(prev => 
      prev.includes(intent) 
        ? prev.filter(i => i !== intent)
        : [...prev, intent]
    );
  };

  const handlePathSelection = (path: string) => {
    setSelectedPaths(prev => 
      prev.includes(path) 
        ? prev.filter(p => p !== path)
        : [...prev, path]
    );
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return userIntent.length > 0;
      case 2: return selectedPaths.length > 0;
      case 4: return oathAccepted;
      default: return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Welcome to the Forge
        return (
          <div className="text-center space-y-8 min-h-[400px] flex flex-col justify-center">
            <div className="flex justify-center">
              <div className="relative">
                <Mountain className="h-32 w-32 text-primary mx-auto animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/40 rounded-full blur-xl animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">Welcome to Ragnarok Fit</h1>
              <div className="space-y-4 text-lg">
                <p className="text-foreground">This is not a fitness app.</p>
                <p className="text-foreground font-semibold">This is the Forge.</p>
                <p className="text-muted-foreground">Where men become capable, disciplined, unbreakable.</p>
              </div>
              <Button onClick={nextStep} size="lg" className="mt-8">
                <Swords className="mr-2 h-5 w-5" />
                Enter the Forge
              </Button>
            </div>
          </div>
        );

      case 1: // Why Are You Here?
        const intents = [
          'Build Strength & Endurance',
          'Develop Discipline', 
          'Learn Survival Skills',
          'Find Brotherhood',
          'All of the Above'
        ];

        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Why have you answered the Call?</h2>
              <p className="text-muted-foreground">Select what drives you to the Forge</p>
            </div>
            <div className="space-y-3">
              {intents.map((intent) => (
                <div 
                  key={intent}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    userIntent.includes(intent) 
                      ? 'border-primary bg-primary/10' 
                      : 'border-muted hover:border-primary/50'
                  }`}
                  onClick={() => handleIntentSelection(intent)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded border-2 ${
                      userIntent.includes(intent) ? 'bg-primary border-primary' : 'border-muted-foreground'
                    }`} />
                    <span className="font-medium">{intent}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              onClick={nextStep} 
              disabled={!canProceed()}
              className="w-full"
            >
              Continue
            </Button>
          </div>
        );

      case 2: // Choose Your Starting Paths
        const paths = [
          { id: 'strength', name: 'Strength', subtitle: 'Way of the Einherjar', icon: '🏋️' },
          { id: 'endurance', name: 'Endurance', subtitle: 'Path of the Ironwolf', icon: '🏃' },
          { id: 'mobility', name: 'Mobility', subtitle: 'Flow of the Panther', icon: '🧘' },
          { id: 'resilience', name: 'Resilience', subtitle: 'Path of the Unbroken', icon: '❄️' },
          { id: 'survival', name: 'Survival', subtitle: 'The Wilds Beckon', icon: '🪢' },
          { id: 'discipline', name: 'Discipline', subtitle: 'The Discipline of Tyr', icon: '🛡️' }
        ];

        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Choose Your Starting Paths</h2>
              <p className="text-muted-foreground">Select the Paths you will walk first. You can add more later.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {paths.map((path) => (
                <div 
                  key={path.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all text-center ${
                    selectedPaths.includes(path.id) 
                      ? 'border-primary bg-primary/10' 
                      : 'border-muted hover:border-primary/50'
                  }`}
                  onClick={() => handlePathSelection(path.id)}
                >
                  <div className="text-2xl mb-2">{path.icon}</div>
                  <div className="font-semibold text-sm">{path.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{path.subtitle}</div>
                </div>
              ))}
            </div>
            <Button 
              onClick={nextStep} 
              disabled={!canProceed()}
              className="w-full"
            >
              Confirm My Paths
            </Button>
          </div>
        );

      case 3: // The Daily Ritual
        return (
          <div className="space-y-6 text-center">
            <div className="space-y-4">
              <Target className="h-16 w-16 text-primary mx-auto" />
              <h2 className="text-2xl font-bold">Your Daily Rite</h2>
            </div>
            <div className="space-y-4 text-left bg-muted/50 p-6 rounded-lg">
              <p>Each dawn, you will face the <span className="font-semibold text-primary">Hero's Call</span>—a daily challenge crafted to forge strength and discipline.</p>
              <p>On rest days, you will hone skills and mobility.</p>
              <p className="font-semibold">Every effort is counted.</p>
            </div>
            <Button onClick={nextStep} size="lg" className="w-full">
              Show Me My First Trial
            </Button>
          </div>
        );

      case 4: // Initiation Oath
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <Flame className="h-16 w-16 text-primary mx-auto" />
              <h2 className="text-2xl font-bold">Initiation Oath</h2>
              <p className="text-muted-foreground">Before you begin, recite your Oath silently or aloud</p>
            </div>
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-lg space-y-4 text-center">
              <p className="font-semibold">I will show up, even when it is hard.</p>
              <p className="font-semibold">I will respect the Forge.</p>
              <p className="font-semibold">I will not seek perfection, only discipline.</p>
            </div>
            <div className="flex items-center space-x-3 justify-center">
              <Checkbox 
                id="oath" 
                checked={oathAccepted}
                onCheckedChange={(checked) => setOathAccepted(!!checked)}
              />
              <label htmlFor="oath" className="font-medium cursor-pointer">
                I accept this Oath
              </label>
            </div>
            <Button 
              onClick={nextStep} 
              disabled={!canProceed()}
              size="lg" 
              className="w-full"
            >
              I Am Ready
            </Button>
          </div>
        );

      case 5: // First Hero's Call
        return (
          <div className="space-y-6 text-center">
            <div className="space-y-4">
              <Swords className="h-16 w-16 text-primary mx-auto" />
              <h2 className="text-2xl font-bold">The First Ember</h2>
              <p className="text-muted-foreground">Your initiation trial awaits</p>
            </div>
            <div className="bg-gradient-to-r from-primary/10 to-primary/20 p-6 rounded-lg space-y-4">
              <h3 className="font-bold text-lg">Today's Challenge</h3>
              <div className="space-y-2 text-left">
                <p>• 10 Push-ups (modify as needed)</p>
                <p>• 1 minute plank</p>
                <p>• Walk for 10 minutes</p>
              </div>
              <p className="text-sm text-muted-foreground italic">
                "The fire starts with a single spark. Light yours today."
              </p>
            </div>
            <Button onClick={nextStep} size="lg" className="w-full">
              <Flame className="mr-2 h-5 w-5" />
              Begin
            </Button>
          </div>
        );

      case 6: // Brotherhood Invitation
        return (
          <div className="space-y-6 text-center">
            <div className="space-y-4">
              <Users className="h-16 w-16 text-primary mx-auto" />
              <h2 className="text-2xl font-bold">The Brotherhood</h2>
            </div>
            <div className="space-y-4">
              <p>The Forge is stronger when shared.</p>
              <p className="text-muted-foreground">
                You can join the Brotherhood to celebrate victories and hold each other accountable.
              </p>
            </div>
            <div className="space-y-3">
              <Button onClick={nextStep} size="lg" className="w-full">
                Join the Brotherhood
              </Button>
              <Button onClick={nextStep} variant="outline" className="w-full">
                Maybe Later
              </Button>
            </div>
          </div>
        );

      case 7: // Final Confirmation
        return (
          <div className="space-y-6 text-center">
            <div className="space-y-4">
              <Crown className="h-24 w-24 text-primary mx-auto" />
              <h2 className="text-2xl font-bold">Welcome to the Forge</h2>
            </div>
            <div className="space-y-4">
              <p className="text-lg font-semibold">You are now a member of the Forge.</p>
              <p className="text-muted-foreground">Tomorrow, your saga continues.</p>
            </div>
            <Button onClick={onComplete} size="lg" className="w-full">
              <Mountain className="mr-2 h-5 w-5" />
              Take Me to the Forge
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Step {currentStep + 1} of {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {renderStep()}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewOnboardingFlow;
