import * as React from 'react';
import { cn } from '@/lib/utils';

interface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Border width in px. @default 1 */
  borderWidth?: number;
  /** Animation duration in seconds. @default 14 */
  duration?: number;
  /** Shine color — single color or array. @default teal */
  shineColor?: string | string[];
}

/** Animated gradient shine border (adapted from MagicUI shine-border). */
export function ShineBorder({
  borderWidth = 1,
  duration = 14,
  shineColor = '#3ed9c4',
  className,
  style,
  ...props
}: ShineBorderProps) {
  return (
    <div
      style={
        {
          '--border-width': `${borderWidth}px`,
          '--duration': `${duration}s`,
          backgroundImage: `radial-gradient(transparent,transparent, ${
            Array.isArray(shineColor) ? shineColor.join(',') : shineColor
          },transparent,transparent)`,
          backgroundSize: '300% 300%',
          mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: 'var(--border-width)',
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        'motion-safe:animate-shine pointer-events-none absolute inset-0 size-full rounded-[inherit] will-change-[background-position]',
        className
      )}
      {...props}
    />
  );
}
