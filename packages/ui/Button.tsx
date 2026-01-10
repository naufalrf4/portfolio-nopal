'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl';
  const variants = {
    primary: 'bg-primary text-primary-foreground neu-raised hover:shadow-lg active:neu-inset active:scale-[0.98]',
    secondary: 'bg-surface text-foreground neu-raised hover:shadow-lg active:neu-inset active:scale-[0.98]',
    ghost: 'bg-transparent hover:bg-surface/50 hover:neu-raised',
    outline: 'border-2 border-primary/30 bg-transparent hover:border-primary',
  };
  const sizes = {
    sm: 'h-9 px-4 py-2 text-sm',
    md: 'h-11 px-6 py-2.5',
    lg: 'h-12 px-8 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
