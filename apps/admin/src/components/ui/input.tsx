import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-12 w-full rounded-2xl bg-[#E0E5EC] px-4 py-3',
        'text-base text-[#3D4852]',
        'border-none outline-none',
        'transition-all duration-300 ease-out',
        '[box-shadow:inset_10px_10px_20px_rgba(163,177,198,0.7),inset_-10px_-10px_20px_rgba(255,255,255,0.6)]',
        'placeholder:text-[#6B7280] placeholder:opacity-70',
        'focus:ring-2 focus:ring-[#3B82F6]/30 focus:ring-offset-2 focus:ring-offset-[#E0E5EC]',
        'focus:[box-shadow:inset_10px_10px_20px_rgba(163,177,198,0.7),inset_-10px_-10px_20px_rgba(255,255,255,0.6)]',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#E0E5EC]/80',
        'file:border-none file:bg-transparent file:text-sm file:font-medium file:text-[#3D4852]',
        'file:mr-4 file:rounded-xl file:px-4 file:py-2',
        'file:transition-all file:duration-300',
        'file:hover:bg-[#D1D9E6]',
        '[&:-webkit-autofill]:bg-[#E0E5EC]',
        '[&:-webkit-autofill]:[-webkit-box-shadow:inset_10px_10px_20px_rgba(163,177,198,0.7),inset_-10px_-10px_20px_rgba(255,255,255,0.6),0_0_0_1000px_#E0E5EC_inset]',
        '[&:-webkit-autofill]:[-webkit-text-fill-color:#3D4852]',
        'aria-invalid:ring-2 aria-invalid:ring-red-500/30',
        'selection:bg-[#3B82F6]/20 selection:text-[#3D4852]',
        className
      )}
      {...props}
    />
  );
}

export { Input };
