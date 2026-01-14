import { useState, useCallback, useRef, type RefObject } from 'react';
import type { TurnstileInstance } from '@marsidev/react-turnstile';

interface UseLazyTurnstileOptions {
  enabled?: boolean;
}

interface UseLazyTurnstileReturn {
  shouldShowTurnstile: boolean;
  turnstileToken: string | null;
  turnstileRef: RefObject<TurnstileInstance | null>;
  handleTurnstileSuccess: (token: string) => void;
  handleTurnstileError: () => void;
  handleTurnstileExpire: () => void;
  resetTurnstile: () => void;
  activateTurnstile: () => void;
  isTurnstileRequired: boolean;
}

export function useLazyTurnstile(
  siteKey: string,
  options: UseLazyTurnstileOptions = {}
): UseLazyTurnstileReturn {
  const { enabled = true } = options;
  const [shouldShowTurnstile, setShouldShowTurnstile] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const isTurnstileRequired = Boolean(siteKey) && enabled;

  const activateTurnstile = useCallback(() => {
    if (isTurnstileRequired && !shouldShowTurnstile) {
      setShouldShowTurnstile(true);
    }
  }, [isTurnstileRequired, shouldShowTurnstile]);

  const handleTurnstileSuccess = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const handleTurnstileError = useCallback(() => {
    setTurnstileToken(null);
    turnstileRef.current?.reset();
  }, []);

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken(null);
  }, []);

  const resetTurnstile = useCallback(() => {
    setTurnstileToken(null);
    turnstileRef.current?.reset();
  }, []);

  return {
    shouldShowTurnstile,
    turnstileToken,
    turnstileRef,
    handleTurnstileSuccess,
    handleTurnstileError,
    handleTurnstileExpire,
    resetTurnstile,
    activateTurnstile,
    isTurnstileRequired,
  };
}
