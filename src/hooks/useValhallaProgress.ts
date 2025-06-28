
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from 'sonner';

interface ValhallaResult {
  challenge_id: string;
  tier: 'Adept' | 'Warrior' | 'Berserker';
  rune_name: string;
  is_new_rune: boolean;
  is_tier_upgrade: boolean;
  completion_time_minutes: number;
}

interface ValhallaRune {
  challenge_name: string;
  rune_name: string;
  highest_tier: 'Adept' | 'Warrior' | 'Berserker';
  first_earned_at: string;
  last_updated_at: string;
}

interface BestTime {
  best_time_minutes: number;
  best_tier: 'Adept' | 'Warrior' | 'Berserker';
  total_attempts: number;
  last_attempt: string;
}

interface ValhallaProgress {
  runes: ValhallaRune[];
  best_times: Record<string, BestTime>;
}

export const useValhallaProgress = () => {
  const queryClient = useQueryClient();

  const { data: progress, isLoading } = useQuery({
    queryKey: ['valhalla_progress'],
    queryFn: async (): Promise<ValhallaProgress> => {
      const { data, error } = await supabase.rpc('get_valhalla_progress');
      if (error) throw error;
      return data;
    },
  });

  const recordChallengeMutation = useMutation({
    mutationFn: async (params: {
      challenge_name: string;
      completion_time_minutes: number;
      notes?: string;
    }): Promise<ValhallaResult> => {
      const { data, error } = await supabase.rpc('record_valhalla_challenge', {
        p_challenge_name: params.challenge_name,
        p_completion_time_minutes: params.completion_time_minutes,
        p_notes: params.notes,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['valhalla_progress'] });
      
      // Show ceremonial completion message
      if (result.is_new_rune) {
        sonnerToast.success(`${result.rune_name} Earned!`, {
          description: `You faced ${result.challenge_name} and did not yield. You are ${result.tier} of the Forge.`,
          duration: 5000,
        });
      } else if (result.is_tier_upgrade) {
        sonnerToast.success(`Tier Upgraded!`, {
          description: `Your sweat has forged steel. You are now ${result.tier}. Wear this Rune with pride.`,
          duration: 5000,
        });
      } else {
        sonnerToast.success('Challenge Complete!', {
          description: `${result.challenge_name} completed in ${result.completion_time_minutes} minutes as ${result.tier}.`,
        });
      }
    },
    onError: (error) => {
      sonnerToast.error('Failed to record challenge', {
        description: (error as Error).message,
      });
    },
  });

  return {
    progress,
    isLoading,
    recordChallenge: recordChallengeMutation.mutate,
    isRecording: recordChallengeMutation.isPending,
  };
};
