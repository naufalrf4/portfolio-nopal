'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { Drawer } from 'vaul';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useIsMobile } from '@/hooks/use-mobile';

interface DatePickerProps {
  value?: Date | null | undefined;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  className?: string;
  format?: string;
}

const neumorphicShadow =
  'shadow-[4px_4px_8px_rgba(163,177,198,0.5),-4px_-4px_8px_rgba(255,255,255,0.5)]';
const neumorphicHover =
  'hover:shadow-[5px_5px_10px_rgba(163,177,198,0.55),-5px_-5px_10px_rgba(255,255,255,0.55)]';
const neumorphicActive =
  'active:shadow-[inset_3px_3px_6px_rgba(163,177,198,0.5),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]';

function DatePicker({
  value,
  onChange,
  placeholder = 'Select a date',
  minDate,
  maxDate,
  disabled = false,
  className,
  format: dateFormat = 'MMM dd, yyyy',
}: DatePickerProps): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const handleSelect = (date: Date | undefined) => {
    onChange(date ?? null);
    if (date) setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setOpen(false);
  };

  const formattedDate = value ? format(value, dateFormat) : '';

  const disabledDays = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const triggerButton = (
    <button
      type="button"
      className={cn(
        'w-full h-9 px-3 py-2 text-sm text-left rounded-xl bg-[#E0E5EC]',
        neumorphicShadow,
        'transition-all duration-200',
        neumorphicHover,
        neumorphicActive,
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0',
        !value && 'text-[#6B7280]',
        className
      )}
      disabled={disabled}
      onClick={() => isMobile && setOpen(true)}
    >
      <CalendarIcon className="w-4 h-4 mr-2 text-[#3B82F6] inline-block" />
      <span className="inline-block">{value ? formattedDate : placeholder}</span>
    </button>
  );

  const calendarStyles = `
    .rdp {
      --rdp-cell-size: 32px !important;
      --rdp-day-size: 32px !important;
      margin: 0;
    }
    .rdp-caption_label {
      font-size: 13px !important;
      padding: 4px 0 !important;
    }
    .rdp-head_cell {
      font-size: 11px !important;
      height: 24px !important;
    }
    .rdp-day {
      height: 32px !important;
      width: 32px !important;
      font-size: 12px !important;
      margin: 0 auto !important;
    }
    .rdp-week {
      margin: 0 !important;
      height: 32px !important;
    }
    .rdp-months {
      gap: 0 !important;
    }
    .rdp-button_reset {
      height: 32px !important;
      width: 32px !important;
    }
  `;

  const calendarClassNames = {
    months: 'flex flex-row gap-2',
    month: 'space-y-0',
    caption: 'flex justify-center py-1 relative items-center gap-1',
    caption_label: 'text-sm font-medium text-[#3D4852]',
    nav: 'absolute w-full flex justify-between px-1 top-0',
    nav_button: cn(
      'h-7 w-7 flex items-center justify-center rounded-lg bg-[#E0E5EC]',
      'shadow-[2px_2px_4px_rgba(163,177,198,0.4),-2px_-2px_4px_rgba(255,255,255,0.5)]',
      'hover:shadow-[inset_2px_2px_4px_rgba(163,177,198,0.4)]',
      'disabled:opacity-40'
    ),
    nav_button_previous: '',
    nav_button_next: '',
    table: 'w-full border-collapse',
    head_row: 'flex h-6',
    head_cell: cn(
      'w-8 flex-1 flex items-center justify-center text-xs font-medium text-[#3D4852]/60 uppercase'
    ),
    row: 'flex h-8',
    cell: cn('flex-1 h-8 p-0 text-center relative [&:has([aria-selected])]:bg-[#3B82F6]/10'),
    day: cn(
      'h-7 w-7 m-auto p-0 font-medium rounded-lg bg-transparent',
      'hover:bg-[#3B82F6]/10 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/40',
      'aria-selected:bg-[#3B82F6] aria-selected:text-white'
    ),
    day_range_start: 'rounded-l',
    day_range_end: 'rounded-r',
    day_selected: 'bg-[#3B82F6] text-white hover:bg-[#3B82F6]',
    day_today: 'font-bold text-[#3B82F6]',
    day_outside: 'text-[#3D4852]/30',
    day_disabled: 'text-[#3D4852]/25 cursor-not-allowed',
    day_range_middle: 'bg-[#3B82F6]/5',
  };

  const calendarComponent = (
    <Calendar
      mode="single"
      selected={value ?? undefined}
      onSelect={handleSelect}
      disabled={disabledDays}
      defaultMonth={value ?? undefined}
      captionLayout="dropdown"
      fromYear={minDate?.getFullYear() ?? 1900}
      toYear={maxDate?.getFullYear() ?? new Date().getFullYear() + 10}
      showOutsideDays={false}
      classNames={calendarClassNames}
    />
  );

  if (isMobile) {
    return (
      <div className="relative">
        {triggerButton}
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] hover:text-red-500 transition-colors z-10"
            aria-label="Clear date"
          >
            <X className="w-full h-full" />
          </button>
        )}
        <Drawer.Root open={open} onOpenChange={setOpen}>
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
                'fixed inset-x-0 bottom-0 z-50 flex flex-col',
                'bg-[#E0E5EC] rounded-t-[32px]',
                'shadow-[0_-12px_24px_rgba(163,177,198,0.7),0_-24px_48px_rgba(255,255,255,0.3)]',
                'focus:outline-none'
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
              <div className="flex items-center justify-between px-6 pt-2 pb-4">
                <Drawer.Title className="font-display text-xl font-bold tracking-tight text-[#3D4852]">
                  {placeholder}
                </Drawer.Title>
                <Drawer.Close
                  className={cn(
                    'h-9 w-9 rounded-xl shrink-0',
                    'bg-[#E0E5EC] flex items-center justify-center',
                    'shadow-[4px_4px_8px_rgba(163,177,198,0.5),-4px_-4px_8px_rgba(255,255,255,0.4)]',
                    'text-[#6B7280] transition-all duration-200',
                    'hover:shadow-[5px_5px_10px_rgba(163,177,198,0.55),-5px_-5px_10px_rgba(255,255,255,0.5)]',
                    'hover:text-[#3D4852]',
                    'active:shadow-[inset_3px_3px_6px_rgba(163,177,198,0.5),inset_-3px_-3px_6px_rgba(255,255,255,0.4)]',
                    'focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30'
                  )}
                >
                  <X className="w-4 h-4" />
                  <span className="sr-only">Close</span>
                </Drawer.Close>
              </div>
              <div className="flex-1 overflow-y-auto px-6 pb-6 overscroll-contain">
                <style jsx global>
                  {calendarStyles}
                </style>
                <div className="flex justify-center">{calendarComponent}</div>
                {value && (
                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      onClick={handleClear}
                      className={cn(
                        'px-4 py-2 text-sm font-medium text-red-600 rounded-xl',
                        'bg-[#E0E5EC]',
                        'shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.4)]',
                        'hover:shadow-[inset_3px_3px_6px_rgba(163,177,198,0.5),inset_-3px_-3px_6px_rgba(255,255,255,0.4)]',
                        'transition-all duration-200'
                      )}
                    >
                      Clear Date
                    </button>
                  </div>
                )}
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>

      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] hover:text-red-500 transition-colors z-10"
          aria-label="Clear date"
        >
          <X className="w-full h-full" />
        </button>
      )}

      <PopoverContent
        className={cn(
          'w-auto p-0',
          'rounded-xl bg-[#E0E5EC]',
          '[box-shadow:6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.45)]',
          'z-[100]',
          'max-w-[280px]'
        )}
        align="start"
        sideOffset={4}
      >
        <style jsx global>
          {calendarStyles}
        </style>
        <div className="p-3">{calendarComponent}</div>
      </PopoverContent>
    </Popover>
  );
}

DatePicker.displayName = 'DatePicker';

export { DatePicker };
export type { DatePickerProps };
