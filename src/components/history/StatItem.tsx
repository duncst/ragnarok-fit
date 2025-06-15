
import React from 'react';

const StatItem = ({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon?: React.ElementType;
  value: string | number;
  label: string;
  color?: string;
}) => (
  <div className="flex items-center gap-2">
    {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
    {color && <div className={`h-3 w-3 rounded-full ${color}`} />}
    <div>
      <p className="font-semibold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  </div>
);

export default StatItem;
