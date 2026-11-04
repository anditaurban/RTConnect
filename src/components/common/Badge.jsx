import React from 'react';
import { getStatusBadgeConfig } from '../../utils/formatters';

export function Badge({ status, label, size = 'md', className = '' }) {
  const config = getStatusBadgeConfig(status || label);
  const text = label || status;

  const sizeClasses = size === 'sm'
    ? 'text-xs px-2 py-0.5'
    : 'text-xs font-medium px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
      <span>{text}</span>
    </span>
  );
}

