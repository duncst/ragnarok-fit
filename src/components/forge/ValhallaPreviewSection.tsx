import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Lock } from 'lucide-react';

const ValhallaPreviewSection = () => {
  return (
    <Card className="bg-gradient-to-r from-primary/10 to-primary/20 border-primary/30">
      <CardContent className="p-6 text-center">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Crown className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-bold text-foreground">Halls of Valhalla</h3>
          </div>
          <p className="text-muted-foreground">
            Where elite members are recognized for their legendary achievements
          </p>
          <Badge variant="secondary" className="bg-primary/20 text-foreground border-primary/30">
            <Lock className="h-3 w-3 mr-1" />
            Coming Soon
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default ValhallaPreviewSection;