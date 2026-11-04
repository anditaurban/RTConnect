import React from 'react';

export function Card({ children, className = '', hover = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm transition-all duration-200 ${
        hover ? 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between gap-4 ${className}`}>
      <div>
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-base">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={`p-4 sm:p-5 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`p-4 sm:p-5 bg-slate-50/70 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-700/80 rounded-b-xl flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
}
