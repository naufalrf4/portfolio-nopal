'use client';

import * as React from 'react';
import { Drawer } from 'vaul';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { XIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './dialog';

interface ResponsiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
}

const neumorphicButtonShadow =
  'shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.5)]';
const neumorphicButtonHover =
  'hover:shadow-[7px_7px_12px_rgba(163,177,198,0.65),-7px_-7px_12px_rgba(255,255,255,0.55)]';
const neumorphicButtonActive =
  'active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]';

function ResponsiveModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
  size = 'default',
  showCloseButton = true,
}: ResponsiveModalProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer.Root open={open} onOpenChange={onOpenChange}>
        <Drawer.Portal>
          <Drawer.Overlay
            className={cn(
              'fixed inset-0 z-50 bg-[#E0E5EC]/80 backdrop-blur-md',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
              'duration-300'
            )}
          />
          <Drawer.Content
            className={cn(
              'fixed inset-x-0 bottom-0 z-50 flex max-h-[90vh] flex-col',
              'bg-[#E0E5EC] rounded-t-[32px]',
              'shadow-[0_-12px_24px_rgba(163,177,198,0.7),0_-24px_48px_rgba(255,255,255,0.3)]',
              'focus:outline-none',
              className
            )}
          >
            <div
              className={cn(
                'mx-auto mt-4 mb-2 h-1.5 w-16 rounded-full',
                'bg-[#A3B1C6]/40',
                'shadow-[inset_2px_2px_4px_rgba(163,177,198,0.4),inset_-2px_-2px_4px_rgba(255,255,255,0.3)]'
              )}
              aria-hidden="true"
            />

            <div className="flex items-start justify-between px-6 pt-2 pb-4">
              <div className="flex flex-col gap-1.5 flex-1 pr-4">
                <Drawer.Title className="font-display text-2xl font-bold tracking-tight text-[#3D4852]">
                  {title}
                </Drawer.Title>
                {description && (
                  <Drawer.Description className="text-sm text-[#6B7280]">
                    {description}
                  </Drawer.Description>
                )}
              </div>

              {showCloseButton && (
                <Drawer.Close
                  className={cn(
                    'h-10 w-10 rounded-xl shrink-0',
                    'bg-[#E0E5EC] flex items-center justify-center',
                    neumorphicButtonShadow,
                    'text-[#6B7280] transition-all duration-200',
                    neumorphicButtonHover,
                    'hover:text-[#3D4852]',
                    neumorphicButtonActive,
                    'focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 focus:ring-offset-2 focus:ring-offset-[#E0E5EC]',
                    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-5'
                  )}
                >
                  <XIcon />
                  <span className="sr-only">Close</span>
                </Drawer.Close>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-4 overscroll-contain">{children}</div>

            {footer && (
              <div
                className={cn(
                  'flex flex-col-reverse gap-3 px-6 py-4 sm:flex-row sm:justify-end',
                  'border-t border-[#A3B1C6]/20',
                  'bg-[#E0E5EC]'
                )}
              >
                {footer}
              </div>
            )}
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size={size} showCloseButton={showCloseButton} className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <DialogBody>{children}</DialogBody>

        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}

export { ResponsiveModal };
export type { ResponsiveModalProps };
