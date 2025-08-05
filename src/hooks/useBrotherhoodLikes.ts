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

      // Query the likes table using raw SQL since the table isn't in the types yet
      const { data: likesData, error } = await supabase
        .from('brotherhood_activity_likes' as any)
        .select('*')
        .in('activity_id', activityIds);

      if (error) {
        throw error;
      }

      // Process the likes data
      const processedLikes: ActivityLikes = {};
      
      // Initialize all activities with 0 likes
      activityIds.forEach(activityId => {
        processedLikes[activityId] = {
          count: 0,
          userHasLiked: false
        };
      });

      // Count likes and check if user has liked each activity
      if (Array.isArray(likesData)) {
        likesData.forEach((like: any) => {
          const activityId = like.activity_id;
          if (processedLikes[activityId]) {
            processedLikes[activityId].count += 1;
            if (like.user_id === user.id) {
              processedLikes[activityId].userHasLiked = true;
            }
          }
        });
      }

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

        // Remove like from database
        const { error } = await supabase
          .from('brotherhood_activity_likes' as any)
          .delete()
          .eq('user_id', user.id)
          .eq('activity_id', activityId);

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

        // Add like to database
        const { error } = await supabase
          .from('brotherhood_activity_likes' as any)
          .insert([{
            user_id: user.id,
            activity_id: activityId
          }]);

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