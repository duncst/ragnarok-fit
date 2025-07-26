import React, { useState } from 'react';
import { useCapabilityProgress } from '@/hooks/useCapabilityProgress';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Lock, Users, Award, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const CapabilityPathsPage = () => {
  const { capabilities: allCapabilities, toggleCapability, getPathProgress } = useCapabilityProgress();
  
  // Filter to only show Strength and Endurance paths
  const capabilities = allCapabilities.filter(path => 
    path.name.toLowerCase() === 'strength' || path.name.toLowerCase() === 'endurance'
  );
  
  const [selectedPath, setSelectedPath] = useState(0);
  const [activeTab, setActiveTab] = useState('strength');

  const currentPath = capabilities[selectedPath];
  // Need to get the original index in the full capabilities array for progress
  const originalPathIndex = allCapabilities.findIndex(path => path.name === currentPath?.name);
  const progress = getPathProgress(originalPathIndex);

  const getPathIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'strength': return <span className="text-blue-400">ᚢ</span>;
      case 'endurance': return <span className="text-blue-400">ᛇ</span>;
      case 'survival': return '⚠️';
      case 'mobility': return '📈';
      case 'urban readiness': return '🏙️';
      default: return '🎯';
    }
  };

  const formatPathName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const getTierStatus = (tierIndex: number, isCompleted: boolean, path: any) => {
    const allPreviousCompleted = path.tiers.slice(0, tierIndex).every((tier: any) => tier.completed);
    
    if (isCompleted) return 'completed';
    if (tierIndex === 0 || allPreviousCompleted) return 'available';
    return 'locked';
  };

  const isMilitaryStandard = (requirement: string) => {
    return requirement.includes('Police') || requirement.includes('Army') || requirement.includes('Marines') || requirement.includes('Military');
  };

  const renderPathContent = (pathName: string) => {
    const pathIndex = capabilities.findIndex(path => path.name.toLowerCase() === pathName);
    if (pathIndex === -1) return null;

    const path = capabilities[pathIndex];
    const originalPathIndex = allCapabilities.findIndex(p => p.name === path.name);
    const progress = getPathProgress(originalPathIndex);

    return (
      <div className="space-y-6">
        {/* Path Header */}
        <div className="text-center">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">{getPathIcon(path.name)}</span>
          </div>
          
          <h2 className="text-3xl font-bold text-foreground mb-3">
            {formatPathName(path.name)}
          </h2>
          
          <p className="text-muted-foreground text-lg italic">{path.subtitle}</p>
        </div>

        {/* Tiers List */}
        <div className="space-y-4">
          {path.tiers.map((tier, index) => {
            const status = getTierStatus(index, tier.completed, path);
            const isLocked = status === 'locked';
            const isCompleted = status === 'completed';
            const isMilitary = isMilitaryStandard(tier.requirement);

            return (
              <div
                key={tier.tier}
                onClick={() => !isLocked && toggleCapability(originalPathIndex, index)}
                className={cn(
                  "bg-card border rounded-lg p-4 transition-all cursor-pointer",
                  isCompleted && "border-green-500 bg-green-500/10",
                  isLocked && "opacity-60 cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-4 mb-2">
                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : isLocked ? (
                      <Lock className="w-6 h-6 text-muted-foreground" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-muted-foreground" />
                    )}
                  </div>

                  {/* Tier Badge */}
                  <Badge 
                    variant={isCompleted ? "default" : "secondary"}
                    className={cn(
                      "font-bold px-3 py-1",
                      isCompleted && "bg-green-600 text-white"
                    )}
                  >
                    Tier {tier.tier}
                  </Badge>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-foreground">
                    {tier.title}
                  </h3>
                </div>

                {/* Requirement */}
                <div className="ml-10">
                  <p className="text-sm text-muted-foreground">
                    {tier.requirement}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderClanContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-sm text-muted-foreground mb-2">EXCLUSIVE ACCESS</h2>
        <h1 className="text-4xl font-bold text-foreground mb-4">Brotherhood</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Ragnarök Fit is an invite-only brotherhood of men committed to forging themselves into capable, disciplined warriors.
        </p>
      </div>

      {/* Brotherhood Status */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Your Brotherhood Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-lg font-semibold text-primary">Iron Soul Member</span>
            </div>
            <p className="text-sm text-muted-foreground">
              You've earned your place in the brotherhood. You have 2 invites available to bring worthy men into the forge.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Invites Section */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Your Invites (2)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
              <Users className="w-8 h-8 text-muted-foreground" />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Invite a Warrior</h3>
                <p className="text-sm text-muted-foreground">Send an invitation to a worthy man</p>
              </div>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Create Invite
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Brotherhood Activity */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle>Brotherhood Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-primary">JT</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground">Jason T.</span>
                </div>
                <p className="text-sm text-muted-foreground">Completed "Forge of Thunder" challenge</p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">CAPABILITY PATHS</h1>
          <p className="text-muted-foreground">Choose your path and forge your legend through disciplined progression</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="strength" className="flex items-center gap-2">
              <span>ᚢ</span>
              Strength
            </TabsTrigger>
            <TabsTrigger value="endurance" className="flex items-center gap-2">
              <span>ᛇ</span>
              Endurance
            </TabsTrigger>
            <TabsTrigger value="clan" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Clan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="strength" className="mt-6">
            {renderPathContent('strength')}
          </TabsContent>

          <TabsContent value="endurance" className="mt-6">
            {renderPathContent('endurance')}
          </TabsContent>

          <TabsContent value="clan" className="mt-6">
            {renderClanContent()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CapabilityPathsPage;