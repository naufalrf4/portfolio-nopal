import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  desktopWidthClassName?: string;
  bodyClassName?: string;
  contentClassName?: string;
  titleId?: string;
  closeLabel?: string;
  disableClose?: boolean;
}

const MOBILE_BREAKPOINT = 768;
const overlayTransition = { duration: 0.28, ease: [0.22, 1, 0.36, 1] };
const desktopTransition = { duration: 0.34, ease: [0.34, 1.56, 0.64, 1] };
const mobileTransition = { duration: 0.38, ease: [0.22, 1, 0.36, 1] };

export function ResponsiveModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  desktopWidthClassName,
  bodyClassName,
  contentClassName,
  titleId,
  closeLabel = 'Close modal',
  disableClose = false,
}: ResponsiveModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const updateViewport = () => {
      setIsMobile(mediaQuery.matches);
    };

    updateViewport();
    mediaQuery.addEventListener('change', updateViewport);

    return () => {
      mediaQuery.removeEventListener('change', updateViewport);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !disableClose) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [disableClose, isOpen, onClose]);

  if (!isMounted) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div className="fixed inset-0 z-[120]" initial="closed" animate="open" exit="closed">
          <motion.div
            data-modal-overlay="true"
            className="absolute inset-0 z-[121] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.3),transparent_42%),linear-gradient(180deg,rgba(214,225,238,0.4),rgba(193,208,224,0.46))] backdrop-blur-xl"
            variants={{ open: { opacity: 1 }, closed: { opacity: 0 } }}
            transition={overlayTransition}
            onClick={() => !disableClose && onClose()}
          />

          <div className="pointer-events-none absolute inset-0 z-[122] flex items-end justify-center p-0 md:items-center md:p-6 lg:p-8">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              onClick={(event) => event.stopPropagation()}
              variants={
                isMobile
                  ? { open: { opacity: 1, y: 0 }, closed: { opacity: 0, y: 48 } }
                  : {
                      open: { opacity: 1, y: 0, scale: 1 },
                      closed: { opacity: 0, y: 20, scale: 0.975 },
                    }
              }
              transition={isMobile ? mobileTransition : desktopTransition}
              className={cn(
                isMobile
                  ? 'w-full max-h-[92vh] overflow-hidden rounded-t-[32px] border border-white/25 bg-[linear-gradient(180deg,rgba(232,239,247,0.78),rgba(216,227,239,0.72))] shadow-[0_-16px_36px_rgba(123,145,169,0.28)] backdrop-blur-2xl'
                  : 'w-full max-h-[calc(100vh-4rem)] overflow-hidden rounded-[32px] border border-white/30 bg-[linear-gradient(160deg,rgba(236,242,248,0.72),rgba(216,227,239,0.66))] shadow-[18px_18px_40px_rgba(123,145,169,0.24)] backdrop-blur-2xl',
                'pointer-events-auto',
                !isMobile && (desktopWidthClassName || 'max-w-[min(960px,calc(100vw-4rem))]'),
                contentClassName
              )}
            >
              {isMobile ? (
                <div className="mx-auto mt-4 h-1.5 w-16 rounded-full bg-[#A3B1C6]/45 shadow-[inset_2px_2px_4px_rgba(163,177,198,0.35),inset_-2px_-2px_4px_rgba(255,255,255,0.3)]" />
              ) : null}

              <div className="flex max-h-[inherit] flex-col">
                <div className="flex items-start justify-between gap-4 px-6 pb-4 pt-5 md:px-8 md:pb-5 md:pt-7">
                  <div className="flex-1 pr-4">
                    <h3 id={titleId} className="text-2xl font-bold text-[#3D4852] md:text-3xl">
                      {title}
                    </h3>
                    {description ? (
                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6B7280] md:text-base">
                        {description}
                      </p>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    disabled={disableClose}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/32 text-[#6B7280] shadow-[0_10px_24px_rgba(135,157,183,0.16)] ring-1 ring-white/35 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/44 hover:text-[#3B82F6] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={closeLabel}
                  >
                    <X size={18} />
                  </button>
                </div>

                <div
                  className={cn('flex-1 overflow-y-auto px-6 pb-5 md:px-8 md:pb-6', bodyClassName)}
                >
                  {children}
                </div>

                {footer ? (
                  <div className="sticky bottom-0 bg-[linear-gradient(180deg,rgba(232,239,247,0.32),rgba(232,239,247,0.78))] px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-xl shadow-[0_-12px_24px_rgba(214,225,238,0.28)] md:px-8">
                    {footer}
                  </div>
                ) : null}
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
