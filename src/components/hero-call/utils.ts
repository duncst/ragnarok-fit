
import { HeroCallWorkout, workoutTemplates } from './WorkoutTemplates';

export const getDailyWorkout = (): HeroCallWorkout => {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return workoutTemplates[dayOfYear % workoutTemplates.length];
};

// Legacy functions kept for backward compatibility but now deprecated
// These will be replaced by the new useHeroCallData hook
export const getStreakData = () => {
  console.warn('getStreakData is deprecated. Use useHeroCallData hook instead.');
  const stored = localStorage.getItem('heroCallStreak');
  if (stored) {
    const data = JSON.parse(stored);
    const today = new Date().toDateString();
    const lastCompleted = new Date(data.lastCompleted).toDateString();
    
    // Reset if more than 2 days have passed
    if (new Date().getTime() - new Date(data.lastCompleted).getTime() > 2 * 24 * 60 * 60 * 1000) {
      return { currentStreak: 0, weeklyCount: 0, lastCompleted: null };
    }
    
    return data;
  }
  return { currentStreak: 0, weeklyCount: 0, lastCompleted: null };
};

export const updateStreak = () => {
  console.warn('updateStreak is deprecated. Use useHeroCallData hook instead.');
  const today = new Date();
  const streakData = getStreakData();
  const todayString = today.toDateString();
  
  // Don't update if already completed today
  if (streakData.lastCompleted && new Date(streakData.lastCompleted).toDateString() === todayString) {
    return streakData;
  }
  
  // Calculate days in current week (Monday to Sunday)
  const startOfWeek = new Date(today);
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);
  
  // Reset weekly count if it's a new week
  const lastCompletedDate = streakData.lastCompleted ? new Date(streakData.lastCompleted) : null;
  let weeklyCount = streakData.weeklyCount;
  
  if (!lastCompletedDate || lastCompletedDate < startOfWeek) {
    weeklyCount = 0;
  }
  
  const newData = {
    currentStreak: streakData.currentStreak + 1,
    weeklyCount: weeklyCount + 1,
    lastCompleted: today.toISOString()
  };
  
  localStorage.setItem('heroCallStreak', JSON.stringify(newData));
  return newData;
};
