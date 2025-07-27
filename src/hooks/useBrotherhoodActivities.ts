import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BrotherhoodActivity {
  id: string;
  user_id: string;
  activity_type: string;
  activity_description: string;
  challenge_name?: string;
  created_at: string;
  banner_name?: string;
}

export const useBrotherhoodActivities = () => {
  const [activities, setActivities] = useState<BrotherhoodActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      // First get activities
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('brotherhood_activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (activitiesError) {
        console.error('Error fetching brotherhood activities:', activitiesError);
        return;
      }

      if (!activitiesData || activitiesData.length === 0) {
        setActivities([]);
        return;
      }

      // Get user IDs
      const userIds = [...new Set(activitiesData.map(activity => activity.user_id))];

      // Get profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, banner_name')
        .in('user_id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        setActivities(activitiesData.map(activity => ({ ...activity, banner_name: 'Unknown Warrior' })));
        return;
      }

      // Create a map of user_id to banner_name
      const profileMap = new Map(profilesData?.map(p => [p.user_id, p.banner_name]) || []);

      // Combine activities with banner names
      const activitiesWithNames = activitiesData.map(activity => ({
        ...activity,
        banner_name: profileMap.get(activity.user_id) || 'Unknown Warrior'
      }));

      setActivities(activitiesWithNames);
    } catch (error) {
      console.error('Error fetching brotherhood activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();

    // Set up real-time subscription for new activities
    const channel = supabase
      .channel('brotherhood-activities')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'brotherhood_activities'
        },
        () => {
          fetchActivities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addActivity = async (activityType: string, description: string, challengeName?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('brotherhood_activities')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          activity_description: description,
          challenge_name: challengeName
        });

      if (error) {
        console.error('Error adding brotherhood activity:', error);
      }
    } catch (error) {
      console.error('Error adding brotherhood activity:', error);
    }
  };

  return {
    activities,
    isLoading,
    addActivity
  };
};