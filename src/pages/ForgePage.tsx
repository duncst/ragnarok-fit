
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Sword, Mountain, Zap, Target, Globe, Crown, Lock } from 'lucide-react';
import ForgeWorkoutHistory from '@/components/forge/ForgeWorkoutHistory';
import ArchetypeSelector from '@/components/forge/ArchetypeSelector';
import CapabilityShowcase from '@/components/forge/CapabilityShowcase';

const ForgePage = () => {
  // Mock data - in real app this would come from user profile/progress
  const progressWeeks = 4;
  const totalWeeks = 12;
  const progressPercentage = (progressWeeks / totalWeeks) * 100;
  const currentTitle = "Disciple of Flame";
  const selectedArchetype = "Tyr";

  return (
    <div className="space-y-6">
      {/* Title + Progress Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Zap className="h-6 w-6 text-orange-500" />
              <h1 className="text-2xl font-bold">{currentTitle}</h1>
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Your Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ArchetypeSelector selectedArchetype={selectedArchetype} />
        </CardContent>
      </Card>

      {/* Capability Showcase */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Capability Showcase
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CapabilityShowcase />
        </CardContent>
      </Card>

      {/* Workout History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sword className="h-5 w-5 text-primary" />
            Workout History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ForgeWorkoutHistory />
        </CardContent>
      </Card>

      {/* Halls of Valhalla - Coming Soon */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Crown className="h-6 w-6 text-amber-600" />
              <h3 className="text-xl font-bold text-amber-800 dark:text-amber-200">Halls of Valhalla</h3>
            </div>
            <p className="text-amber-700 dark:text-amber-300">
              Where elite members are recognized for their legendary achievements
            </p>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
              <Lock className="h-3 w-3 mr-1" />
              Coming Soon
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgePage;
