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
      
      // Initialize with default values for now
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

      if (currentLikes.userHasLiked) {
        // Update local state optimistically for now
        setLikes(prev => ({
          ...prev,
          [activityId]: {
            count: Math.max(0, prev[activityId].count - 1),
            userHasLiked: false
          }
        }));
      } else {
        // Update local state optimistically for now
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