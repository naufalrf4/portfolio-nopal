'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import type { Matcher } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerProps {
  value?: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  className?: string;
  format?: string;
}

function DatePicker({
  value,
  onChange,
  placeholder = 'Select a date',
  minDate,
  maxDate,
  disabled = false,
  className,
  format: dateFormat = 'MMM dd, yyyy',
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = React.useCallback(
    (selectedDate: Date | undefined) => {
      onChange(selectedDate ?? null);
      setOpen(false);
    },
    [onChange]
  );

  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(null);
    },
    [onChange]
  );

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
    }
  }, []);

  const disabledDays = React.useMemo((): Matcher[] | undefined => {
    const matchers: Matcher[] = [];
    if (minDate) {
      matchers.push({ before: minDate });
    }
    if (maxDate) {
      matchers.push({ after: maxDate });
    }
    return matchers.length > 0 ? matchers : undefined;
  }, [minDate, maxDate]);

  const formattedDate = React.useMemo(() => {
    if (!value) return null;
    try {
      return format(value, dateFormat);
    } catch {
      return format(value, 'MMM dd, yyyy');
    }
  }, [value, dateFormat]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          onKeyDown={handleKeyDown}
          aria-label={formattedDate ? `Selected date: ${formattedDate}` : placeholder}
          aria-haspopup="dialog"
          aria-expanded={open}
          className={cn(
            'group relative flex h-11 w-full items-center justify-between gap-2',
            'rounded-2xl bg-[#E0E5EC] px-4 py-2',
            'text-left text-sm font-medium',
            '[box-shadow:inset_6px_6px_10px_rgba(163,177,198,0.6),inset_-6px_-6px_10px_rgba(255,255,255,0.5)]',
            'transition-all duration-300 ease-out',
            'hover:[box-shadow:inset_8px_8px_14px_rgba(163,177,198,0.65),inset_-8px_-8px_14px_rgba(255,255,255,0.55)]',
            'focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:ring-offset-2 focus:ring-offset-[#E0E5EC]',
            'focus:[box-shadow:inset_10px_10px_20px_rgba(163,177,198,0.7),inset_-10px_-10px_20px_rgba(255,255,255,0.6)]',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none',
            'min-h-[44px]',
            className
          )}
        >
          <div className="flex flex-1 items-center gap-3">
            <div
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center',
                'rounded-xl bg-[#E0E5EC]',
                '[box-shadow:3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.4)]',
                'transition-all duration-300',
                'group-hover:[box-shadow:4px_4px_8px_rgba(163,177,198,0.55),-4px_-4px_8px_rgba(255,255,255,0.45)]',
                value &&
                  'bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] [box-shadow:3px_3px_6px_rgba(59,130,246,0.3),-3px_-3px_6px_rgba(96,165,250,0.2)]'
              )}
            >
              <CalendarIcon
                className={cn(
                  'h-4 w-4 transition-colors duration-200',
                  value ? 'text-white' : 'text-[#3D4852]/70'
                )}
              />
            </div>
            <span
              className={cn(
                'truncate transition-colors duration-200',
                value ? 'text-[#3D4852]' : 'text-[#A0AEC0]'
              )}
            >
              {formattedDate ?? placeholder}
            </span>
          </div>

          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear date"
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center',
                'rounded-lg bg-[#E0E5EC]',
                '[box-shadow:2px_2px_4px_rgba(163,177,198,0.5),-2px_-2px_4px_rgba(255,255,255,0.4)]',
                'transition-all duration-200',
                'hover:bg-red-50 hover:text-red-500',
                'hover:[box-shadow:3px_3px_6px_rgba(239,68,68,0.2),-3px_-3px_6px_rgba(255,255,255,0.4)]',
                'active:[box-shadow:inset_2px_2px_4px_rgba(163,177,198,0.5),inset_-2px_-2px_4px_rgba(255,255,255,0.4)]',
                'focus:outline-none focus:ring-2 focus:ring-red-400/50'
              )}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        className={cn(
          'w-auto p-0',
          'rounded-xl bg-[#E0E5EC]',
          '[box-shadow:6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.45)]',
          'z-[100]',
          'max-w-[260px]'
        )}
        align="start"
        sideOffset={4}
      >
        <div className="p-1.5">
          <div
            className={cn(
              'rounded-lg bg-[#E0E5EC] p-1',
              '[box-shadow:inset_1px_1px_2px_rgba(163,177,198,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.35)]'
            )}
          >
            <style jsx global>{`
              .rdp {
                --rdp-cell-size: 28px !important;
                --rdp-day-size: 28px !important;
                --rdp-accent-color: #3b82f6;
                margin: 0;
              }
              .rdp-caption_label {
                font-size: 11px !important;
                padding: 2px 0 !important;
              }
              .rdp-head_cell {
                font-size: 10px !important;
                height: 20px !important;
              }
              .rdp-day {
                height: 28px !important;
                width: 28px !important;
                font-size: 11px !important;
              }
              .rdp-week {
                margin: 0 !important;
              }
              .rdp-months {
                gap: 0 !important;
              }
              .rdp-button_reset {
                height: 28px !important;
                width: 28px !important;
              }
            `}</style>
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
              classNames={{
                months: 'flex flex-row gap-1',
                month: 'space-y-0.5',
                caption: 'flex justify-center py-0.5 relative items-center gap-1',
                caption_label: 'text-xs font-medium text-[#3D4852]',
                nav: 'space-x-0.5 flex items-center',
                nav_button: cn(
                  'h-5 w-5 flex items-center justify-center',
                  'rounded bg-[#E0E5EC]',
                  '[box-shadow:1px_1px_2px_rgba(163,177,198,0.3),-1px_-1px_2px_rgba(255,255,255,0.4)]',
                  'hover:[box-shadow:inset_1px_1px_2px_rgba(163,177,198,0.3)]',
                  'disabled:opacity-40'
                ),
                nav_button_previous: 'absolute left-0.5',
                nav_button_next: 'absolute right-0.5',
                table: 'w-full border-collapse',
                head_row: 'flex h-5',
                head_cell: cn(
                  'w-7 flex-1 flex items-center justify-center',
                  'text-[0.6rem] font-medium text-[#3D4852]/60 uppercase'
                ),
                row: 'flex h-7',
                cell: cn(
                  'flex-1 h-7 p-0 text-center relative',
                  '[&:has([aria-selected])]:bg-[#3B82F6]/10'
                ),
                day: cn(
                  'h-6 w-6 m-auto p-0 font-medium',
                  'rounded bg-transparent',
                  'hover:bg-[#3B82F6]/10',
                  'focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/40',
                  'aria-selected:bg-[#3B82F6] aria-selected:text-white'
                ),
                day_range_start: 'rounded-l',
                day_range_end: 'rounded-r',
                day_selected: 'bg-[#3B82F6] text-white hover:bg-[#3B82F6]',
                day_today: 'font-bold text-[#3B82F6]',
                day_outside: 'text-[#3D4852]/30',
                day_disabled: 'text-[#3D4852]/25 cursor-not-allowed',
                day_range_middle: 'bg-[#3B82F6]/5',
              }}
            />
          </div>

          {value && (
            <div className="mt-1 flex items-center justify-between text-[0.65rem]">
              <span className="text-[#3D4852]/70">{formattedDate}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                  setOpen(false);
                }}
                className="h-5 px-1.5 text-red-500 hover:bg-red-50"
              >
                Clear
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

DatePicker.displayName = 'DatePicker';

export { DatePicker };
export type { DatePickerProps };
