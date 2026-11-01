import { ReactNode } from 'react';
import { cn } from '@/utils/helpers';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

export function Card({ children, className, hover, padding = 'md' }: CardProps) {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div
      className={cn(
        'bg-surface rounded-card-lg shadow-card border border-border',
        paddings[padding],
        hover && 'hover:shadow-card-hover transition-smooth cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}
