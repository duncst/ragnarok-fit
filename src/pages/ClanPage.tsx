import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Award, Swords, MoreHorizontal, Crown, Flame, Zap, Shield, Heart } from 'lucide-react';
import { useBrotherhoodActivities } from '@/hooks/useBrotherhoodActivities';
import { useBrotherhoodLikes } from '@/hooks/useBrotherhoodLikes';
import { useBannerName } from '@/hooks/useBannerName';
import { useForgeData } from '@/hooks/useForgeData';
import { formatDistanceToNow } from 'date-fns';
import { ImageIcon } from '@/components/ImageIcon';

const ClanPage = () => {
  const { activities, isLoading } = useBrotherhoodActivities();
  const { bannerName } = useBannerName();
  const { forgeProgress } = useForgeData();
  const activityIds = activities.map(activity => activity.id);
  const { likes, toggleLike } = useBrotherhoodLikes(activityIds);

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'valhalla_challenge':
        return <Swords className="w-4 h-4 text-primary" />;
      case 'hero_call':
        return <Award className="w-4 h-4 text-primary" />;
      default:
        return <Award className="w-4 h-4 text-primary" />;
    }
  };

  const getBannerInitials = (name?: string) => {
    if (!name) return 'UW';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const getUserTitle = (activityUserId?: string) => {
    // For the current user, use their actual forge title
    // For other users, we would need to fetch their individual forge progress
    // For now, use the current user's title as a fallback
    return forgeProgress.currentTitle || 'Adept';
  };

  const formatActivityTitle = (activity: any) => {
    if (activity.activity_type === 'valhalla_challenge') {
      return `Conquered ${activity.challenge_name || 'RAGNARÖK'} Challenge!`;
    } else if (activity.activity_type === 'hero_call') {
      return `Forged a 15-Day Streak!`;
    }
    return activity.activity_description;
  };

  const formatActivitySubtitle = (activity: any) => {
    if (activity.activity_type === 'valhalla_challenge') {
      return 'Completed the ultimate 40-minute trial in 38:42';
    } else if (activity.activity_type === 'hero_call') {
      return 'Unwavering discipline breeds legendary strength';
    }
    // For regular activities, show notes if different from activity_description, otherwise show nothing
    return activity.notes && activity.notes !== activity.activity_description ? activity.notes : null;
  };

  const formatActivityDetails = (activity: any) => {
    if (activity.activity_type === 'valhalla_challenge') {
      return '150 burpees, 100 push-ups, 200 air squats, 300 mountain climbers, 250 jumping lunges';
    } else if (activity.activity_type === 'hero_call') {
      return null; // Will show streak badge instead
    }
    // For other activity types, don't show details if they're the same as subtitle
    return null;
  };

  const getReactionButtons = () => [
    { icon: <ImageIcon src="/lovable-uploads/87f4cc20-755c-412f-a511-4ea9911896fd.png" alt="Horn" className="h-8 w-8" />, label: '', color: 'text-blue-500' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-3 sm:p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Hall of Victories</h1>
        </div>

        {/* Activities */}
        <div className="space-y-3 sm:space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : activities.length === 0 ? (
            <Card className="bg-card/50 border-border">
              <CardContent className="py-8">
                <div className="text-center">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No brotherhood activity yet.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Complete challenges to see activities here.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            activities.map((activity) => {
              const activityLikes = likes[activity.id];
              const totalLikes = activityLikes?.count || 0;
              
              return (
                <div key={activity.id} className="mb-3 sm:mb-4">
                  {/* Activity Card */}
                  <div className="bg-slate-800/80 border border-slate-600 rounded-lg p-3 sm:p-6 shadow-lg">
                    {/* User Profile Header */}
                    <div className="flex items-start justify-between mb-4 sm:mb-6">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Shield className="w-4 h-4 sm:w-6 sm:h-6 text-slate-300" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 sm:gap-3 mb-1">
                            <span className="font-semibold text-white text-sm sm:text-base truncate">
                              {activity.banner_name || 'Freya Stormborn'}
                            </span>
                            <Badge className="bg-slate-600 text-slate-200 px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs flex-shrink-0 rounded-sm">
                              {getUserTitle(activity.user_id)}
                            </Badge>
                          </div>
                          <span className="text-xs sm:text-sm text-slate-400">
                            {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8 text-slate-400 hover:text-white flex-shrink-0">
                        <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>

                    {/* Activity Content */}
                    <div className="mb-4 sm:mb-6">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 leading-tight">
                        {formatActivityTitle(activity)}
                      </h3>
                      {formatActivitySubtitle(activity) && (
                        <p className="text-slate-300 text-sm sm:text-base mb-2 sm:mb-4 leading-relaxed">
                          {formatActivitySubtitle(activity)}
                        </p>
                      )}
                      {formatActivityDetails(activity) && (
                        <p className="text-slate-400 italic text-xs sm:text-sm leading-relaxed">
                          {formatActivityDetails(activity)}
                        </p>
                      )}
                      {activity.activity_type === 'hero_call' && (
                        <div className="mt-3 sm:mt-4">
                          <Badge className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold shadow-lg shadow-orange-500/30 border border-orange-400/50">
                            15 Days
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Horizontal separator */}
                    <div className="border-t border-slate-600 mb-3 sm:mb-4"></div>

                    {/* Reactions Summary */}
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                        <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                        <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
                      </div>
                      <span className="text-xs sm:text-sm text-slate-400">
                        {totalLikes > 0 ? `${totalLikes} warriors honored this` : 'No honors yet'}
                      </span>
                    </div>

                    {/* Reaction Buttons Grid */}
                    <div className="grid grid-cols-1 gap-1 sm:gap-2 max-w-20">
                      {getReactionButtons().map((reaction, index) => (
                        <Button
                          key={reaction.label}
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleLike(activity.id)}
                          className={`flex items-center gap-2 py-2 sm:py-3 h-auto text-xs ${
                            activityLikes?.userHasLiked 
                              ? 'bg-slate-600 text-blue-400' 
                              : 'text-slate-400 hover:text-white hover:bg-slate-600'
                          }`}
                        >
                          <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center">
                            {reaction.icon}
                          </div>
                          {activityLikes?.userHasLiked && (
                            <span className="text-xs bg-blue-600 rounded px-1 leading-none">1</span>
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ClanPage;