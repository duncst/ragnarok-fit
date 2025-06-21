
import { HeroCall } from "@/components/HeroCall";
import { RecentActivity } from "@/components/RecentActivity";
import { BodyMetricsTracker } from "@/components/BodyMetricsTracker";
import { ActionButtons } from "@/components/home/ActionButtons";
import { AnalyticsSection } from "@/components/home/AnalyticsSection";
import { PersonalRecordsSection } from "@/components/home/PersonalRecordsSection";
import { useHomePageData } from "@/hooks/useHomePageData";

const HomePage = () => {
  const {
    workoutHistory,
    runHistory,
    personalRecords,
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

  return (
    <div className="space-y-6">
      <ActionButtons />
      
      <HeroCall />
      
      <RecentActivity />

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
      
      <PersonalRecordsSection
        personalRecords={personalRecords}
        isLoading={isLoading}
      />
    </div>
  );
};

export default HomePage;
