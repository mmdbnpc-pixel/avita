import { SelectHTMLAttributes, ReactNode } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  icon?: ReactNode;
  error?: string;
}

export default function Select({ label, icon, error, className = '', children, ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-navy-900">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <select
          {...props}
          className={`w-full rounded-xl border bg-white py-2.5 text-sm outline-none transition-colors
            ${icon ? 'pr-10 pl-3' : 'px-3'}
            ${error ? 'border-red-400' : 'border-ivory-200 focus:border-navy-900'}
            ${className}`}
        >
          {children}
        </select>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}