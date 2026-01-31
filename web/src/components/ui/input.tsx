import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-11 w-full rounded-2xl bg-white/70 px-4 text-sm text-zinc-900 ring-1 ring-zinc-200 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-emerald-500/25 dark:bg-zinc-950/40 dark:text-zinc-100 dark:ring-zinc-800 dark:placeholder:text-zinc-500",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
