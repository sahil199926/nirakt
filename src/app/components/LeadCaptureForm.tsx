"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  heroFormSchema,
  bannerFormSchema,
  contactFormSchema,
  type HeroFormData,
  type BannerFormData,
  type ContactFormData,
} from "@/app/lib/validations";
import { DESTINATION_TYPES, BUDGET_RANGES } from "@/app/lib/constants";
import { cn } from "@/lib/utils";

interface LeadCaptureFormProps {
  variant: "hero" | "banner" | "full";
  onSuccess?: () => void;
  className?: string;
}

export function LeadCaptureForm({
  variant,
  onSuccess,
  className = "",
}: LeadCaptureFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const schema =
    variant === "hero"
      ? heroFormSchema
      : variant === "banner"
      ? bannerFormSchema
      : contactFormSchema;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<HeroFormData | BannerFormData | ContactFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (
    data: HeroFormData | BannerFormData | ContactFormData
  ) => {
    setIsSubmitting(true);
    try {
      // Simulate API call / EmailJS integration
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Form submitted:", data);
      setIsSuccess(true);
      onSuccess?.();
      setTimeout(() => {
        setIsSuccess(false);
        reset();
      }, 4000);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <CheckCircle2 className="w-12 h-12 text-tertiary mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">
          Thank You!
        </h3>
        <p className="text-white/70">
          Our travel expert will contact you within 30 minutes.
        </p>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`flex flex-col sm:flex-row gap-3 ${className}`}
      >
        <div className="flex-1">
          <Input
            placeholder="Your Name"
            className="bg-white border-0 text-primary placeholder:text-primary/50 h-12 rounded-lg"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-300 mt-1">{errors.name.message}</p>
          )}
        </div>
        <div className="flex-1">
          <Input
            placeholder="Phone Number"
            className="bg-white border-0 text-primary placeholder:text-primary/50 h-12 rounded-lg"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-xs text-red-300 mt-1">{errors.phone.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-12 px-8 bg-accent text-white font-semibold rounded-lg hover:brightness-110 transition-all shadow-button whitespace-nowrap disabled:opacity-70"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Get Free Call Back"
          )}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <div
        className={
          variant === "full"
            ? "grid grid-cols-1 md:grid-cols-2 gap-4"
            : "space-y-4"
        }
      >
        <div>
          <Label
            htmlFor={`name-${variant}`}
            className={variant === "hero" ? "text-white/80" : "text-primary"}
          >
            Full Name *
          </Label>
          <Input
            id={`name-${variant}`}
            placeholder="John Doe"
            className={
              variant === "hero"
                ? "bg-white/10 border-white/20 text-white placeholder:text-white/50 mt-1.5"
                : "bg-white border-border text-primary mt-1.5"
            }
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor={`phone-${variant}`}
            className={variant === "hero" ? "text-white/80" : "text-primary"}
          >
            Phone/WhatsApp *
          </Label>
          <Input
            id={`phone-${variant}`}
            type="tel"
            placeholder="9876543210"
            className={
              variant === "hero"
                ? "bg-white/10 border-white/20 text-white placeholder:text-white/50 mt-1.5"
                : "bg-white border-border text-primary mt-1.5"
            }
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-xs text-red-400 mt-1">
              {errors.phone.message}
            </p>
          )}
        </div>

        {variant === "full" && (
          <>
            <div>
              <Label
                htmlFor="email-full"
                className="text-primary"
              >
                Email
              </Label>
              <Input
                id="email-full"
                type="email"
                placeholder="you@example.com"
                className="bg-white border-border text-primary mt-1.5"
                {...register("email")}
              />
              {(errors as Record<string, { message?: string }>).email && (
                <p className="text-xs text-red-400 mt-1">
                  {(errors as Record<string, { message?: string }>).email?.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="preferredDestination-full" className="text-primary">
                Preferred Destination
              </Label>
              <Input
                id="preferredDestination-full"
                placeholder="e.g., Kerala, Bali"
                className="bg-white border-border text-primary mt-1.5"
                {...register("preferredDestination")}
              />
            </div>
          </>
        )}

        <div>
          <Label
            htmlFor={`destinationType-${variant}`}
            className={variant === "hero" ? "text-white/80" : "text-primary"}
          >
            Destination Interest *
          </Label>
          <Select
            onValueChange={(value) =>
              setValue("destinationType" as const, value as string)
            }
          >
            <SelectTrigger
              id={`destinationType-${variant}`}
              className={cn(
                variant === "hero"
                  ? "bg-white/10 border-white/20 text-white mt-1.5 [&>span]:text-white/50"
                  : "bg-white border-border text-primary mt-1.5",
                (errors as Record<string, { message?: string }>).destinationType && "border-red-400"
              )}
            >
              <SelectValue placeholder="Select Destination Type" />
            </SelectTrigger>
            <SelectContent>
              {DESTINATION_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(errors as Record<string, { message?: string }>).destinationType && (
            <p className="text-xs text-red-400 mt-1">
              {(errors as Record<string, { message?: string }>).destinationType?.message}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor={`travelDate-${variant}`}
            className={variant === "hero" ? "text-white/80" : "text-primary"}
          >
            Travel Date *
          </Label>
          <Input
            id={`travelDate-${variant}`}
            type="date"
            min={new Date().toISOString().split("T")[0]}
            className={
              variant === "hero"
                ? "bg-white/10 border-white/20 text-white mt-1.5 [color-scheme:dark]"
                : "bg-white border-border text-primary mt-1.5"
            }
            {...register("travelDate")}
          />
          {(errors as Record<string, { message?: string }>).travelDate && (
            <p className="text-xs text-red-400 mt-1">
              {(errors as Record<string, { message?: string }>).travelDate?.message}
            </p>
          )}
        </div>

        {variant === "full" && (
          <>
            <div>
              <Label htmlFor="travelers-full" className="text-primary">
                Number of Travelers
              </Label>
              <Input
                id="travelers-full"
                type="number"
                min={1}
                placeholder="2"
                className="bg-white border-border text-primary mt-1.5"
                {...register("travelers", { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="budget-full" className="text-primary">
                Budget Range
              </Label>
              <Select
                onValueChange={(value) =>
                  setValue("budget" as const, value as string)
                }
              >
                <SelectTrigger
                  id="budget-full"
                  className="bg-white border-border text-primary mt-1.5"
                >
                  <SelectValue placeholder="Select Budget" />
                </SelectTrigger>
                <SelectContent>
                  {BUDGET_RANGES.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </div>

      {variant === "full" && (
        <div className="mt-4">
          <Label htmlFor="message-full" className="text-primary">
            Message
          </Label>
          <Textarea
            id="message-full"
            placeholder="Tell us more about your dream trip..."
            rows={4}
            className="bg-white border-border text-primary mt-1.5"
            {...register("message")}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "w-full mt-6 bg-accent text-white font-semibold rounded-lg hover:brightness-110 transition-all shadow-button disabled:opacity-70",
          variant === "hero" ? "h-12 text-base" : "h-12 text-base"
        )}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Sending...
          </span>
        ) : variant === "hero" ? (
          "Get My Free Quote"
        ) : (
          "Send My Enquiry"
        )}
      </button>

      {variant === "hero" && (
        <p className="flex items-center justify-center gap-1.5 text-xs text-white/50 mt-4">
          <Lock className="w-3 h-3" />
          We respect your privacy. No spam, ever.
        </p>
      )}
    </form>
  );
}
