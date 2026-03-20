import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

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
        'prose-a:text-[#1D4ED8] prose-a:no-underline hover:prose-a:text-[#1E40AF]',
        'prose-strong:text-[#243447] prose-code:text-[#1D4ED8]',
        isStreaming && 'animate-in fade-in duration-200'
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          [
            rehypeSanitize,
            {
              ...defaultSchema,
              attributes: {
                ...defaultSchema.attributes,
                a: [...(defaultSchema.attributes?.a ?? []), ['target'], ['rel']],
              },
            },
          ],
        ]}
        components={{
          a: ({ node: _node, ...props }) => (
            <a {...props} target="_blank" rel="noreferrer noopener" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
      {isStreaming && <span className="inline-block w-1 h-4 ml-0.5 bg-[#3B82F6] animate-pulse" />}
    </div>
  );
}
