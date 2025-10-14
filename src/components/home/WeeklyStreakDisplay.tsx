import { RUNE_MAP, WEEK_DAYS, DAY_NAMES } from "@/lib/runeConstants";

interface WeeklyStreakDisplayProps {
  completedDays: string[];
  weeklyCount: number;
}

export const WeeklyStreakDisplay = ({ completedDays, weeklyCount }: WeeklyStreakDisplayProps) => {
  const today = new Date();
  const startOfWeek = new Date(today);
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span>This Week's Forge ({weeklyCount}/5 days to forge the week)</span>
      </div>
      <div className="flex items-center justify-center gap-3">
        {WEEK_DAYS.map((dayName, index) => {
          const dayDate = new Date(startOfWeek);
          dayDate.setDate(startOfWeek.getDate() + index);
          const isToday = dayDate.toDateString() === today.toDateString();
          
          const actualDayName = DAY_NAMES[dayDate.getDay()];
          const isCompleted = completedDays.includes(actualDayName);
          
          return (
            <div key={dayName} className="flex flex-col items-center gap-1">
              <div className="text-xs text-muted-foreground">{dayName}</div>
              <div className={`h-8 w-8 flex items-center justify-center text-xl font-bold ${
                isCompleted 
                  ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse' 
                  : 'text-muted-foreground/50'
              }`}>
                {RUNE_MAP[dayName]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
