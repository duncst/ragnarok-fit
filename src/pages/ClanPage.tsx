import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Users, Award, Clock } from 'lucide-react';

const ClanPage = () => {
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
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-lg font-semibold text-primary">Iron Soul Member</span>
              </div>
              <p className="text-sm text-muted-foreground">
                You've earned your place in the brotherhood. You have 2 invites available to bring worthy men into the forge.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Invites Section */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Your Invites (2)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <Users className="w-8 h-8 text-muted-foreground" />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Invite a Warrior</h3>
                  <p className="text-sm text-muted-foreground">Send an invitation to a worthy man</p>
                </div>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Create Invite
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Brotherhood Activity */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle>Brotherhood Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">JT</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground">Jason T.</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Completed "Forge of Thunder" challenge</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClanPage;