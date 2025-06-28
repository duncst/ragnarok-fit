
import React from 'react';
import { cn } from '@/lib/utils';

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
  Adept: '⚪',
  Warrior: '⚫',
  Berserker: '🟡',
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
  const runeSymbol = React.useMemo(() => {
    switch (challengeName) {
      case 'THOR': return '⚡';
      case 'FENRIR': return '🐺';
      case 'HEL': return '🧊';
      case 'NJORD': return '🌊';
      case 'ODIN': return '🧠';
      default: return '⚔️';
    }
  }, [challengeName]);

  return (
    <div className={cn(
      'relative flex flex-col items-center justify-center border-2 rounded-lg',
      'font-bold shadow-sm transition-all duration-200 hover:shadow-md',
      tierStyles[tier],
      sizeStyles[size],
      className
    )}>
      <div className="text-2xl mb-1">{runeSymbol}</div>
      <div className="absolute -top-1 -right-1 text-xs">
        {tierIcons[tier]}
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
