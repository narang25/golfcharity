import { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

/**
 * Reusable Card component — style and implement during UI build phase.
 */
export function Card({ children, ...props }: CardProps) {
  return <div {...props}>{children}</div>;
}
