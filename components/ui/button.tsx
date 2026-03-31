import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
}

/**
 * Reusable Button component — style and implement during UI build phase.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  void variant;
  void size;
  return <button {...props}>{children}</button>;
}
