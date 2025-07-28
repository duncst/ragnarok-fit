
import { DailyInvocation } from "@/components/DailyInvocation";
import { BodyMetricsTracker } from "@/components/BodyMetricsTracker";
import { ActionButtons } from "@/components/home/ActionButtons";
import { AnalyticsSection } from "@/components/home/AnalyticsSection";
import HeroCallOnboarding from "@/components/home/HeroCallOnboarding";
import { useHomePageData } from "@/hooks/useHomePageData";
import { useHeroCallOnboarding } from "@/hooks/useHeroCallOnboarding";
import { useForgeProgress } from "@/hooks/useForgeProgress";
import { useHeroCallData } from "@/hooks/useHeroCallData";
import { CalendarCheck } from "lucide-react";

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
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>This Week's Forge ({stats.weeklyCount}/5 days to forge the week)</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              {(() => {
                const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                const today = new Date();
                const startOfWeek = new Date(today);
                const day = today.getDay();
                const diff = today.getDate() - day + (day === 0 ? -6 : 1);
                startOfWeek.setDate(diff);
                startOfWeek.setHours(0, 0, 0, 0);
                
                return weekDays.map((dayName, index) => {
                  const dayDate = new Date(startOfWeek);
                  dayDate.setDate(startOfWeek.getDate() + index);
                  const isToday = dayDate.toDateString() === today.toDateString();
                  const isPast = dayDate < today;
                  
                  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                  const dayIndex = index === 6 ? 0 : index + 1;
                  const completedDayName = dayNames[dayIndex];
                  const isCompleted = stats.completedDays?.includes(completedDayName) || false;
                  
                  const runeMap = {
                    'Mon': 'ᚱ',
                    'Tue': 'ᚢ',
                    'Wed': 'ᚦ',
                    'Thu': 'ᚨ',
                    'Fri': 'ᛏ',
                    'Sat': 'ᛜ',
                    'Sun': 'ᛉ'
                  };
                  
                  return (
                    <div key={dayName} className="flex flex-col items-center gap-1">
                      <div className="text-xs text-muted-foreground">{dayName}</div>
                      <div className={`h-8 w-8 flex items-center justify-center text-xl font-bold ${
                        isCompleted 
                          ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse' 
                          : 'text-muted-foreground/50'
                      }`}>
                        {runeMap[dayName]}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
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
        <DailyInvocation />
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
        last7DaysDistance={last7DaysDistance}
        totalVolume={totalVolume}
        totalDistance={totalDistance}
        bestPace={bestPace}
      />
      
      <BodyMetricsTracker />
    </div>
  );
};

export default HomePage;
