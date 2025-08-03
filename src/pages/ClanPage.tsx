import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Users, Award, Clock, Swords } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-sm text-muted-foreground mb-2">EXCLUSIVE ACCESS</h2>
          <h1 className="text-4xl font-bold text-foreground mb-4">Brotherhood</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Ragnarök Fit is an invite-only brotherhood of men committed to forging themselves into capable, disciplined warriors.
          </p>
        </div>

        {/* Brotherhood Status */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Your Brotherhood Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-2 w-fit">
                <span className="text-lg font-bold text-primary">Ironbound</span>
              </div>
              <p className="text-sm text-muted-foreground">
                You've earned your place in the brotherhood. You have 2 invites available to bring worthy men into the forge.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Brotherhood Activity */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle>Hall of Victories</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No brotherhood activity yet.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete challenges to see activities here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => {
                  const activityLikes = likes[activity.id];
                  return (
                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">
                          {getBannerInitials(activity.banner_name)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-foreground">
                            {activity.banner_name || 'Unknown Warrior'}
                          </span>
                          {getActivityIcon(activity.activity_type)}
                        </div>
                        <div className="bg-muted border border-primary/20 rounded px-3 py-1 w-fit mb-2">
                          <span className="text-sm font-semibold text-primary">Ironbound</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {activity.activity_description}
                        </p>
                        {activity.notes && (
                          <p className="text-sm text-foreground mt-1 italic">
                            "{activity.notes}"
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {activityLikes && activityLikes.count > 0 && (
                              <span className="text-xs text-muted-foreground">
                                {activityLikes.count}
                              </span>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleLike(activity.id)}
                              className={`h-12 w-12 ${activityLikes?.userHasLiked ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                              aria-label="Congratulate"
                            >
                              <ImageIcon 
                                src="/lovable-uploads/87f4cc20-755c-412f-a511-4ea9911896fd.png" 
                                alt="Horn"
                                className="h-8 w-8"
                              />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClanPage;