import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Award, Swords, MoreHorizontal, Crown } from 'lucide-react';
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

  const getUserTitle = (bannerName?: string) => {
    // Simple logic to assign titles based on banner name or could be dynamic
    return 'Einherjar Elite';
  };

  const formatActivityTitle = (activity: any) => {
    if (activity.activity_type === 'valhalla_challenge') {
      return `Conquered ${activity.challenge_name || 'Challenge'}!`;
    } else if (activity.activity_type === 'hero_call') {
      return `Completed Hero's Call!`;
    }
    return activity.activity_description;
  };

  const formatActivityDetails = (activity: any) => {
    if (activity.notes) {
      return activity.notes;
    }
    return activity.activity_description;
  };

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
                <Card key={activity.id} className="bg-card/50 border-border">
                  <CardContent className="p-6">
                    {/* User Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                          {getActivityIcon(activity.activity_type)}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-lg text-foreground">
                            {activity.banner_name || 'Unknown Warrior'}
                          </span>
                          <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                            {getUserTitle(activity.banner_name)}
                          </Badge>
                          <Crown className="w-4 h-4 text-orange-500" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                        </span>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Activity Content */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {formatActivityTitle(activity)}
                      </h3>
                      <p className="text-foreground mb-2">
                        {formatActivityDetails(activity)}
                      </p>
                      {activity.notes && activity.activity_description !== activity.notes && (
                        <p className="text-muted-foreground italic">
                          {activity.activity_description}
                        </p>
                      )}
                    </div>

                    {/* Engagement Section */}
                    <div className="border-t border-border pt-4">
                      {/* Summary */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          <ImageIcon 
                            src="/lovable-uploads/87f4cc20-755c-412f-a511-4ea9911896fd.png" 
                            alt="Horn"
                            className="h-4 w-4"
                          />
                          <Swords className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {totalLikes > 0 ? `${totalLikes} warriors honored this` : 'Be the first to honor this victory'}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleLike(activity.id)}
                          className={`flex items-center gap-2 ${activityLikes?.userHasLiked ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                        >
                          <ImageIcon 
                            src="/lovable-uploads/87f4cc20-755c-412f-a511-4ea9911896fd.png" 
                            alt="Horn"
                            className="h-4 w-4"
                          />
                          {activityLikes?.userHasLiked ? '1' : ''}
                        </Button>
                        
                        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                          <Swords className="w-4 h-4" />
                        </Button>
                        
                        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                          <Award className="w-4 h-4" />
                        </Button>
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