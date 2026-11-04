import React from 'react';

export function Select({
  label,
  id,
  value,
  onChange,
  options = [],
  required = false,
  error,
  helperText,
  className = '',
  placeholder = 'Pilih opsi...',
  ...props
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={onChange}
        required={required}
        className={`block w-full rounded-lg border text-sm transition-colors py-2 px-3 text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 ${
          error
            ? 'border-rose-300 dark:border-rose-700 focus:border-rose-500 focus:ring-rose-200 dark:focus:ring-rose-900'
            : 'border-slate-300 dark:border-slate-700 focus:border-brand-500 focus:ring-brand-100 dark:focus:ring-brand-900'
        }`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={val} value={val} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
              {lbl}
            </option>
          );
        })}
      </select>
      {error ? (
        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
}
