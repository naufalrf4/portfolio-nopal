import { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { MessageCircle, X } from 'lucide-react';
import { ChatWindow } from './ChatWindow';
import { useAstroPathname } from '@/lib/useAstroPathname';

const WIDGET_STATE_KEY = 'portfolio-chat-widget-open';

interface ChatWidgetProps {
  currentPath: string;
}

export function ChatWidget({ currentPath }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const pathname = useAstroPathname(currentPath);

  useEffect(() => {
    if (pathname !== '/ai-chatbot') {
      return;
    }

    setIsOpen(false);
    setIsExpanded(false);
    sessionStorage.removeItem(WIDGET_STATE_KEY);
  }, [pathname]);

  useEffect(() => {
    if (window.innerWidth < 768) {
      sessionStorage.removeItem(WIDGET_STATE_KEY);
      return;
    }

    const stored = sessionStorage.getItem(WIDGET_STATE_KEY);
    if (stored === 'true') {
      setIsOpen(true);
    }
  }, []);

  const handleToggle = useCallback(() => {
    if (window.innerWidth < 768) {
      window.location.href = '/ai-chatbot';
      return;
    }

    setIsAnimating(true);
    if (isOpen) {
      setIsOpen(false);
      sessionStorage.removeItem(WIDGET_STATE_KEY);
    } else {
      setIsOpen(true);
      sessionStorage.setItem(WIDGET_STATE_KEY, 'true');
    }
    setTimeout(() => setIsAnimating(false), 300);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsAnimating(true);
    setIsOpen(false);
    setIsExpanded(false);
    sessionStorage.removeItem(WIDGET_STATE_KEY);
    setTimeout(() => setIsAnimating(false), 300);
  }, []);

  const handleToggleSize = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  if (pathname === '/ai-chatbot') {
    return null;
  }

  return (
    <>
      <button
        onClick={handleToggle}
        className={cn(
          'fixed bottom-20 md:bottom-6 left-4 md:left-auto md:right-6 z-[60]',
          'w-14 h-14 rounded-full',
          'bg-teal text-bg',
          'shadow-[0_8px_24px_-8px_var(--teal-glow)]',
          'hover:shadow-[0_12px_32px_-8px_var(--teal-glow)]',
          'hover:scale-105',
          'active:scale-95',
          'transition-all duration-300',
          'flex items-center justify-center',
          isOpen && 'rotate-180'
        )}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <span
          className={cn('transition-transform duration-300', isOpen ? 'rotate-180' : 'rotate-0')}
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </span>
      </button>

      {isOpen && (
        <div
          className={cn(
            'fixed z-[60]',
            'transition-all duration-300 ease-out',
            isExpanded
              ? 'bottom-4 right-4 left-4 md:left-auto md:w-[600px] h-[80vh]'
              : 'bottom-36 md:bottom-24 left-4 md:left-auto md:right-6 w-[calc(100vw-2rem)] md:w-96 h-[500px]',
            isAnimating ? 'animate-in fade-in zoom-in-95' : ''
          )}
        >
          <ChatWindow
            onClose={handleClose}
            onToggleSize={handleToggleSize}
            isExpanded={isExpanded}
          />
        </div>
      )}
    </>
  );
}
