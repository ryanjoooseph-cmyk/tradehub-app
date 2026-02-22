import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary-500/15 text-primary-500 border-primary-500',
        success: 'border-transparent bg-success-500/15 text-success-500 border-success-500',
        warning: 'border-transparent bg-warning-500/15 text-warning-500 border-warning-500',
        danger: 'border-transparent bg-danger-500/15 text-danger-500 border-danger-500',
        info: 'border-transparent bg-info-500/15 text-info-500 border-info-500',
        neutral: 'border-transparent bg-neutral-500/15 text-neutral-400 border-neutral-500',
        outline: 'text-foreground',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  status?: 'in-progress' | 'pending' | 'at-risk' | 'scheduled' | 'completed' | 'cancelled';
}

function Badge({ className, variant, size, status, ...props }: BadgeProps) {
  // Map status to variant
  const variantFromStatus = status
    ? {
        'in-progress': 'success' as const,
        pending: 'warning' as const,
        'at-risk': 'danger' as const,
        scheduled: 'info' as const,
        completed: 'neutral' as const,
        cancelled: 'neutral' as const,
      }[status]
    : variant;

  return (
    <div className={cn(badgeVariants({ variant: variantFromStatus, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
