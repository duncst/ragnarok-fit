
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ForgeProgress {
  currentWeek: number;
  totalWeeks: number;
  currentTitle: string;
  progressPercentage: number;
}

// Define titles based on forging weeks completed
const FORGE_TITLES = [
  { minWeeks: 0, title: "Apprentice" },
  { minWeeks: 1, title: "Forge Initiate" },
  { minWeeks: 2, title: "Iron Shaper" },
  { minWeeks: 4, title: "Disciple of Flame" },
  { minWeeks: 6, title: "Steel Forger" },
  { minWeeks: 8, title: "Master Smith" },
  { minWeeks: 10, title: "Forge Master" },
  { minWeeks: 12, title: "Legendary Artisan" },
];

const TOTAL_WEEKS = 12; // Target forging weeks

export const useForgeProgress = () => {
  const { user } = useAuth();

  const { data: forgeProgress, isLoading } = useQuery<ForgeProgress>({
    queryKey: ['forge-progress', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Get all completions (Hero's Call + regular workouts)
      const [heroCallResult, workoutsResult] = await Promise.all([
        supabase
          .from('hero_call_completions')
          .select('completed_at')
          .order('completed_at', { ascending: true }),
        supabase
          .from('workouts')
          .select('end_time')
          .not('end_time', 'is', null)
          .order('end_time', { ascending: true })
      ]);

      if (heroCallResult.error) throw heroCallResult.error;
      if (workoutsResult.error) throw workoutsResult.error;

      // Combine all completion dates
      const allCompletions = [
        ...(heroCallResult.data || []).map(item => ({
          completed_at: item.completed_at
        })),
        ...(workoutsResult.data || []).map(item => ({
          completed_at: item.end_time!
        }))
      ];

      if (allCompletions.length === 0) {
        return {
          currentWeek: 0,
          totalWeeks: TOTAL_WEEKS,
          currentTitle: FORGE_TITLES[0].title,
          progressPercentage: 0,
        };
      }

      // Calculate completed weeks (weeks where user completed 5+ days)
      const weekCounts = new Map<string, Set<string>>();
      
      allCompletions.forEach(completion => {
        const date = new Date(completion.completed_at);
        // Get Monday of the week
        const monday = new Date(date);
        monday.setDate(date.getDate() - (date.getDay() + 6) % 7);
        const weekKey = monday.toISOString().split('T')[0];
        
        const dayKey = date.toISOString().split('T')[0];
        
        if (!weekCounts.has(weekKey)) {
          weekCounts.set(weekKey, new Set());
        }
        weekCounts.get(weekKey)!.add(dayKey);
      });

      // Count weeks with 5+ completions (forged weeks)
      const forgedWeeks = Array.from(weekCounts.values())
        .filter(days => days.size >= 5).length;

      // Determine current title
      let currentTitle = FORGE_TITLES[0].title;
      for (let i = FORGE_TITLES.length - 1; i >= 0; i--) {
        if (forgedWeeks >= FORGE_TITLES[i].minWeeks) {
          currentTitle = FORGE_TITLES[i].title;
          break;
        }
      }

      const progressPercentage = Math.min((forgedWeeks / TOTAL_WEEKS) * 100, 100);

      return {
        currentWeek: forgedWeeks,
        totalWeeks: TOTAL_WEEKS,
        currentTitle,
        progressPercentage,
      };
    },
    enabled: !!user,
  });

  return {
    forgeProgress: forgeProgress || {
      currentWeek: 0,
      totalWeeks: TOTAL_WEEKS,
      currentTitle: FORGE_TITLES[0].title,
      progressPercentage: 0,
    },
    isLoading,
  };
};
