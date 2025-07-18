
import React from 'react';
import { Accordion } from '@/components/ui/accordion';
import ForgeProgressSection from '@/components/forge/ForgeProgressSection';
import BeholdYourDeedsSection from '@/components/forge/BeholdYourDeedsSection';
import ForgeQuoteSection from '@/components/forge/ForgeQuoteSection';
import ValhallaPreviewSection from '@/components/forge/ValhallaPreviewSection';
import { AnalyticsSection } from '@/components/home/AnalyticsSection';
import { useHomePageData } from '@/hooks/useHomePageData';

const ForgePage = () => {
  const {
    workoutHistory,
    runHistory,
    totalPRs,
    isLoading,
    strengthChartData,
    runChartData,
    workoutsThisWeek,
    runsThisWeek,
    totalVolume,
    totalDistance,
    bestPace
  } = useHomePageData();

  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={["daily-progress"]} className="w-full space-y-4">
        <ForgeProgressSection />
      </Accordion>

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

      <Accordion type="multiple" defaultValue={["monthly-calendar"]} className="w-full space-y-4">
        <BeholdYourDeedsSection />
      </Accordion>

      <ForgeQuoteSection />
      <ValhallaPreviewSection />
    </div>
  );
};

export default ForgePage;
