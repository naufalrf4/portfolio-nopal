'use client';

import { type ForwardedRef, forwardRef } from 'react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';

interface LazyTurnstileProps {
  siteKey: string;
  onSuccess: (token: string) => void;
  onError: () => void;
  onExpire: () => void;
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
}

export const LazyTurnstile = forwardRef<TurnstileInstance, LazyTurnstileProps>(
  function LazyTurnstile(
    { siteKey, onSuccess, onError, onExpire, theme = 'light', className = '' },
    ref: ForwardedRef<TurnstileInstance>
  ) {
    if (!siteKey) {
      return null;
    }

    return (
      <div className={`flex justify-center ${className}`}>
        <Turnstile
          ref={ref}
          siteKey={siteKey}
          options={{ theme }}
          onSuccess={onSuccess}
          onError={onError}
          onExpire={onExpire}
        />
      </div>
    );
  }
);
