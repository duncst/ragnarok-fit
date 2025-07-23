import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useForgedWeekCelebration = () => {
  const { user } = useAuth();
  const [showCelebration, setShowCelebration] = useState(false);
  const [newlyForgedWeek, setNewlyForgedWeek] = useState<number>(0);

  const checkForNewForgedWeek = async () => {
    if (!user) return;

    try {
      // Get all completions for this week
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() + 6) % 7);
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      const [heroCallResult, workoutsResult, runsResult, valhallaResult] = await Promise.all([
        supabase
          .from('hero_call_completions')
          .select('completed_at')
          .gte('completed_at', startOfWeek.toISOString())
          .lte('completed_at', endOfWeek.toISOString()),
        supabase
          .from('workouts')
          .select('end_time')
          .not('end_time', 'is', null)
          .gte('end_time', startOfWeek.toISOString())
          .lte('end_time', endOfWeek.toISOString()),
        supabase
          .from('runs')
          .select('date')
          .gte('date', startOfWeek.toISOString())
          .lte('date', endOfWeek.toISOString()),
        supabase
          .from('valhalla_challenges')
          .select('completed_at')
          .gte('completed_at', startOfWeek.toISOString())
          .lte('completed_at', endOfWeek.toISOString())
      ]);

      if (heroCallResult.error || workoutsResult.error || runsResult.error || valhallaResult.error) return;

      // Count unique days this week
      const completionDates = new Set<string>();
      
      (heroCallResult.data || []).forEach(item => {
        const date = new Date(item.completed_at).toISOString().split('T')[0];
        completionDates.add(date);
      });
      
      (workoutsResult.data || []).forEach(item => {
        const date = new Date(item.end_time!).toISOString().split('T')[0];
        completionDates.add(date);
      });
      
      (runsResult.data || []).forEach(item => {
        const date = new Date(item.date).toISOString().split('T')[0];
        completionDates.add(date);
      });
      
      (valhallaResult.data || []).forEach(item => {
        const date = new Date(item.completed_at).toISOString().split('T')[0];
        completionDates.add(date);
      });

      // If we just hit 5 days, check if this is a new forge week
      if (completionDates.size === 5) {
        // Check if we already celebrated this week
        const celebrationKey = `forged_week_${startOfWeek.toISOString().split('T')[0]}`;
        const alreadyCelebrated = localStorage.getItem(celebrationKey);
        
        if (!alreadyCelebrated) {
          // Calculate total forged weeks to show the week number
          const [allHeroCallResult, allWorkoutsResult, allRunsResult, allValhallaResult] = await Promise.all([
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

          if (allHeroCallResult.error || allWorkoutsResult.error || allRunsResult.error || allValhallaResult.error) return;

          // Calculate all forged weeks
          const allCompletions = [
            ...(allHeroCallResult.data || []).map(item => ({ completed_at: item.completed_at })),
            ...(allWorkoutsResult.data || []).map(item => ({ completed_at: item.end_time! })),
            ...(allRunsResult.data || []).map(item => ({ completed_at: item.date })),
            ...(allValhallaResult.data || []).map(item => ({ completed_at: item.completed_at }))
          ];

          const weekCounts = new Map<string, Set<string>>();
          
          allCompletions.forEach(completion => {
            const date = new Date(completion.completed_at);
            const monday = new Date(date);
            monday.setDate(date.getDate() - (date.getDay() + 6) % 7);
            const weekKey = monday.toISOString().split('T')[0];
            const dayKey = date.toISOString().split('T')[0];
            
            if (!weekCounts.has(weekKey)) {
              weekCounts.set(weekKey, new Set());
            }
            weekCounts.get(weekKey)!.add(dayKey);
          });

          const forgedWeeksCount = Array.from(weekCounts.values())
            .filter(days => days.size >= 5).length;

          setNewlyForgedWeek(forgedWeeksCount);
          setShowCelebration(true);
          localStorage.setItem(celebrationKey, 'true');
        }
      }
    } catch (error) {
      console.error('Error checking for forged week:', error);
    }
  };

  const closeCelebration = () => {
    setShowCelebration(false);
  };

  return {
    showCelebration,
    newlyForgedWeek,
    checkForNewForgedWeek,
    closeCelebration
  };
};