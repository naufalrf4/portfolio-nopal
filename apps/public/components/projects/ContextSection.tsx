import type { ProjectContext } from '@naufalrf/types';

interface ContextSectionProps {
  context: ProjectContext;
}

const contextTypeLabels: Record<string, string> = {
  CONTEXT: 'Background & Context',
  ROLE: 'My Role',
  DECISIONS: 'Key Decisions',
  TRADEOFFS: 'Tradeoffs',
  RESULT: 'Results & Impact',
  ARCHITECTURE: 'System Architecture',
  OPERATIONS: 'Operations',
  METRICS: 'Performance Metrics',
};

export function ContextSection({ context }: ContextSectionProps) {
  const typeLabel = contextTypeLabels[context.type] || context.type;

  return (
    <section className="neu-card mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="neu-inset px-4 py-2 rounded-xl">
          <span className="text-xs font-medium text-primary uppercase tracking-wider">
            {typeLabel}
          </span>
        </div>
      </div>

      {context.title && <h3 className="text-xl font-bold text-foreground mb-4">{context.title}</h3>}

      <div className="prose prose-sm max-w-none text-muted-foreground">
        <div
          dangerouslySetInnerHTML={{
            __html: context.content.replace(/\n/g, '<br />'),
          }}
        />
      </div>
    </section>
  );
}
