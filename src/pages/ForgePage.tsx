
import React from 'react';
import { ForgeStatsGrid } from '@/components/forge/ForgeStatsGrid';
import { ProgressionLadder } from '@/components/forge/ProgressionLadder';
import { AnalyticsSection } from '@/components/home/AnalyticsSection';
import { useHomePageData } from '@/hooks/useHomePageData';

const ForgePage = () => {
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

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-primary">The Forge</h1>
        <p className="text-lg text-muted-foreground">
          Your journey of transformation. Each challenge shapes your legend.
        </p>
      </div>

      {/* Stats Grid */}
      <ForgeStatsGrid />

      {/* Progression Ladder */}
      <ProgressionLadder />

      {/* Your Saga Section */}
      <AnalyticsSection
        workoutHistory={workoutHistory}
        runHistory={runHistory}
        totalPRs={totalPRs}
        isLoading={isLoading}
        strengthChartData={strengthChartData}
        runChartData={runChartData}
        workoutsThisWeek={workoutsThisWeek}
        runsThisWeek={runsThisWeek}
        last7DaysDistance={last7DaysDistance}
        totalVolume={totalVolume}
        totalDistance={totalDistance}
        bestPace={bestPace}
      />

      {/* Footer Quote */}
      <div className="text-center space-y-4 pt-8">
        <h2 className="text-xl font-semibold text-primary">
          The forge awaits your next offering
        </h2>
        <div className="space-y-2">
          <p className="text-lg font-medium text-foreground italic">
            Every hammer strike upon the anvil of discipline shapes not just your body, but your legend.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgePage;
