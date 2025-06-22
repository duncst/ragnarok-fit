
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Sword, Mountain, Zap, Target, Globe, Crown, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ForgeWorkoutHistory from '@/components/forge/ForgeWorkoutHistory';
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

  const handleExploreCapabilities = () => {
    dismissCapabilityPathsOnboarding();
  };

  return (
    <div className="space-y-6">
      {/* Title + Progress Bar */}
      <Card className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 border-slate-200 dark:border-slate-700">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Zap className="h-6 w-6 text-orange-500" />
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

      {/* Your Path - Primary Focus */}
      <Card className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Shield className="h-5 w-5 text-orange-500" />
            Your Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          {primaryPath !== null ? (
            <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{CAPABILITY_PATHS[primaryPath].icon}</span>
                <div>
                  <p className="font-semibold text-orange-900 dark:text-orange-200">Primary Focus</p>
                  <p className="text-lg font-bold text-orange-800 dark:text-orange-300">{CAPABILITY_PATHS[primaryPath].name}</p>
                  <p className="text-sm text-orange-700 dark:text-orange-400">{CAPABILITY_PATHS[primaryPath].subtitle}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">Choose your primary capability path to begin your journey</p>
              <Button onClick={() => selectPrimaryPath(0)} variant="outline">
                Select Primary Path
              </Button>
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

      {/* Capability Paths */}
      <Card className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Target className="h-5 w-5 text-orange-500" />
            Capability Paths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CapabilityShowcase />
        </CardContent>
      </Card>

      {/* Workout History */}
      <Card className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Sword className="h-5 w-5 text-orange-500" />
            Workout History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ForgeWorkoutHistory />
        </CardContent>
      </Card>

      {/* Halls of Valhalla - Coming Soon */}
      <Card className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 border-slate-200 dark:border-slate-700">
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Crown className="h-6 w-6 text-orange-500" />
              <h3 className="text-xl font-bold text-foreground">Halls of Valhalla</h3>
            </div>
            <p className="text-muted-foreground">
              Where elite members are recognized for their legendary achievements
            </p>
            <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
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
