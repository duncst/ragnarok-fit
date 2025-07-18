import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, Trophy } from "lucide-react";
import { useHeroCallData } from "@/hooks/useHeroCallData";
import { useForgeData } from "@/hooks/useForgeData";
import { useChallengeCount } from "@/hooks/useChallengeCount";

interface ProgressionLevel {
  id: string;
  title: string;
  description: string;
  achieved: boolean;
  current: boolean;
  requirements?: Array<{
    label: string;
    current: number;
    target: number;
  }>;
}

export const ProgressionLadder = () => {
  const { stats } = useHeroCallData();
  const { forgeProgress } = useForgeData();
  const { challengeCount } = useChallengeCount();
  
  const progressionLevels: ProgressionLevel[] = [
    {
      id: "sparked",
      title: "Sparked",
      description: "The journey begins. You have answered the call.",
      achieved: challengeCount > 0,
      current: false,
    },
    {
      id: "ember-soul",
      title: "Ember Soul",
      description: "The fire grows. You have completed 10 challenges.",
      achieved: challengeCount >= 10,
      current: false,
    },
    {
      id: "iron-soul",
      title: "Iron Soul",
      description: "Your will hardens. You have completed 25 challenges and 3 capability tiers.",
      achieved: false,
      current: challengeCount < 25 && challengeCount >= 1,
      requirements: [
        {
          label: "Complete 25 daily challenges",
          current: Math.min(challengeCount, 25),
          target: 25,
        },
        {
          label: "Reach Tier 3 in any capability",
          current: 0,
          target: 3,
        },
        {
          label: "Complete 5 consecutive days",
          current: Math.min(stats.currentStreak, 5),
          target: 5,
        },
      ],
    },
    {
      id: "steel-heart",
      title: "Steel Heart",
      description: "Your dedication is unwavering. Master multiple paths.",
      achieved: false,
      current: false,
      requirements: [
        {
          label: "Complete Tier 2 in 3 different capabilities",
          current: 0,
          target: 3,
        },
        {
          label: "Maintain a 14-day workout streak",
          current: Math.min(stats.currentStreak, 14),
          target: 14,
        },
        {
          label: "Complete 50 total challenges",
          current: Math.min(challengeCount, 50),
          target: 50,
        },
      ],
    },
    {
      id: "forge-master",
      title: "Forge Master",
      description: "You have become legend. The forge bends to your will.",
      achieved: false,
      current: false,
      requirements: [
        {
          label: "Reach Tier 4 in all capability paths",
          current: 0,
          target: 5,
        },
        {
          label: "Maintain a 30-day workout streak",
          current: Math.min(stats.currentStreak, 30),
          target: 30,
        },
        {
          label: "Complete 100 total challenges",
          current: Math.min(challengeCount, 100),
          target: 100,
        },
      ],
    },
  ];

  const renderProgressionLevel = (level: ProgressionLevel, index: number) => {
    const isLast = index === progressionLevels.length - 1;
    
    return (
      <div key={level.id} className="flex items-start gap-4">
        {/* Progress Indicator */}
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
            level.achieved 
              ? 'bg-primary border-primary text-primary-foreground' 
              : level.current
              ? 'bg-primary/20 border-primary text-primary'
              : 'bg-background border-muted-foreground text-muted-foreground'
          }`}>
            {level.achieved ? <Check className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-current" />}
          </div>
          {!isLast && (
            <div className={`w-0.5 h-16 ${
              level.achieved ? 'bg-primary' : 'bg-muted-foreground/30'
            }`} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 pb-8">
          <div className="flex items-center gap-2 mb-2">
            <h3 className={`text-lg font-semibold ${
              level.achieved ? 'text-primary' : level.current ? 'text-primary' : 'text-muted-foreground'
            }`}>
              {level.title}
            </h3>
            {level.achieved && <div className="text-xs text-muted-foreground">Achieved 2024-01-15</div>}
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            {level.description}
          </p>

          {/* Requirements */}
          {level.requirements && level.current && (
            <Card className="bg-card/30 border-border/50">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-primary">
                    {Math.round((level.requirements.reduce((acc, req) => acc + (req.current / req.target), 0) / level.requirements.length) * 100)}%
                  </span>
                </div>
                <Progress 
                  value={(level.requirements.reduce((acc, req) => acc + (req.current / req.target), 0) / level.requirements.length) * 100} 
                  className="h-2 bg-muted"
                />
                
                {level.requirements.map((req, reqIndex) => (
                  <div key={reqIndex} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{req.label}</span>
                    <span className="text-primary font-medium">
                      {req.current}/{req.target}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {level.requirements && !level.current && !level.achieved && (
            <div className="space-y-2">
              {level.requirements.map((req, reqIndex) => (
                <div key={reqIndex} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{req.label}</span>
                  <span className="text-muted-foreground">
                    {req.current}/{req.target}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Your Progression Ladder
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {progressionLevels.map((level, index) => renderProgressionLevel(level, index))}
        </div>
      </CardContent>
    </Card>
  );
};