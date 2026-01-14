'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/src/lib/utils';

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
        'prose prose-sm max-w-none',
        'prose-p:my-2 prose-p:leading-relaxed',
        'prose-headings:mt-4 prose-headings:mb-2 prose-headings:font-semibold',
        'prose-h1:text-xl prose-h2:text-lg prose-h3:text-base',
        'prose-ul:my-2 prose-ol:my-2',
        'prose-li:my-1',
        'prose-code:text-[#3B82F6] prose-code:bg-[#E0E5EC]/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs',
        'prose-pre:bg-[#2D3748] prose-pre:text-white prose-pre:p-3 prose-pre:rounded-lg prose-pre:my-3',
        'prose-blockquote:border-l-4 prose-blockquote:border-[#3B82F6] prose-blockquote:pl-4 prose-blockquote:italic',
        'prose-strong:font-semibold prose-strong:text-[#3D4852]',
        'prose-a:text-[#3B82F6] prose-a:no-underline hover:prose-a:underline',
        'text-[#3D4852]',
        isStreaming && 'animate-in fade-in duration-200'
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      {isStreaming && <span className="inline-block w-1 h-4 ml-0.5 bg-[#3B82F6] animate-pulse" />}
    </div>
  );
}
