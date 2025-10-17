
import React from 'react';
import { ImageIcon } from './ImageIcon';

export const StatItem = ({ icon, value, label }: { icon: React.ElementType | string, value: string | number, label: string }) => {
    const isCustomIcon = typeof icon === 'string';
    
    return (
        <div className="flex items-start gap-3">
            <div className="bg-secondary p-2 rounded-lg">
                {isCustomIcon ? (
                    <ImageIcon src={icon} alt={label} className="h-5 w-5 text-primary" />
                ) : (
                    React.createElement(icon, { className: "h-5 w-5 text-primary" })
                )}
            </div>
            <div>
                <p className="text-xl font-bold">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
            </div>
        </div>
    );
};
