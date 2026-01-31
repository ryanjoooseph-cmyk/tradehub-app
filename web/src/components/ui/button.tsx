import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold tracking-tight transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/25 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/25 hover:bg-emerald-500/20 dark:bg-emerald-400/10 dark:text-emerald-200 dark:hover:bg-emerald-400/15",
        secondary:
          "bg-zinc-900/5 text-zinc-900 ring-1 ring-zinc-200 hover:bg-zinc-900/10 dark:bg-zinc-50/5 dark:text-zinc-100 dark:ring-zinc-800 dark:hover:bg-zinc-50/10",
        outline:
          "bg-transparent text-zinc-900 ring-1 ring-zinc-200 hover:bg-zinc-900/5 dark:text-zinc-100 dark:ring-zinc-800 dark:hover:bg-zinc-50/10",
        ghost:
          "bg-transparent text-zinc-900 hover:bg-zinc-900/5 dark:text-zinc-100 dark:hover:bg-zinc-50/10",
        destructive:
          "bg-rose-500/10 text-rose-700 ring-1 ring-rose-500/20 hover:bg-rose-500/15 dark:text-rose-200 dark:bg-rose-400/10 dark:hover:bg-rose-400/15",
        link:
          "bg-transparent p-0 text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-200",
      },
      size: {
        sm: "h-9 px-3",
        default: "h-10 px-4",
        lg: "h-11 px-5",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "secondary", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
