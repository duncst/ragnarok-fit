
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dumbbell, Heart, Shield, Building, Mountain, Waves, Lock } from 'lucide-react';

const capabilities = [
  {
    name: 'Strength',
    icon: Dumbbell,
    badges: ['Iron Grip', 'Stone Lifter'],
    color: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-950/20'
  },
  {
    name: 'Endurance',
    icon: Heart,
    badges: ['Marathon Spirit', 'Tireless'],
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20'
  },
  {
    name: 'Survival',
    icon: Shield,
    badges: ['Weather Walker'],
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-950/20'
  },
  {
    name: 'Urban',
    icon: Building,
    badges: ['City Conqueror'],
    color: 'text-gray-500',
    bgColor: 'bg-gray-50 dark:bg-gray-950/20'
  },
  {
    name: 'Wild',
    icon: Mountain,
    badges: [],
    color: 'text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950/20'
  },
  {
    name: 'Water',
    icon: Waves,
    badges: [],
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950/20'
  }
];

const CapabilityShowcase = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {capabilities.map((capability) => (
        <Card key={capability.name} className={capability.bgColor}>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <capability.icon className={`h-5 w-5 ${capability.color}`} />
                <h4 className="font-medium">{capability.name}</h4>
              </div>
              
              <div className="space-y-1">
                {capability.badges.length > 0 ? (
                  capability.badges.map((badge) => (
                    <Badge key={badge} variant="secondary" className="text-xs">
                      {badge}
                    </Badge>
                  ))
                ) : (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    <span className="text-xs">No badges yet</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CapabilityShowcase;
