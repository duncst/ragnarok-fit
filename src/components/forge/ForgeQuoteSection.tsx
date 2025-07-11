import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Flame } from 'lucide-react';
import { useForgeData } from '@/hooks/useForgeData';

const ForgeQuoteSection = () => {
  const { currentQuote } = useForgeData();

  return (
    <Card className="bg-gradient-to-r from-muted/50 to-muted/30 border-muted">
      <CardContent className="p-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Flame className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground tracking-wider uppercase">Words of the Forge</span>
            <Flame className="h-4 w-4 text-primary" />
          </div>
          <blockquote className="text-lg font-medium text-foreground italic">
            "{currentQuote}"
          </blockquote>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForgeQuoteSection;