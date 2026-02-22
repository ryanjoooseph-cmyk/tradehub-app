'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm text-neutral-50 shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// Calendar-specific job tooltip
interface JobTooltipProps {
  title: string;
  location: string;
  time: string;
  crew: string[];
  status?: string;
  children: React.ReactNode;
}

function JobTooltip({ title, location, time, crew, status, children }: JobTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="space-y-2">
          <div>
            <p className="font-semibold text-white">{title}</p>
            {status && (
              <p className="text-xs text-neutral-400 mt-0.5">
                Status: <span className="capitalize">{status}</span>
              </p>
            )}
          </div>
          <div className="text-xs space-y-1">
            <p>
              <span className="text-neutral-500">Location:</span>{' '}
              <span className="text-neutral-300">{location}</span>
            </p>
            <p>
              <span className="text-neutral-500">Time:</span>{' '}
              <span className="text-neutral-300">{time}</span>
            </p>
            {crew.length > 0 && (
              <p>
                <span className="text-neutral-500">Crew:</span>{' '}
                <span className="text-neutral-300">{crew.join(', ')}</span>
              </p>
            )}
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, JobTooltip };
