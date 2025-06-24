
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Sword, Mountain, Zap, Target, Globe, Crown, Lock, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ForgeWorkoutHistory from '@/components/forge/ForgeWorkoutHistory';
import CapabilityShowcase from '@/components/forge/CapabilityShowcase';
import CapabilityOnboarding from '@/components/forge/CapabilityOnboarding';
import { useForgeOnboarding } from '@/hooks/useForgeOnboarding';
import { useForgeProgress } from '@/hooks/useForgeProgress';
import { Skeleton } from '@/components/ui/skeleton';

const ForgePage = () => {
  const navigate = useNavigate();
  const {
    showCapabilityOnboarding,
    primaryPath,
    dismissCapabilityOnboarding,
    selectPrimaryPath,
  } = useForgeOnboarding();

  const { forgeProgress, isLoading } = useForgeProgress();

  return (
    <div className="space-y-6">
      {/* Daily Hero's Call Progress Tracker */}
      <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/20 border-orange-500/30">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Flame className="h-6 w-6 text-orange-500" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Daily Hero's Call Progress</h1>
                <p className="text-sm text-muted-foreground">Forge yourself through daily challenges</p>
              </div>
            </div>
            
            <div className="bg-black/10 dark:bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30">
                  Current Title
                </Badge>
              </div>
              {isLoading ? (
                <Skeleton className="h-6 w-32 mx-auto" />
              ) : (
                <p className="text-xl font-bold text-orange-600 dark:text-orange-400">{forgeProgress.currentTitle}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Forging Progress</span>
                {isLoading ? (
                  <Skeleton className="h-4 w-20" />
                ) : (
                  <span className="font-medium text-foreground">{forgeProgress.currentWeek} of {forgeProgress.totalWeeks} weeks</span>
                )}
              </div>
              {isLoading ? (
                <Skeleton className="h-3 w-full" />
              ) : (
                <Progress value={forgeProgress.progressPercentage} className="h-3" />
              )}
              <p className="text-xs text-muted-foreground">
                Complete daily challenges to advance through forging weeks and earn new titles
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Capability Paths with Primary Focus */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/20 border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <span className="text-foreground">Capability Paths</span>
            </div>
            {primaryPath === null && (
              <Button onClick={() => selectPrimaryPath(0)} variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Choose Primary Path
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CapabilityShowcase primaryPath={primaryPath} />
        </CardContent>
      </Card>

      {/* Workout History */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/20 border-primary/30">
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
      <Card className="bg-gradient-to-r from-primary/10 to-primary/20 border-primary/30">
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Crown className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-bold text-foreground">Halls of Valhalla</h3>
            </div>
            <p className="text-muted-foreground">
              Where elite members are recognized for their legendary achievements
            </p>
            <Badge variant="secondary" className="bg-primary/20 text-foreground border-primary/30">
              <Lock className="h-3 w-3 mr-1" />
              Coming Soon
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Combined Capability Onboarding Dialog */}
      <CapabilityOnboarding
        isOpen={showCapabilityOnboarding}
        onClose={dismissCapabilityOnboarding}
        onSelectPrimary={selectPrimaryPath}
      />
    </div>
  );
};

export default ForgePage;
