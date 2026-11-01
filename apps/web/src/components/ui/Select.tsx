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
          <label className="block text-sm font-medium text-[var(--tx)] mb-2">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-3 bg-[var(--f)] border border-[var(--bd)] rounded-xl text-[var(--tx)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--ac)] focus:border-transparent',
            'transition-smooth appearance-none cursor-pointer',
            error && 'border-[var(--r)] focus:ring-[var(--r)]',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[var(--c)] text-[var(--tx)]">
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-2 text-sm text-[var(--r)]">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
