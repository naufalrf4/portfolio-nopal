import { cn } from '@/lib/utils';

interface MarkdownMessageProps {
  content: string;
  isUser?: boolean;
  isStreaming?: boolean;
}

export function MarkdownMessage({
  content,
  isUser = false,
  isStreaming = false,
}: MarkdownMessageProps) {
  if (isUser) {
    return <div className="text-sm leading-relaxed text-white whitespace-pre-wrap">{content}</div>;
  }

  return (
    <div
      className={cn(
        'prose prose-sm max-w-none text-[#3D4852]',
        isStreaming && 'animate-in fade-in duration-200'
      )}
    >
      <div className="whitespace-pre-wrap leading-relaxed">{content}</div>
      {isStreaming && <span className="inline-block w-1 h-4 ml-0.5 bg-[#3B82F6] animate-pulse" />}
    </div>
  );
}
