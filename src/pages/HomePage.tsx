
import { DailyInvocation } from "@/components/DailyInvocation";
import { BodyMetricsTracker } from "@/components/BodyMetricsTracker";
import { AnalyticsSection } from "@/components/home/AnalyticsSection";
import { WeeklyTargets } from "@/components/home/WeeklyTargets";
import { WeeklyStreakDisplay } from "@/components/home/WeeklyStreakDisplay";
import HeroCallOnboarding from "@/components/home/HeroCallOnboarding";
import { useHomePageData } from "@/hooks/useHomePageData";
import { useHeroCallOnboarding } from "@/hooks/useHeroCallOnboarding";
import { useForgeProgress } from "@/hooks/useForgeProgress";
import { useHeroCallData } from "@/hooks/useHeroCallData";

const HomePage = () => {
  const {
    workoutHistory,
    runHistory,
    isLoading,
    strengthChartData,
    runChartData,
    workoutsThisWeek,
    runsThisWeek,
    last7DaysDistance,
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
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Welcome back, {forgeProgress.currentTitle}!</h1>
          
          {/* Weekly Progress */}
          <WeeklyStreakDisplay 
            completedDays={stats.completedDays} 
            weeklyCount={stats.weeklyCount} 
          />
      </div>
    </div>

    <WeeklyTargets
        weeklyDistance={last7DaysDistance}
        workoutHistory={workoutHistory}
      />
      
      {showHeroCallOnboarding ? (
        <HeroCallOnboarding 
          onDismiss={dismissHeroCallOnboarding}
          onStartChallenge={handleStartChallenge}
        />
      ) : (
        <DailyInvocation />
      )}
      
      <BodyMetricsTracker />
    </div>
  );
};

export default HomePage;
