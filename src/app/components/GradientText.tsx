import type { ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
}

export function GradientText({ children, className = "" }: GradientTextProps) {
  return (
    <span
      className={`bg-gradient-to-r from-secondary to-tertiary bg-clip-text text-transparent ${className}`}
    >
      {children}
    </span>
  );
}
