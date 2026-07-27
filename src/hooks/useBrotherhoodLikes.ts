import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data: likesData, error } = await supabase
        .rpc('get_activity_likes', { activity_ids: activityIds });

      if (error) {
        throw error;
      }

      const processedLikes: ActivityLikes = {};

      activityIds.forEach(activityId => {
        processedLikes[activityId] = {
          count: 0,
          userHasLiked: false
        };
      });

      (likesData || []).forEach((like) => {
        const activityId = like.activity_id;
        if (processedLikes[activityId]) {
          processedLikes[activityId].count += 1;
          if (like.user_id === user.id) {
            processedLikes[activityId].userHasLiked = true;
          }
        }
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

      // Update local state optimistically
      if (currentLikes.userHasLiked) {
        setLikes(prev => ({
          ...prev,
          [activityId]: {
            count: Math.max(0, prev[activityId].count - 1),
            userHasLiked: false
          }
        }));

        const { error } = await supabase.rpc('remove_activity_like', { p_activity_id: activityId });

        if (error) {
          console.error('Error removing like:', error);
          // Revert optimistic update on error
          setLikes(prev => ({
            ...prev,
            [activityId]: {
              count: prev[activityId].count + 1,
              userHasLiked: true
            }
          }));
        }
      } else {
        setLikes(prev => ({
          ...prev,
          [activityId]: {
            count: prev[activityId].count + 1,
            userHasLiked: true
          }
        }));

        const { error } = await supabase.rpc('add_activity_like', { p_activity_id: activityId });

        if (error) {
          console.error('Error adding like:', error);
          // Revert optimistic update on error
          setLikes(prev => ({
            ...prev,
            [activityId]: {
              count: Math.max(0, prev[activityId].count - 1),
              userHasLiked: false
            }
          }));
        }
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
