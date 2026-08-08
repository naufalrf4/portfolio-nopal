import { useRef, type ReactNode, type MouseEvent } from 'react';
import { cn } from '@/lib/utils';

interface TiltProps {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees */
  max?: number;
  /** Lift on hover in px */
  lift?: number;
}

/**
 * 3D tilt-follow-mouse wrapper. Pure CSS transform, no re-renders.
 * Disabled for touch devices and prefers-reduced-motion.
 */
export function Tilt({ children, className, max = 5, lift = 4 }: TiltProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const isEnabled = () =>
    window.matchMedia('(hover: hover)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !isEnabled()) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${py * -max}deg) translateY(-${lift}px)`;
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = '';
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'transition-transform duration-300 ease-out will-change-transform',
        className
      )}
    >
      {children}
    </div>
  );
}
