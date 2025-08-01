import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BrotherhoodLike {
  id: string;
  user_id: string;
  activity_id: string;
  created_at: string;
}

interface ActivityLikes {
  [activityId: string]: {
    count: number;
    userHasLiked: boolean;
  };
}

export const useBrotherhoodLikes = (activityIds: string[]) => {
  const [likes, setLikes] = useState<ActivityLikes>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchLikes = async () => {
    if (activityIds.length === 0) {
      setLikes({});
      setIsLoading(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Get all likes for these activities using raw SQL
      const { data: likesData, error } = await supabase.rpc('get_activity_likes', {
        activity_ids: activityIds
      });

      if (error) {
        console.error('Error fetching likes:', error);
        
        // Fallback to direct query if function doesn't exist yet
        const processedLikes: ActivityLikes = {};
        activityIds.forEach(activityId => {
          processedLikes[activityId] = {
            count: 0,
            userHasLiked: false
          };
        });
        setLikes(processedLikes);
        setIsLoading(false);
        return;
      }

      // Process likes data
      const processedLikes: ActivityLikes = {};
      
      activityIds.forEach(activityId => {
        const activityLikes = likesData?.filter((like: any) => like.activity_id === activityId) || [];
        processedLikes[activityId] = {
          count: activityLikes.length,
          userHasLiked: user ? activityLikes.some((like: any) => like.user_id === user.id) : false
        };
      });

      setLikes(processedLikes);
    } catch (error) {
      console.error('Error fetching likes:', error);
      // Initialize with empty data on error
      const processedLikes: ActivityLikes = {};
      activityIds.forEach(activityId => {
        processedLikes[activityId] = {
          count: 0,
          userHasLiked: false
        };
      });
      setLikes(processedLikes);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, [activityIds.join(',')]);

  const toggleLike = async (activityId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const currentLikes = likes[activityId];
      if (!currentLikes) return;

      if (currentLikes.userHasLiked) {
        // Remove like using raw SQL
        const { error } = await supabase.rpc('remove_activity_like', {
          p_activity_id: activityId
        });

        if (error) {
          console.error('Error removing like:', error);
          return;
        }

        // Update local state optimistically
        setLikes(prev => ({
          ...prev,
          [activityId]: {
            count: Math.max(0, prev[activityId].count - 1),
            userHasLiked: false
          }
        }));
      } else {
        // Add like using raw SQL
        const { error } = await supabase.rpc('add_activity_like', {
          p_activity_id: activityId
        });

        if (error) {
          console.error('Error adding like:', error);
          return;
        }

        // Update local state optimistically
        setLikes(prev => ({
          ...prev,
          [activityId]: {
            count: prev[activityId].count + 1,
            userHasLiked: true
          }
        }));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return {
    likes,
    isLoading,
    toggleLike
  };
};