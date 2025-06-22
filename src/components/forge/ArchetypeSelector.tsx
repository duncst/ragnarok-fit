
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Sword, Zap, Mountain, Target, Eye } from 'lucide-react';

const archetypes = [
  {
    name: 'Tyr',
    icon: Shield,
    description: 'God of War & Justice',
    color: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-950/20',
    borderColor: 'border-red-200 dark:border-red-800'
  },
  {
    name: 'Thor',
    icon: Zap,
    description: 'God of Thunder & Strength',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    borderColor: 'border-blue-200 dark:border-blue-800'
  },
  {
    name: 'Odin',
    icon: Eye,
    description: 'All-Father & Wisdom',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    borderColor: 'border-purple-200 dark:border-purple-800'
  },
  {
    name: 'Freyr',
    icon: Mountain,
    description: 'God of Prosperity & Fertility',
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
    borderColor: 'border-green-200 dark:border-green-800'
  }
];

interface ArchetypeSelectorProps {
  selectedArchetype: string;
}

const ArchetypeSelector = ({ selectedArchetype }: ArchetypeSelectorProps) => {
  const selectedArchetypeData = archetypes.find(a => a.name === selectedArchetype);

  return (
    <div className="space-y-4">
      {/* Currently Selected */}
      {selectedArchetypeData && (
        <Card className={`${selectedArchetypeData.bgColor} ${selectedArchetypeData.borderColor}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <selectedArchetypeData.icon className={`h-8 w-8 ${selectedArchetypeData.color}`} />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{selectedArchetypeData.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedArchetypeData.description}</p>
              </div>
              <Badge variant="default">Selected</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Change Path Button */}
      <Button variant="outline" className="w-full">
        <Sword className="h-4 w-4 mr-2" />
        Change Your Path
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Each archetype represents a different approach to strength and wisdom
      </p>
    </div>
  );
};

export default ArchetypeSelector;
