'use client';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined';
}

export function Card({ className = '', variant = 'default', children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl p-6 transition-shadow duration-300 hover:shadow-xl ${
        variant === 'default' ? 'neu-raised bg-surface' : 'border-2 border-border'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`mb-4 ${className}`} {...props}>{children}</div>;
}

export function CardContent({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={className} {...props}>{children}</div>;
}

export function CardFooter({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`mt-4 pt-4 border-t border-border ${className}`} {...props}>{children}</div>;
}
