
import React from 'react';
import { cn } from '@/lib/utils';
import { Zap, Dog, Snowflake, Waves, Brain, Swords, Circle, Dot } from 'lucide-react';

interface RuneDisplayProps {
  runeName: string;
  tier: 'Adept' | 'Warrior' | 'Berserker';
  challengeName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const tierStyles = {
  Adept: 'text-gray-500 border-gray-400 bg-gray-50',
  Warrior: 'text-slate-600 border-slate-400 bg-slate-50',
  Berserker: 'text-amber-600 border-amber-500 bg-gradient-to-br from-amber-50 to-yellow-50',
};

const tierIcons = {
  Adept: Circle,
  Warrior: Dot,
  Berserker: Circle,
};

const sizeStyles = {
  sm: 'w-12 h-12 text-xs',
  md: 'w-16 h-16 text-sm',
  lg: 'w-24 h-24 text-base',
};

export const RuneDisplay = ({ 
  runeName, 
  tier, 
  challengeName, 
  size = 'md', 
  className 
}: RuneDisplayProps) => {
  const RuneIcon = React.useMemo(() => {
    switch (challengeName) {
      case 'THOR': return Zap;
      case 'FENRIR': return Dog;
      case 'HEL': return Snowflake;
      case 'NJORD': return Waves;
      case 'ODIN': return Brain;
      default: return Swords;
    }
  }, [challengeName]);

  const TierIcon = tierIcons[tier];

  return (
    <div className={cn(
      'relative flex flex-col items-center justify-center border-2 rounded-lg',
      'font-bold shadow-sm transition-all duration-200 hover:shadow-md',
      tierStyles[tier],
      sizeStyles[size],
      className
    )}>
      <RuneIcon className="w-6 h-6 mb-1" />
      <div className="absolute -top-1 -right-1">
        <TierIcon className="w-3 h-3" />
      </div>
      {size === 'lg' && (
        <div className="text-center mt-2">
          <div className="text-xs font-medium">{runeName}</div>
          <div className="text-xs opacity-70">{tier}</div>
        </div>
      )}
    </div>
  );
};
