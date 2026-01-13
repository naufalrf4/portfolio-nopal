import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'w-full h-9 px-3 py-2 text-sm text-left rounded-xl bg-[#E0E5EC]',
            '[box-shadow:4px_4px_8px_rgba(163,177,198,0.5),-4px_-4px_8px_rgba(255,255,255,0.5)]',
            'transition-all duration-200',
            'hover:[box-shadow:5px_5px_10px_rgba(163,177,198,0.55),-5px_-5px_10px_rgba(255,255,255,0.55)]',
            'active:[box-shadow:inset_3px_3px_6px_rgba(163,177,198,0.5),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0',
            !value && 'text-[#6B7280]',
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="w-4 h-4 mr-2 text-[#3B82F6]" />
          {value ? formattedDate : placeholder}
          {value && (
            <X
              className="w-3.5 h-3.5 ml-auto text-[#6B7280] hover:text-red-500 transition-colors"
              onClick={handleClear}
            />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        className={cn(
          'w-auto p-0',
          'rounded-xl bg-[#E0E5EC]',
          '[box-shadow:6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.45)]',
          'z-[100]',
          'max-w-[240px]'
        )}
        align="start"
        sideOffset={4}
      >
        <style jsx global>{`
          .rdp {
            --rdp-cell-size: 26px !important;
            --rdp-day-size: 26px !important;
            margin: 0;
          }
          .rdp-caption_label {
            font-size: 11px !important;
            padding: 2px 0 !important;
          }
          .rdp-head_cell {
            font-size: 9px !important;
            height: 18px !important;
          }
          .rdp-day {
            height: 26px !important;
            width: 26px !important;
            font-size: 10px !important;
            margin: 0 auto !important;
          }
          .rdp-week {
            margin: 0 !important;
            height: 26px !important;
          }
          .rdp-months {
            gap: 0 !important;
          }
          .rdp-button_reset {
            height: 26px !important;
            width: 26px !important;
          }
        `}</style>
        <div className="p-2">
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
              months: 'flex flex-row gap-2',
              month: 'space-y-0',
              caption: 'flex justify-center py-0 relative items-center gap-1',
              caption_label: 'text-xs font-medium text-[#3D4852]',
              nav: 'absolute w-full flex justify-between px-1 top-0',
              nav_button: cn(
                'h-5 w-5 flex items-center justify-center rounded bg-[#E0E5EC]',
                '[box-shadow:1px_1px_2px_rgba(163,177,198,0.3),-1px_-1px_2px_rgba(255,255,255,0.4)]',
                'hover:[box-shadow:inset_1px_1px_2px_rgba(163,177,198,0.3)]',
                'disabled:opacity-40'
              ),
              nav_button_previous: '',
              nav_button_next: '',
              table: 'w-full border-collapse',
              head_row: 'flex h-4',
              head_cell: cn(
                'w-6 flex-1 flex items-center justify-center text-[0.55rem] font-medium text-[#3D4852]/60 uppercase'
              ),
              row: 'flex h-6',
              cell: cn(
                'flex-1 h-6 p-0 text-center relative [&:has([aria-selected])]:bg-[#3B82F6]/10'
              ),
              day: cn(
                'h-5 w-5 m-auto p-0 font-medium rounded bg-transparent hover:bg-[#3B82F6]/10 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/40 aria-selected:bg-[#3B82F6] aria-selected:text-white'
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
      </PopoverContent>
    </Popover>
  );
}

DatePicker.displayName = 'DatePicker';

export { DatePicker };
export type { DatePickerProps };
