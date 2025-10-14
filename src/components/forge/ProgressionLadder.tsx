import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { Check, Trophy, ChevronDown } from "lucide-react";
import { useForgeData } from "@/hooks/useForgeData";
import { useState } from 'react';

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
  const [isOpen, setIsOpen] = useState(false);
  const { forgeProgress, forgeTitles } = useForgeData();
  
  const progressionLevels: ProgressionLevel[] = forgeTitles.map((title, index) => {
    const isAchieved = forgeProgress.tier >= title.tier;
    const isCurrent = forgeProgress.tier === title.tier;
    
    // Build requirements based on tier
    const requirements = [];
    
    switch (title.tier) {
      case 1: // Sparked
        requirements.push({
          label: "Complete any challenge",
          current: Math.min(forgeProgress.completedChallenges, 1),
          target: 1
        });
        break;
        
      case 2: // Kindled
        requirements.push({
          label: "Complete 1 Forging Week",
          current: Math.min(forgeProgress.currentWeek, 1),
          target: 1
        });
        break;
        
      case 3: // Forge Adept
        requirements.push(
          {
            label: "Complete 3 Forging Weeks",
            current: Math.min(forgeProgress.currentWeek, 3),
            target: 3
          },
          {
            label: "Complete at least one Hero's Call",
            current: forgeProgress.hasHeroCall ? 1 : 0,
            target: 1
          }
        );
        break;
        
      case 4: // Disciple of Flame
        requirements.push(
          {
            label: "Complete 4 Forging Weeks",
            current: Math.min(forgeProgress.currentWeek, 4),
            target: 4
          },
          {
            label: "Complete at least 1 Endurance Activity",
            current: forgeProgress.hasEndurance ? 1 : 0,
            target: 1
          }
        );
        break;
        
      case 5: // Ironbound
        requirements.push(
          {
            label: "Complete 6 Forging Weeks",
            current: Math.min(forgeProgress.currentWeek, 6),
            target: 6
          },
          {
            label: "Complete Hero's Call activity",
            current: forgeProgress.hasHeroCall ? 1 : 0,
            target: 1
          },
          {
            label: "Complete Endurance activity",
            current: forgeProgress.hasEndurance ? 1 : 0,
            target: 1
          },
          {
            label: "Complete Strength activity",
            current: forgeProgress.hasStrength ? 1 : 0,
            target: 1
          }
        );
        break;
        
      case 6: // Ashwalker
        requirements.push(
          {
            label: "Complete 12 Forging Weeks",
            current: Math.min(forgeProgress.currentWeek, 12),
            target: 12
          },
          {
            label: "Complete 1 Valhalla Challenge",
            current: forgeProgress.hasValhalla ? 1 : 0,
            target: 1
          }
        );
        break;
        
      case 7: // Blazeborn
        requirements.push({
          label: "Complete 26 Forging Weeks",
          current: Math.min(forgeProgress.currentWeek, 26),
          target: 26
        });
        break;
        
      case 8: // Unbroken
        requirements.push({
          label: "Complete 52 Forging Weeks",
          current: Math.min(forgeProgress.currentWeek, 52),
          target: 52
        });
        break;
    }
    
    return {
      id: `tier-${title.tier}`,
      title: title.title,
      description: title.description,
      achieved: isAchieved,
      current: isCurrent && !isAchieved,
      requirements: requirements.length > 0 ? requirements : undefined
    };
  });

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
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="bg-card/50 border-border/50">
        <CollapsibleTrigger className="w-full">
          <CardHeader className="hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between w-full">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Your Progression Ladder
              </CardTitle>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            <div className="space-y-0">
              {progressionLevels.map((level, index) => renderProgressionLevel(level, index))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};