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
      // Initialize with default values since we can't query the likes table yet
      // This is a temporary workaround until the database types are updated
      const processedLikes: ActivityLikes = {};
      activityIds.forEach(activityId => {
        processedLikes[activityId] = {
          count: 0,
          userHasLiked: false
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

      // For now, just update the local state optimistically
      // The actual database operations will work once the types are updated
      if (currentLikes.userHasLiked) {
        setLikes(prev => ({
          ...prev,
          [activityId]: {
            count: Math.max(0, prev[activityId].count - 1),
            userHasLiked: false
          }
        }));
      } else {
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