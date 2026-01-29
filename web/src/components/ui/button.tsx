import * as React from "react";
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "secondary" | "ghost" };
export function Button(props: ButtonProps) {
  const { className = "", variant = "default", ...rest } = props;
  const base = "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition disabled:opacity-60 disabled:pointer-events-none";
  const variants: Record<string, string> = {
    default: "bg-black text-white hover:bg-neutral-800",
    secondary: "bg-neutral-100 text-black hover:bg-neutral-200",
    ghost: "bg-transparent text-black hover:bg-neutral-100",
  };
  return <button className={[base, variants[variant], className].join(" ")} {...rest} />;
}
