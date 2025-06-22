
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Sword, Mountain, Zap, Target, Globe, Crown, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ForgeWorkoutHistory from '@/components/forge/ForgeWorkoutHistory';
import ArchetypeSelector from '@/components/forge/ArchetypeSelector';
import CapabilityShowcase from '@/components/forge/CapabilityShowcase';
import OnboardingCard from '@/components/forge/OnboardingCard';
import CapabilityOnboarding from '@/components/forge/CapabilityOnboarding';
import { useForgeOnboarding } from '@/hooks/useForgeOnboarding';
import { CAPABILITY_PATHS } from '@/types/capabilities';

const ForgePage = () => {
  const navigate = useNavigate();
  const {
    showCapabilityPathsOnboarding,
    showCapabilityOnboarding,
    primaryPath,
    dismissCapabilityPathsOnboarding,
    dismissCapabilityOnboarding,
    selectPrimaryPath,
  } = useForgeOnboarding();

  // Mock data - in real app this would come from user profile/progress
  const progressWeeks = 4;
  const totalWeeks = 12;
  const progressPercentage = (progressWeeks / totalWeeks) * 100;
  const currentTitle = "Disciple of Flame";
  const selectedArchetype = "Tyr";

  const handleExploreCapabilities = () => {
    dismissCapabilityPathsOnboarding();
  };

  return (
    <div className="space-y-6">
      {/* Title + Progress Bar */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border-primary/30">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">{currentTitle}</h1>
            </div>
            <p className="text-muted-foreground">{progressWeeks} Forging Weeks</p>
            <div className="space-y-2">
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-sm text-muted-foreground">
                Week {progressWeeks} of {totalWeeks} • {Math.round(progressPercentage)}% Complete
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Your Path - Selected Archetype */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Shield className="h-5 w-5 text-primary" />
            Your Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ArchetypeSelector selectedArchetype={selectedArchetype} />
          {primaryPath !== null && (
            <div className="mt-4 p-3 bg-gradient-to-br from-amber/10 to-amber/20 border border-amber/30 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-lg">{CAPABILITY_PATHS[primaryPath].icon}</span>
                <div>
                  <p className="font-semibold text-amber-800 dark:text-amber-200">Primary Focus</p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">{CAPABILITY_PATHS[primaryPath].subtitle}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Capability Paths Onboarding */}
      {showCapabilityPathsOnboarding && (
        <OnboardingCard
          title="Track Your Capabilities"
          description="Build real-world skills across Endurance, Strength, Mobility, Resilience, Discipline, and Survival. Each path contains tiered achievements to guide your progress from beginner to master."
          actionText="Explore Paths"
          onAction={handleExploreCapabilities}
          onDismiss={dismissCapabilityPathsOnboarding}
          icon="🎯"
        />
      )}

      {/* Capability Showcase */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Target className="h-5 w-5 text-primary" />
            Capability Showcase
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CapabilityShowcase />
        </CardContent>
      </Card>

      {/* Workout History */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Sword className="h-5 w-5 text-primary" />
            Workout History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ForgeWorkoutHistory />
        </CardContent>
      </Card>

      {/* Halls of Valhalla - Coming Soon */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border-primary/30">
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Crown className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-bold text-foreground">Halls of Valhalla</h3>
            </div>
            <p className="text-muted-foreground">
              Where elite members are recognized for their legendary achievements
            </p>
            <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
              <Lock className="h-3 w-3 mr-1" />
              Coming Soon
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Capability Onboarding Dialog */}
      <CapabilityOnboarding
        isOpen={showCapabilityOnboarding}
        onClose={dismissCapabilityOnboarding}
        onSelectPrimary={selectPrimaryPath}
      />
    </div>
  );
};

export default ForgePage;
