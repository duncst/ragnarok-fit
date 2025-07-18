import { Card, CardContent } from "@/components/ui/card";
import { useForgeData } from "@/hooks/useForgeData";
import { useChallengeCount, useActiveDaysCount } from "@/hooks/useChallengeCount";
import { Skeleton } from "@/components/ui/skeleton";

export const ForgeStatsGrid = () => {
  const { forgeProgress, isLoading: forgeLoading } = useForgeData();
  const { challengeCount, isLoading: challengeLoading } = useChallengeCount();
  const { activeDaysCount, isLoading: activeDaysLoading } = useActiveDaysCount();
  
  const isLoading = forgeLoading || challengeLoading || activeDaysLoading;

  const stats_data = [
    {
      value: forgeProgress.currentWeek || 0,
      label: "Total Forging Weeks",
      className: "text-primary"
    },
    {
      value: forgeProgress.currentWeek || 0,
      label: "Current Streak",
      suffix: "WEEKS",
      className: "text-primary"
    },
    {
      value: challengeCount || 0,
      label: "Challenges Completed",
      className: "text-primary"
    },
    {
      value: activeDaysCount || 0,
      label: "You Answered the Call",
      suffix: "DAYS",
      className: "text-primary"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-card/50 border-border/50">
            <CardContent className="p-6 text-center">
              <Skeleton className="h-8 w-16 mx-auto mb-2" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      {stats_data.map((stat, index) => (
        <Card key={index} className="bg-card/50 border-border/50 hover:bg-card/70 transition-colors">
          <CardContent className="p-6 text-center">
            {stat.suffix && (
              <div className="text-xs text-primary font-medium mb-1">
                {stat.suffix}
              </div>
            )}
            <div className="text-3xl font-bold text-primary mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground">
              {stat.label}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};