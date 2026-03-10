import { ButtonHTMLAttributes, ReactNode } from "react";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "ghost";
}

export function NeonButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: NeonButtonProps) {
  const base =
    "relative inline-flex items-center justify-center gap-2 px-5 py-2.5 " +
    "rounded-button font-mono text-sm font-semibold tracking-wide " +
    "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 " +
    "focus-visible:ring-[rgb(var(--color-primary))] disabled:opacity-50 disabled:pointer-events-none";

  const styles: Record<string, string> = {
    primary:
      "bg-[rgb(var(--color-primary)/0.12)] text-[rgb(var(--color-primary))] " +
      "border border-[rgb(var(--color-primary)/0.45)] " +
      "hover:bg-[rgb(var(--color-primary)/0.22)] hover:border-[rgb(var(--color-primary)/0.7)] " +
      "neon-glow hover:shadow-[0_0_28px_rgb(var(--color-primary)/0.55)]",
    ghost:
      "bg-transparent text-[rgb(var(--color-primary))] " +
      "border border-[rgb(var(--color-primary)/0.20)] " +
      "hover:bg-[rgb(var(--color-primary)/0.08)] hover:border-[rgb(var(--color-primary)/0.45)]",
  };

  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
