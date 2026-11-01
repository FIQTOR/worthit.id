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
          <label className="block text-sm font-medium text-[var(--tx)] mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--mu)]">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-3 bg-[var(--f)] border border-[var(--bd)] rounded-xl text-[var(--tx)] placeholder:text-[var(--mu)]',
              'focus:outline-none focus:ring-2 focus:ring-[var(--ac)] focus:border-transparent',
              'transition-smooth',
              prefix && 'pl-10',
              suffix && 'pr-10',
              error && 'border-[var(--r)] focus:ring-[var(--r)]',
              className
            )}
            {...props}
          />
          {suffix && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--mu)]">
              {suffix}
            </span>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-[var(--r)]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
