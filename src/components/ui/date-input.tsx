"use client";

import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

type DateInputProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  min?: string;
  id?: string;
  name?: string;
  placeholder?: string;
  className?: string;
  displayClassName?: string;
};

export function DateInput({
  value,
  onChange,
  onBlur,
  min,
  id,
  name,
  placeholder = "Select date",
  className,
  displayClassName,
}: DateInputProps) {
  const displayValue = value
    ? format(parseISO(value), "d MMM yyyy")
    : placeholder;

  return (
    <div className={cn("relative w-full min-w-0 overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 rounded-xl", className)}>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none flex w-full min-w-0 items-center truncate pl-10 pr-3 py-2.5 bg-sand border border-text-muted rounded-xl text-sm",
          value ? "text-primary" : "text-text-muted",
          displayClassName
        )}
      >
        {displayValue}
      </div>
      <input
        id={id}
        name={name}
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </div>
  );
}
