import { cn } from '../../lib/utils';
import React, { forwardRef } from 'react';

export interface NeuTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const NeuTextarea = forwardRef<HTMLTextAreaElement, NeuTextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    // Generate an ID if not provided, for accessibility
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-[#3D4852] mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full px-4 py-3 rounded-xl bg-[#E0E5EC] text-[#3D4852] min-h-[120px] resize-y',
            'shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]',
            'focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-opacity-50',
            'placeholder:text-[#6B7280]',
            'transition-all duration-200',
            error ? 'ring-2 ring-red-500' : '',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

NeuTextarea.displayName = 'NeuTextarea';
