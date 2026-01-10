'use client';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-foreground">{label}</label>}
      <input
        className={`flex h-11 w-full rounded-xl bg-surface-inset px-4 py-2.5 text-foreground neu-inset focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground ${error ? 'ring-2 ring-destructive' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
