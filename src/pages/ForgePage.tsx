
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Sword, Mountain, Zap, Target, Globe, Crown, Lock, Settings } from 'lucide-react';
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

  const handleChangePath = () => {
    // This will show the capability onboarding dialog to select a new primary path
    localStorage.removeItem('forge-capability-onboarding-dismissed');
    window.location.reload(); // Simple way to trigger the onboarding to show again
  };

  return (
    <div className="space-y-6">
      {/* Title + Progress Bar */}
      <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/30">
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
      <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Shield className="h-5 w-5 text-orange-500" />
            Your Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          {primaryPath !== null ? (
            <div className="p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/40 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{CAPABILITY_PATHS[primaryPath].icon}</span>
                  <div>
                    <p className="font-semibold text-orange-600">Primary Focus</p>
                    <p className="text-lg font-bold text-foreground">{CAPABILITY_PATHS[primaryPath].name}</p>
                    <p className="text-sm text-muted-foreground">{CAPABILITY_PATHS[primaryPath].subtitle}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleChangePath}
                  className="text-orange-600 hover:bg-orange-500/10"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">Choose your primary capability path to begin your journey</p>
              <Button onClick={() => selectPrimaryPath(0)} variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white">
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
      <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Target className="h-5 w-5 text-orange-500" />
            Capability Paths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CapabilityShowcase primaryPath={primaryPath} />
        </CardContent>
      </Card>

      {/* Workout History */}
      <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/30">
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
      <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/30">
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Crown className="h-6 w-6 text-orange-500" />
              <h3 className="text-xl font-bold text-foreground">Halls of Valhalla</h3>
            </div>
            <p className="text-muted-foreground">
              Where elite members are recognized for their legendary achievements
            </p>
            <Badge variant="secondary" className="bg-orange-500/20 text-foreground border-orange-500/30">
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
