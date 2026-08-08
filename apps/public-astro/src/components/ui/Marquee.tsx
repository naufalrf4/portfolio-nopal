import { type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

interface MarqueeProps extends ComponentPropsWithoutRef<'div'> {
  className?: string;
  /** Reverse the animation direction. @default false */
  reverse?: boolean;
  /** Pause the animation on hover. @default false */
  pauseOnHover?: boolean;
  children: React.ReactNode;
  /** Animate vertically instead of horizontally. @default false */
  vertical?: boolean;
  /** Number of times to repeat the content. @default 4 */
  repeat?: number;
}

/**
 * Infinite content marquee (adapted from MagicUI). Pure CSS — the track is
 * duplicated `repeat` times and scrolled with the `marquee` keyframe so the loop
 * is seamless. Reduced-motion is handled by the global media query.
 */
export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        'group flex gap-(--gap) overflow-hidden p-2 [--duration:40s] [--gap:1rem]',
        {
          'flex-row': !vertical,
          'flex-col': vertical,
        },
        className
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn('flex shrink-0 justify-around gap-(--gap)', {
              'animate-marquee flex-row': !vertical,
              'animate-marquee-vertical flex-col': vertical,
              'group-hover:[animation-play-state:paused]': pauseOnHover,
            })}
            style={reverse ? { animationDirection: 'reverse' } : undefined}
          >
            {children}
          </div>
        ))}
    </div>
  );
}
