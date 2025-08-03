import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Award, Swords, MoreHorizontal, Crown, Flame, Zap, Shield, Heart } from 'lucide-react';
import { useBrotherhoodActivities } from '@/hooks/useBrotherhoodActivities';
import { useBrotherhoodLikes } from '@/hooks/useBrotherhoodLikes';
import { useBannerName } from '@/hooks/useBannerName';
import { formatDistanceToNow } from 'date-fns';
import { ImageIcon } from '@/components/ImageIcon';

const ClanPage = () => {
  const { activities, isLoading } = useBrotherhoodActivities();
  const { bannerName } = useBannerName();
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

  const getUserTitle = (bannerName?: string, activityType?: string) => {
    if (activityType === 'valhalla_challenge') return 'Shield Maiden';
    if (activityType === 'hero_call') return 'Einherjar Elite';
    return 'Warrior';
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
    return activity.notes || activity.activity_description;
  };

  const formatActivityDetails = (activity: any) => {
    if (activity.activity_type === 'valhalla_challenge') {
      return '150 burpees, 100 push-ups, 200 air squats, 300 mountain climbers, 250 jumping lunges';
    } else if (activity.activity_type === 'hero_call') {
      return null; // Will show streak badge instead
    }
    return activity.notes;
  };

  const getReactionButtons = () => [
    { icon: <Flame className="w-4 h-4" />, label: 'Fire', color: 'text-orange-500' },
    { icon: <Shield className="w-4 h-4" />, label: 'Worthy', color: 'text-slate-400' },
    { icon: <ImageIcon src="/lovable-uploads/87f4cc20-755c-412f-a511-4ea9911896fd.png" alt="Horn" className="h-4 w-4" />, label: 'Honor', color: 'text-blue-500' },
    { icon: <Heart className="w-4 h-4" />, label: 'Support', color: 'text-pink-500' },
    { icon: <Zap className="w-4 h-4" />, label: 'Thunder', color: 'text-yellow-500' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Hall of Victories</h1>
        </div>

        {/* Activities */}
        <div className="space-y-4">
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
                <Card key={activity.id} className="bg-slate-700/50 border-slate-600 shadow-lg">
                  <CardContent className="p-0">
                    {/* Main Activity Card */}
                    <div className="bg-slate-800/80 border border-slate-600 rounded-lg m-4 p-6">
                      {/* Activity Content */}
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-white mb-3">
                          {formatActivityTitle(activity)}
                        </h3>
                        <p className="text-slate-300 text-lg mb-4">
                          {formatActivitySubtitle(activity)}
                        </p>
                        {formatActivityDetails(activity) && (
                          <p className="text-slate-400 italic text-sm">
                            {formatActivityDetails(activity)}
                          </p>
                        )}
                        {activity.activity_type === 'hero_call' && (
                          <div className="mt-4">
                            <Badge className="bg-orange-600 text-white px-3 py-1 text-sm">
                              🔥 15 Days
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Horizontal separator */}
                      <div className="border-t border-slate-600 mb-4"></div>

                      {/* Reactions Summary */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1">
                          <Zap className="w-4 h-4 text-yellow-500" />
                          <Flame className="w-4 h-4 text-orange-500" />
                          <Shield className="w-4 h-4 text-slate-400" />
                        </div>
                        <span className="text-sm text-slate-400">
                          {totalLikes > 0 ? `${totalLikes + 2} warriors honored this` : '3 warriors honored this'}
                        </span>
                      </div>

                      {/* Reaction Buttons Grid */}
                      <div className="grid grid-cols-5 gap-2 mb-4">
                        {getReactionButtons().map((reaction, index) => (
                          <Button
                            key={reaction.label}
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleLike(activity.id)}
                            className={`flex flex-col items-center gap-1 py-3 h-auto ${
                              index === 2 && activityLikes?.userHasLiked 
                                ? 'bg-slate-600 text-blue-400' 
                                : 'text-slate-400 hover:text-white hover:bg-slate-600'
                            }`}
                          >
                            {reaction.icon}
                            <span className="text-xs">{reaction.label}</span>
                            {index === 0 && <span className="text-xs bg-slate-600 rounded px-1">1</span>}
                            {index === 1 && <span className="text-xs bg-slate-600 rounded px-1">1</span>}
                            {index === 2 && activityLikes?.userHasLiked && (
                              <span className="text-xs bg-blue-600 rounded px-1">1</span>
                            )}
                            {index === 4 && <span className="text-xs bg-slate-600 rounded px-1">1</span>}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* User Profile Section */}
                    <div className="px-6 pb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center">
                            <Shield className="w-6 h-6 text-slate-300" />
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-white">
                              {activity.banner_name || 'Freya Stormborn'}
                            </span>
                            <Badge className="bg-slate-600 text-slate-200 px-2 py-1">
                              {getUserTitle(activity.banner_name, activity.activity_type)}
                            </Badge>
                            <Crown className="w-4 h-4 text-orange-500" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-400">
                            {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                          </span>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ClanPage;