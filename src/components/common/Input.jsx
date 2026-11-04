import React from 'react';

export function Input({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  error,
  helperText,
  icon: Icon,
  className = '',
  disabled = false,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative rounded-lg shadow-xs">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon className="h-4 w-4 text-slate-400 dark:text-slate-500" aria-hidden="true" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`block w-full rounded-lg border text-sm transition-colors py-2 px-3 text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:text-slate-500 dark:disabled:text-slate-400 ${
            Icon ? 'pl-9' : ''
          } ${
            error
              ? 'border-rose-300 dark:border-rose-700 focus:border-rose-500 focus:ring-rose-200 dark:focus:ring-rose-900'
              : 'border-slate-300 dark:border-slate-700 focus:border-brand-500 focus:ring-brand-100 dark:focus:ring-brand-900'
          }`}
          {...props}
        />
      </div>
      {error ? (
        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
}

export function Textarea({
  label,
  id,
  rows = 3,
  placeholder,
  value,
  onChange,
  required = false,
  error,
  helperText,
  className = '',
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`block w-full rounded-lg border text-sm transition-colors py-2 px-3 text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 ${
          error
            ? 'border-rose-300 dark:border-rose-700 focus:border-rose-500 focus:ring-rose-200 dark:focus:ring-rose-900'
            : 'border-slate-300 dark:border-slate-700 focus:border-brand-500 focus:ring-brand-100 dark:focus:ring-brand-900'
        }`}
        {...props}
      />
      {error ? (
        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
}
