
import React from 'react';

export const StatItem = ({ icon: Icon, value, label }: { icon: React.ElementType, value: string | number, label: string }) => (
    <div className="flex items-start gap-3">
        <div className="bg-secondary p-2 rounded-lg">
            <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
            <p className="text-xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
        </div>
    </div>
);
