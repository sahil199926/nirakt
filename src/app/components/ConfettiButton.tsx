"use client";

import confetti from "canvas-confetti";
import { type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface ConfettiButtonProps {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function ConfettiButton({
  children,
  onClick,
  className = "",
  disabled = false,
  type = "button",
}: ConfettiButtonProps) {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    confetti({
      particleCount: 60,
      spread: 55,
      origin: { y: 0.7 },
      colors: ["#006B8F", "#00A8C6", "#FF6B35", "#40E0D0"],
    });
    onClick?.(e);
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center transition-all duration-200",
        className
      )}
    >
      {children}
    </button>
  );
}
