
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ForgeProgress {
  currentWeek: number;
  totalWeeks: number;
  currentTitle: string;
  progressPercentage: number;
  tier: number;
  completedChallenges: number;
  hasHeroCall: boolean;
  hasEndurance: boolean;
  hasValhalla: boolean;
  hasStrength: boolean;
  differentActivityTypes: number;
}

// Define titles based on new forge progression system
const FORGE_TITLES = [
  { 
    tier: 1, 
    title: "Sparked", 
    description: "The first flicker of will. The ritual begins.",
    requirement: "Complete one Challenge. Any Hero's Call, Endurance, Valhalla Challenge, or Strength Activity."
  },
  { 
    tier: 2, 
    title: "Kindled", 
    description: "The flame grows steady. Routine becomes rhythm.",
    requirement: "1 Forging Week"
  },
  { 
    tier: 3, 
    title: "Forge Adept", 
    description: "Consistency sustained. You are now fire-forged.",
    requirement: "3 Forging Weeks + at least one Hero's Call."
  },
  { 
    tier: 4, 
    title: "Disciple of Flame", 
    description: "The fire now guides you. The path is clear.",
    requirement: "4 Forging Weeks + at least 1 Endurance Activity."
  },
  { 
    tier: 5, 
    title: "Ironbound", 
    description: "No longer wavering. The Forge is your home.",
    requirement: "6 Forging Weeks + 3 different types of Challenge. A Hero's Call, Endurance, and a Strength Activity."
  },
  { 
    tier: 6, 
    title: "Ashwalker", 
    description: "You have endured storms, setbacks, silence—and remained.",
    requirement: "12 Forging Weeks + 1 Valhalla Challenge"
  },
  { 
    tier: 7, 
    title: "Blazeborn", 
    description: "One who walks through fire and emerges stronger. You inspire others.",
    requirement: "26 Forging Weeks"
  },
  { 
    tier: 8, 
    title: "Unbroken", 
    description: "Your fire never dies. You are now a beacon—one who forges others.",
    requirement: "52 Forging Weeks"
  },
];

const TOTAL_WEEKS = 52; // Target forging weeks

export const useForgeProgress = () => {
  const { user } = useAuth();

  const { data: forgeProgress, isLoading } = useQuery<ForgeProgress>({
    queryKey: ['forge-progress', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Get all different activity types
      const [heroCallResult, workoutsResult, runsResult, valhallaResult] = await Promise.all([
        supabase
          .from('hero_call_completions')
          .select('completed_at')
          .order('completed_at', { ascending: true }),
        supabase
          .from('workouts')
          .select('end_time')
          .not('end_time', 'is', null)
          .order('end_time', { ascending: true }),
        supabase
          .from('runs')
          .select('date')
          .order('date', { ascending: true }),
        supabase
          .from('valhalla_challenges')
          .select('completed_at')
          .order('completed_at', { ascending: true })
      ]);

      if (heroCallResult.error) throw heroCallResult.error;
      if (workoutsResult.error) throw workoutsResult.error;
      if (runsResult.error) throw runsResult.error;
      if (valhallaResult.error) throw valhallaResult.error;

      // Check activity types
      const hasHeroCall = (heroCallResult.data || []).length > 0;
      const hasEndurance = (runsResult.data || []).length > 0;
      const hasValhalla = (valhallaResult.data || []).length > 0;
      const hasStrength = (workoutsResult.data || []).length > 0;

      // Count different activity types
      let differentActivityTypes = 0;
      if (hasHeroCall) differentActivityTypes++;
      if (hasEndurance) differentActivityTypes++;
      if (hasStrength) differentActivityTypes++;

      // Total completed challenges
      const completedChallenges = (heroCallResult.data || []).length + 
                                 (workoutsResult.data || []).length + 
                                 (runsResult.data || []).length + 
                                 (valhallaResult.data || []).length;

      // Combine all completion dates for forged weeks calculation
      const allCompletions = [
        ...(heroCallResult.data || []).map(item => ({ completed_at: item.completed_at })),
        ...(workoutsResult.data || []).map(item => ({ completed_at: item.end_time! })),
        ...(runsResult.data || []).map(item => ({ completed_at: item.date })),
        ...(valhallaResult.data || []).map(item => ({ completed_at: item.completed_at }))
      ];

      // Calculate forged weeks (weeks with 5+ activities)
      const weekCounts = new Map<string, number>();
      
      allCompletions.forEach(completion => {
        const date = new Date(completion.completed_at);
        const monday = new Date(date);
        monday.setDate(date.getDate() - (date.getDay() + 6) % 7);
        const weekKey = monday.toISOString().split('T')[0];
        
        weekCounts.set(weekKey, (weekCounts.get(weekKey) || 0) + 1);
      });

      const forgedWeeks = Array.from(weekCounts.values())
        .filter(count => count >= 5).length;

      // Determine current tier and title based on complex requirements
      let currentTier = 1;
      let currentTitle = FORGE_TITLES[0].title;

      // Tier 1: Sparked - Complete one challenge
      if (completedChallenges >= 1) {
        currentTier = 1;
        currentTitle = FORGE_TITLES[0].title;
      }

      // Tier 2: Kindled - 1 Forging Week
      if (forgedWeeks >= 1) {
        currentTier = 2;
        currentTitle = FORGE_TITLES[1].title;
      }

      // Tier 3: Forge Adept - 3 Forging Weeks + at least one Hero's Call
      if (forgedWeeks >= 3 && hasHeroCall) {
        currentTier = 3;
        currentTitle = FORGE_TITLES[2].title;
      }

      // Tier 4: Disciple of Flame - 4 Forging Weeks + at least 1 Endurance Activity
      if (forgedWeeks >= 4 && hasEndurance) {
        currentTier = 4;
        currentTitle = FORGE_TITLES[3].title;
      }

      // Tier 5: Ironbound - 6 Forging Weeks + 3 different types (Hero's Call, Endurance, Strength)
      if (forgedWeeks >= 6 && hasHeroCall && hasEndurance && hasStrength) {
        currentTier = 5;
        currentTitle = FORGE_TITLES[4].title;
      }

      // Tier 6: Ashwalker - 12 Forging Weeks + 1 Valhalla Challenge
      if (forgedWeeks >= 12 && hasValhalla) {
        currentTier = 6;
        currentTitle = FORGE_TITLES[5].title;
      }

      // Tier 7: Blazeborn - 26 Forging Weeks
      if (forgedWeeks >= 26) {
        currentTier = 7;
        currentTitle = FORGE_TITLES[6].title;
      }

      // Tier 8: Unbroken - 52 Forging Weeks
      if (forgedWeeks >= 52) {
        currentTier = 8;
        currentTitle = FORGE_TITLES[7].title;
      }

      const progressPercentage = Math.min((forgedWeeks / TOTAL_WEEKS) * 100, 100);

      return {
        currentWeek: forgedWeeks,
        totalWeeks: TOTAL_WEEKS,
        currentTitle,
        progressPercentage,
        tier: currentTier,
        completedChallenges,
        hasHeroCall,
        hasEndurance,
        hasValhalla,
        hasStrength,
        differentActivityTypes,
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
      tier: 1,
      completedChallenges: 0,
      hasHeroCall: false,
      hasEndurance: false,
      hasValhalla: false,
      hasStrength: false,
      differentActivityTypes: 0,
    },
    isLoading,
  };
};
