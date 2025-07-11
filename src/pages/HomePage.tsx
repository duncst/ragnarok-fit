
import { HeroCall } from "@/components/HeroCall";
import { BodyMetricsTracker } from "@/components/BodyMetricsTracker";
import { ActionButtons } from "@/components/home/ActionButtons";
import { AnalyticsSection } from "@/components/home/AnalyticsSection";
import HeroCallOnboarding from "@/components/home/HeroCallOnboarding";
import { useHomePageData } from "@/hooks/useHomePageData";
import { useHeroCallOnboarding } from "@/hooks/useHeroCallOnboarding";
import { useForgeProgress } from "@/hooks/useForgeProgress";
import { useHeroCallData } from "@/hooks/useHeroCallData";
import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";

const HomePage = () => {
  const {
    workoutHistory,
    runHistory,
    isLoading,
    strengthChartData,
    runChartData,
    workoutsThisWeek,
    runsThisWeek,
    totalVolume,
    totalDistance,
    bestPace,
    totalPRs
  } = useHomePageData();

  const { showHeroCallOnboarding, dismissHeroCallOnboarding } = useHeroCallOnboarding();
  const { forgeProgress } = useForgeProgress();
  const { stats } = useHeroCallData();

  const handleStartChallenge = () => {
    dismissHeroCallOnboarding();
    // The regular Hero's Call will appear after dismissing onboarding
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Welcome back, Warrior!</h1>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Flame className="h-3 w-3" />
              {forgeProgress.currentTitle}
            </Badge>
            {stats.currentStreak > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                🔥 {stats.currentStreak} day streak
              </Badge>
            )}
          </div>
        </div>
      </div>

      <ActionButtons />
      
      {showHeroCallOnboarding ? (
        <HeroCallOnboarding 
          onDismiss={dismissHeroCallOnboarding}
          onStartChallenge={handleStartChallenge}
        />
      ) : (
        <HeroCall />
      )}
      
      <AnalyticsSection
        workoutHistory={workoutHistory}
        runHistory={runHistory}
        totalPRs={totalPRs}
        isLoading={isLoading}
        strengthChartData={strengthChartData}
        runChartData={runChartData}
        workoutsThisWeek={workoutsThisWeek}
        runsThisWeek={runsThisWeek}
        totalVolume={totalVolume}
        totalDistance={totalDistance}
        bestPace={bestPace}
      />
      
      <BodyMetricsTracker />
    </div>
  );
};

export default HomePage;
