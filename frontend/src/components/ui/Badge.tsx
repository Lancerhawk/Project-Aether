'use client';

import { type ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'muted';
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: 'bg-[rgba(99,102,241,0.15)] text-[#818cf8]',
  success: 'bg-[rgba(52,211,153,0.15)] text-[#34d399]',
  warning: 'bg-[rgba(251,191,36,0.15)] text-[#fbbf24]',
  error: 'bg-[rgba(244,63,94,0.15)] text-[#f43f5e]',
  info: 'bg-[rgba(96,165,250,0.15)] text-[#60a5fa]',
  muted: 'bg-[rgba(255,255,255,0.06)] text-[#94949e]',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-1.5 py-0.5 text-[11px]',
  md: 'px-2 py-0.5 text-[12px]',
};

export function Badge({ children, variant = 'default', size = 'sm', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium rounded-md whitespace-nowrap ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}
