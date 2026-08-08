import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GhostHeadingProps {
  text: string;
  className?: string;
}

/**
 * Huge outlined background word that drifts slower than the scroll,
 * giving each section its own parallax depth layer.
 */
export function GhostHeading({ text, className }: GhostHeadingProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const yRaw = useTransform(scrollYProgress, [0, 1], [110, -110]);
  const y = reduceMotion ? 0 : yRaw;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-x-0 top-2 z-0 flex overflow-hidden select-none',
        className
      )}
    >
      <motion.span style={{ y }} className="ghost-text whitespace-nowrap">
        {text}
      </motion.span>
    </div>
  );
}
