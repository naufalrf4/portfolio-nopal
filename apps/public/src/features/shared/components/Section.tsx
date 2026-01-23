import { cn } from '@/src/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section
      id={id}
      className={cn('py-16 md:py-24 px-4 md:px-8 lg:px-16 overflow-x-hidden', className)}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}
