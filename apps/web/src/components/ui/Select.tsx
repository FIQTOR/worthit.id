import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/helpers';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-primary mb-2">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary',
            'focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent',
            'transition-smooth appearance-none cursor-pointer',
            error && 'border-danger focus:ring-danger',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-2 text-sm text-danger">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
