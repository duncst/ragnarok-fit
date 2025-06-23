
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Lock, Sparkles, Target } from 'lucide-react';
import { CAPABILITY_PATHS, type CapabilityPath } from '@/types/capabilities';

interface CapabilityOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrimary: (pathIndex: number) => void;
}

const CapabilityOnboarding = ({ isOpen, onClose, onSelectPrimary }: CapabilityOnboardingProps) => {
  const [step, setStep] = useState(1);
  const [selectedPath, setSelectedPath] = useState<number | null>(null);

  const handlePathSelect = (pathIndex: number) => {
    setSelectedPath(pathIndex);
  };

  const handleConfirmSelection = () => {
    if (selectedPath !== null) {
      onSelectPrimary(selectedPath);
      setStep(4);
    }
  };

  const handleFinish = () => {
    onClose();
    setStep(1);
    setSelectedPath(null);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="text-3xl">🎯</div>
        <h2 className="text-2xl font-bold text-foreground">Track Your Capabilities</h2>
        <p className="text-muted-foreground">Build real-world skills across Endurance, Strength, Mobility, Resilience, Discipline, and Survival. Each path contains tiered achievements to guide your progress from beginner to master.</p>
      </div>
      
      <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-lg space-y-3">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">How It Works</h3>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Choose your primary capability path to focus on</li>
          <li>• Complete tiered challenges to unlock achievements</li>
          <li>• Track your progress across all capability areas</li>
          <li>• Build the skills that matter in the real world</li>
        </ul>
      </div>
      
      <div className="text-center">
        <Button onClick={() => setStep(2)} className="bg-primary hover:bg-primary/80">
          Explore Paths <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="text-3xl">🔨</div>
        <h2 className="text-2xl font-bold text-foreground">You've been tested by fire</h2>
        <p className="text-muted-foreground">Now choose how you will be forged.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
        {CAPABILITY_PATHS.map((path, index) => (
          <Card key={path.name} className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border-primary/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{path.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{path.name}</h3>
                  <p className="text-sm font-medium text-primary">{path.subtitle}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {path.name === 'ENDURANCE' && 'Become the one who never quits. Run farther, move longer, go again.'}
                    {path.name === 'STRENGTH' && 'Build the power to carry, lift, and protect. Become unbreakable.'}
                    {path.name === 'MOBILITY' && 'Gain control, balance, and grace. Power without fluidity is wasted.'}
                    {path.name === 'RESILIENCE' && 'Cold. Pain. Hunger. Endure the world and become unshakable.'}
                    {path.name === 'SURVIVAL SKILLS' && 'Learn to tie, build, fire, and forage. Be the one others rely on.'}
                    {path.name === 'URBAN SURVIVAL' && 'Master your home, your city, your emergencies. Capability begins here.'}
                    {path.name === 'DISCIPLINE' && 'Master your mind and habits. True strength begins with self-control.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center">
        <Button onClick={() => setStep(3)} className="bg-primary hover:bg-primary/80">
          Choose Your Path <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="text-3xl">⚒️</div>
        <h2 className="text-2xl font-bold text-foreground">Choose Your Primary Path</h2>
        <p className="text-muted-foreground">"The Forge burns hotter when you have a goal."</p>
        <p className="text-sm text-muted-foreground">Choose your primary capability path — the first version of yourself you will forge.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto">
        {CAPABILITY_PATHS.map((path, index) => (
          <Card 
            key={path.name} 
            className={`cursor-pointer transition-all ${
              selectedPath === index 
                ? 'bg-gradient-to-br from-primary/20 to-primary/30 border-primary' 
                : 'bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border-primary/30 hover:border-primary/50'
            }`}
            onClick={() => handlePathSelect(index)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <span className="text-xl">{path.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{path.name}</h3>
                  <p className="text-sm text-muted-foreground">{path.subtitle}</p>
                </div>
                {selectedPath === index && (
                  <div className="text-primary">
                    <Sparkles className="h-5 w-5" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center space-y-2">
        <Button 
          onClick={handleConfirmSelection} 
          disabled={selectedPath === null}
          className="bg-primary hover:bg-primary/80"
        >
          Begin This Path
        </Button>
        <p className="text-xs text-muted-foreground">"You may master many paths. But you must begin with one."</p>
      </div>
    </div>
  );

  const renderStep4 = () => {
    if (selectedPath === null) return null;
    
    const path = CAPABILITY_PATHS[selectedPath];
    const firstThreeTiers = path.tiers.slice(0, 3);
    const legendaryTitle = path.tiers[path.tiers.length - 1].title;

    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="text-3xl">🧭</div>
          <h2 className="text-2xl font-bold text-foreground">Your Journey Begins</h2>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">{path.icon}</span>
            <Badge variant="outline" className="text-primary border-primary">
              {path.subtitle}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Your First 3 Trials</h3>
          <div className="space-y-2">
            {firstThreeTiers.map((tier, index) => (
              <Card key={tier.tier} className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border-primary/30">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      Tier {tier.tier}
                    </Badge>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-foreground">{tier.title}</p>
                      <p className="text-xs text-muted-foreground">{tier.requirement}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber/10 to-amber/20 border border-amber/30 rounded-lg p-4">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Lock className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Legendary Goal</span>
            </div>
            <p className="font-bold text-amber-800 dark:text-amber-200">{legendaryTitle}</p>
            <p className="text-xs text-amber-600 dark:text-amber-400">Complete 3 trials to earn your first rune and title.</p>
          </div>
        </div>
        
        <div className="text-center">
          <Button onClick={handleFinish} className="bg-primary hover:bg-primary/80">
            Let the Forging Begin 🔥
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="sr-only">Capability Path Onboarding</DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CapabilityOnboarding;
