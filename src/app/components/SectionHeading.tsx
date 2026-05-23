import { ScrollReveal } from "./ScrollReveal";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  label: string;
  title: string;
  subtitle?: string;
  light?: boolean;
  className?: string;
}

export function SectionHeading({ label, title, subtitle, light = false, className = "" }: SectionHeadingProps) {
  return (
    <div className={cn("text-center max-w-2xl mx-auto", className)}>
      <ScrollReveal delay={0}>
        <span className={cn("inline-block text-[11px] font-bold tracking-[0.12em] uppercase mb-2", light ? "text-accent/80" : "text-primary")}>
          {label}
        </span>
      </ScrollReveal>
      <ScrollReveal delay={0.08}>
        <h2 className={cn("text-2xl md:text-3xl font-bold tracking-tight mb-2", light ? "text-white" : "text-primary")}>
          {title}
        </h2>
      </ScrollReveal>
      {subtitle && (
        <ScrollReveal delay={0.15}>
          <p className={cn("text-sm", light ? "text-white/55" : "text-text-muted")}>{subtitle}</p>
        </ScrollReveal>
      )}
    </div>
  );
}
