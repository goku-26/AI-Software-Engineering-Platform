import React from 'react';

export const Input = React.forwardRef(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-medium text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full bg-surface-subtle border ${
              error ? 'border-red-500' : 'border-surface-border'
            } text-slate-100 rounded-lg text-sm transition-all focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 ${
              icon ? 'pl-9' : 'px-3.5'
            } py-2.5 placeholder-slate-500 ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
