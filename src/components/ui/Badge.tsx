import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'brand' | 'success' | 'warning' | 'neutral' | 'danger' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'neutral', size = 'sm', className = '' }: BadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium rounded-full',
    md: 'px-2.5 py-1 text-xs font-semibold rounded-full',
  };

  const variantClasses = {
    brand: 'bg-brand-50 text-brand-700 border border-brand-200/60',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200/80',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200/60',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200/60',
  };

  return (
    <span className={`inline-flex items-center gap-1 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
