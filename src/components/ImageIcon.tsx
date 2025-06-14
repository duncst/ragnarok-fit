
import { cn } from "@/lib/utils";
import React from "react";

interface ImageIconProps extends React.HTMLAttributes<HTMLDivElement> {
    src: string;
    alt: string;
}

export const ImageIcon = ({ src, className, alt, ...props }: ImageIconProps) => {
    return (
        <div
            {...props}
            role="img"
            aria-label={alt}
            className={cn("bg-current", className)}
            style={{
                maskImage: `url("${src}")`,
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskImage: `url("${src}")`,
                WebkitMaskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
            }}
        />
    );
};
