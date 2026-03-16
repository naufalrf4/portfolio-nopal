import { Fragment, type ReactNode } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

type JsonNode = {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: JsonNode[];
  marks?: Array<{
    type?: string;
    attrs?: Record<string, unknown>;
  }>;
  text?: string;
};

interface ProjectArticleProps {
  content?: string | null;
  className?: string;
}

const ARTICLE_STYLES = {
  article: 'max-w-none text-[#4B5563]',
  h1: 'font-display text-3xl md:text-4xl font-bold tracking-tight text-[#2F3A45] mt-12 mb-6 first:mt-0',
  h2: 'font-display text-2xl md:text-[2rem] font-bold tracking-tight text-[#2F3A45] mt-12 mb-5 first:mt-0',
  h3: 'font-display text-xl md:text-2xl font-semibold text-[#2F3A45] mt-10 mb-4',
  h4: 'text-lg md:text-xl font-semibold text-[#2F3A45] mt-8 mb-3',
  p: 'text-[1.02rem] md:text-[1.08rem] leading-8 text-[#4B5563] mb-5',
  ul: 'mb-6 ml-5 list-disc space-y-3 text-[1.02rem] md:text-[1.08rem] leading-8 text-[#4B5563]',
  ol: 'mb-6 ml-5 list-decimal space-y-3 text-[1.02rem] md:text-[1.08rem] leading-8 text-[#4B5563]',
  li: 'pl-2',
  blockquote:
    'my-8 border-l-4 border-[#3B82F6]/70 bg-white/40 pl-5 pr-4 py-4 italic text-[#52606D] shadow-[inset_3px_3px_8px_rgba(163,177,198,0.16),inset_-3px_-3px_8px_rgba(255,255,255,0.45)] rounded-r-[22px]',
  pre: 'my-8 overflow-x-auto rounded-[24px] bg-[#DCE3EB] p-5 text-sm leading-7 text-[#2F3A45] shadow-[inset_6px_6px_12px_rgba(163,177,198,0.38),inset_-6px_-6px_12px_rgba(255,255,255,0.48)]',
  code: 'rounded-md bg-[#D7DFE9] px-1.5 py-0.5 text-[0.9em] text-[#234D85]',
  a: 'font-medium text-[#2563EB] underline decoration-[#2563EB]/30 underline-offset-4 transition-colors duration-200 hover:text-[#1D4ED8]',
  hr: 'my-10 border-0 h-px bg-gradient-to-r from-transparent via-[#A3B1C6] to-transparent',
  strong: 'font-semibold text-[#2F3A45]',
  em: 'italic text-[#52606D]',
  img: 'my-8 w-full rounded-[24px] object-cover shadow-[12px_12px_24px_rgba(163,177,198,0.35),-12px_-12px_24px_rgba(255,255,255,0.45)]',
};

const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:']);

function isSafeUrl(url: string): boolean {
  if (!url) {
    return false;
  }

  if (url.startsWith('/') || url.startsWith('#')) {
    return true;
  }

  try {
    const parsed = new URL(url);
    return SAFE_PROTOCOLS.has(parsed.protocol);
  } catch {
    return false;
  }
}

function isSafeImageUrl(url: string): boolean {
  if (url.startsWith('data:image/')) {
    return true;
  }

  return isSafeUrl(url);
}

function extractLeadingJsonDocument(value: string): { json: string; rest: string | null } | null {
  const input = value.trim();
  if (!input.startsWith('{')) {
    return null;
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === '{') {
      depth += 1;
      continue;
    }

    if (char === '}') {
      depth -= 1;

      if (depth === 0) {
        const json = input.slice(0, index + 1);
        const rest = input.slice(index + 1).trim();
        return { json, rest: rest || null };
      }
    }
  }

  return null;
}

function parseJsonSafely(value: string): unknown | null {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function getNormalizedContent(content?: string | null): {
  markdown: string | null;
  tiptap: JsonNode | null;
} {
  if (!content || !content.trim()) {
    return { markdown: null, tiptap: null };
  }

  const hybridContent = extractLeadingJsonDocument(content);
  if (hybridContent) {
    const parsed = parseJsonSafely(hybridContent.json);
    if (parsed && typeof parsed === 'object' && 'type' in parsed && parsed.type === 'doc') {
      return {
        markdown: hybridContent.rest,
        tiptap: parsed as JsonNode,
      };
    }
  }

  let current: unknown = content.trim();

  for (let depth = 0; depth < 5; depth += 1) {
    if (typeof current !== 'string') {
      break;
    }

    const candidate = current.trim();
    if (!candidate.startsWith('{') && !candidate.startsWith('[')) {
      return { markdown: current, tiptap: null };
    }

    try {
      current = JSON.parse(candidate);
    } catch {
      return { markdown: current, tiptap: null };
    }
  }

  if (typeof current === 'string') {
    return { markdown: current, tiptap: null };
  }

  if (current && typeof current === 'object' && 'type' in current && current.type === 'doc') {
    return { markdown: null, tiptap: current as JsonNode };
  }

  return {
    markdown: typeof content === 'string' ? content : JSON.stringify(current, null, 2),
    tiptap: null,
  };
}

function renderTextWithMarks(node: JsonNode, key: string): ReactNode {
  let rendered: ReactNode = node.text ?? '';

  for (const mark of node.marks ?? []) {
    if (mark.type === 'bold') {
      rendered = <strong className={ARTICLE_STYLES.strong}>{rendered}</strong>;
      continue;
    }

    if (mark.type === 'italic') {
      rendered = <em className={ARTICLE_STYLES.em}>{rendered}</em>;
      continue;
    }

    if (mark.type === 'code') {
      rendered = <code className={ARTICLE_STYLES.code}>{rendered}</code>;
      continue;
    }

    if (mark.type === 'link') {
      const href = typeof mark.attrs?.href === 'string' ? mark.attrs.href : '';
      rendered = isSafeUrl(href) ? (
        <a className={ARTICLE_STYLES.a} href={href} target="_blank" rel="noreferrer noopener">
          {rendered}
        </a>
      ) : (
        rendered
      );
    }
  }

  return <Fragment key={key}>{rendered}</Fragment>;
}

function renderChildren(nodes: JsonNode[] | undefined, parentKey: string): ReactNode[] {
  return (nodes ?? [])
    .map((node, index) => renderNode(node, `${parentKey}-${index}`))
    .filter(Boolean);
}

function renderNode(node: JsonNode, key: string): ReactNode {
  if (node.type === 'text') {
    return renderTextWithMarks(node, key);
  }

  if (node.type === 'hardBreak') {
    return <br key={key} />;
  }

  const children = renderChildren(node.content, key);

  switch (node.type) {
    case 'paragraph':
      return (
        <p key={key} className={ARTICLE_STYLES.p}>
          {children}
        </p>
      );
    case 'heading': {
      const level = typeof node.attrs?.level === 'number' ? node.attrs.level : 2;
      if (level === 1) {
        return (
          <h1 key={key} className={ARTICLE_STYLES.h1}>
            {children}
          </h1>
        );
      }
      if (level === 2) {
        return (
          <h2 key={key} className={ARTICLE_STYLES.h2}>
            {children}
          </h2>
        );
      }
      if (level === 3) {
        return (
          <h3 key={key} className={ARTICLE_STYLES.h3}>
            {children}
          </h3>
        );
      }
      return (
        <h4 key={key} className={ARTICLE_STYLES.h4}>
          {children}
        </h4>
      );
    }
    case 'bulletList':
      return (
        <ul key={key} className={ARTICLE_STYLES.ul}>
          {children}
        </ul>
      );
    case 'orderedList':
      return (
        <ol key={key} className={ARTICLE_STYLES.ol}>
          {children}
        </ol>
      );
    case 'listItem':
      return (
        <li key={key} className={ARTICLE_STYLES.li}>
          {children}
        </li>
      );
    case 'blockquote':
      return (
        <blockquote key={key} className={ARTICLE_STYLES.blockquote}>
          {children}
        </blockquote>
      );
    case 'codeBlock': {
      const codeText = (node.content ?? [])
        .map((child) => (typeof child.text === 'string' ? child.text : ''))
        .join('');
      return (
        <pre key={key} className={ARTICLE_STYLES.pre}>
          <code>{codeText}</code>
        </pre>
      );
    }
    case 'image': {
      const src = typeof node.attrs?.src === 'string' ? node.attrs.src : '';
      if (!isSafeImageUrl(src)) {
        return null;
      }
      const alt = typeof node.attrs?.alt === 'string' ? node.attrs.alt : '';
      const title = typeof node.attrs?.title === 'string' ? node.attrs.title : alt;

      return (
        <img
          key={key}
          src={src}
          alt={alt || 'Project illustration'}
          title={title || undefined}
          className={ARTICLE_STYLES.img}
          loading="lazy"
        />
      );
    }
    case 'horizontalRule':
      return <hr key={key} className={ARTICLE_STYLES.hr} />;
    case 'doc':
      return <Fragment key={key}>{children}</Fragment>;
    default:
      return children.length > 0 ? <Fragment key={key}>{children}</Fragment> : null;
  }
}

function MarkdownArticle({ content }: { content: string }) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      urlTransform={(url) => (isSafeUrl(url) ? url : '')}
      components={{
        h1: ({ children }) => <h1 className={ARTICLE_STYLES.h1}>{children}</h1>,
        h2: ({ children }) => <h2 className={ARTICLE_STYLES.h2}>{children}</h2>,
        h3: ({ children }) => <h3 className={ARTICLE_STYLES.h3}>{children}</h3>,
        h4: ({ children }) => <h4 className={ARTICLE_STYLES.h4}>{children}</h4>,
        p: ({ children }) => <p className={ARTICLE_STYLES.p}>{children}</p>,
        ul: ({ children }) => <ul className={ARTICLE_STYLES.ul}>{children}</ul>,
        ol: ({ children }) => <ol className={ARTICLE_STYLES.ol}>{children}</ol>,
        li: ({ children }) => <li className={ARTICLE_STYLES.li}>{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className={ARTICLE_STYLES.blockquote}>{children}</blockquote>
        ),
        pre: ({ children }) => <pre className={ARTICLE_STYLES.pre}>{children}</pre>,
        code: ({ className, children }) => {
          if (className) {
            return <code className={cn(className, 'text-inherit')}>{children}</code>;
          }

          return <code className={ARTICLE_STYLES.code}>{children}</code>;
        },
        a: ({ href, children }) => {
          if (!href || !isSafeUrl(href)) {
            return <span>{children}</span>;
          }

          const external = href.startsWith('http');
          return (
            <a
              className={ARTICLE_STYLES.a}
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noreferrer noopener' : undefined}
            >
              {children}
            </a>
          );
        },
        hr: () => <hr className={ARTICLE_STYLES.hr} />,
        strong: ({ children }) => <strong className={ARTICLE_STYLES.strong}>{children}</strong>,
        em: ({ children }) => <em className={ARTICLE_STYLES.em}>{children}</em>,
        img: ({ src, alt }) => {
          if (!src || !isSafeImageUrl(src)) {
            return null;
          }

          return (
            <img
              src={src}
              alt={alt || 'Project illustration'}
              className={ARTICLE_STYLES.img}
              loading="lazy"
            />
          );
        },
      }}
    >
      {content}
    </Markdown>
  );
}

export function ProjectArticle({ content, className }: ProjectArticleProps) {
  const normalized = getNormalizedContent(content);

  if (!normalized.markdown && !normalized.tiptap) {
    return null;
  }

  return (
    <article className={cn(ARTICLE_STYLES.article, className)}>
      {normalized.tiptap ? renderChildren(normalized.tiptap.content, 'article-root') : null}
      {normalized.markdown ? <MarkdownArticle content={normalized.markdown} /> : null}
    </article>
  );
}
