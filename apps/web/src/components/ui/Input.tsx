import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/helpers';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  prefix?: string;
  suffix?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, prefix, suffix, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-primary mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-secondary',
              'focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent',
              'transition-smooth',
              prefix && 'pl-10',
              suffix && 'pr-10',
              error && 'border-danger focus:ring-danger',
              className
            )}
            {...props}
          />
          {suffix && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary">
              {suffix}
            </span>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-danger">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
