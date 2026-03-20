import React, { useEffect, useMemo, useRef } from 'react';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TurnstileRenderOptions {
  sitekey: string;
  theme: 'light' | 'dark' | 'auto';
  callback: (token: string) => void;
  'expired-callback': () => void;
  'error-callback': () => void;
}

interface TurnstileApi {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
  reset: (widgetId?: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

interface TurnstileWidgetProps {
  siteKey: string;
  resetKey?: number;
  onTokenChange: (token: string) => void;
  onErrorChange?: (message: string | null) => void;
  className?: string;
}

const TURNSTILE_SCRIPT_ID = 'public-turnstile-script';

export function TurnstileWidget({
  siteKey,
  resetKey = 0,
  onTokenChange,
  onErrorChange,
  className,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const hasTurnstile = siteKey.length > 0;

  useEffect(() => {
    if (!hasTurnstile) {
      onTokenChange('');
      onErrorChange?.(null);
      return;
    }

    let cancelled = false;

    const mountTurnstile = (): void => {
      if (cancelled || !containerRef.current || !window.turnstile || widgetIdRef.current) {
        return;
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: 'light',
        callback: (token) => {
          onTokenChange(token);
          onErrorChange?.(null);
        },
        'expired-callback': () => {
          onTokenChange('');
        },
        'error-callback': () => {
          onTokenChange('');
          onErrorChange?.('CAPTCHA verification failed. Please try again.');
        },
      });
    };

    if (window.turnstile) {
      mountTurnstile();
      return () => {
        cancelled = true;
      };
    }

    const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null;
    const script = existingScript ?? document.createElement('script');
    const handleLoad = (): void => {
      mountTurnstile();
    };

    if (!existingScript) {
      script.id = TURNSTILE_SCRIPT_ID;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    script.addEventListener('load', handleLoad);

    const intervalId = window.setInterval(() => {
      if (!window.turnstile) {
        return;
      }

      window.clearInterval(intervalId);
      mountTurnstile();
    }, 250);

    return () => {
      cancelled = true;
      script.removeEventListener('load', handleLoad);
      window.clearInterval(intervalId);
    };
  }, [hasTurnstile, onErrorChange, onTokenChange, siteKey]);

  useEffect(() => {
    onTokenChange('');
    onErrorChange?.(null);

    if (!hasTurnstile || !widgetIdRef.current || !window.turnstile) {
      return;
    }

    window.turnstile.reset(widgetIdRef.current);
  }, [hasTurnstile, onErrorChange, onTokenChange, resetKey]);

  if (!hasTurnstile) {
    return (
      <div
        className={cn(
          'rounded-[24px] border border-dashed border-[#BFDBFE] bg-[#E7ECF2] p-4 text-sm text-[#6B7280]',
          className
        )}
      >
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#3B82F6]" />
          <p>
            CAPTCHA is unavailable until `PUBLIC_TURNSTILE_SITE_KEY` is configured for this app.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('', className)}>
      <div
        ref={containerRef}
        className="min-h-[65px] rounded-[24px] bg-[#E0E5EC]/72 p-2 shadow-[inset_4px_4px_8px_rgba(163,177,198,0.42),inset_-4px_-4px_8px_rgba(255,255,255,0.48)]"
      />
    </div>
  );
}
