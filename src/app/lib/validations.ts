import { z } from "zod";

export const heroFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  destinationType: z.string().min(1, "Please select a destination type"),
  travelDate: z.string().refine((val) => new Date(val) > new Date(), {
    message: "Travel date must be in the future",
  }),
});

export const bannerFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  destinationType: z.string().min(1, "Please select a destination type"),
  preferredDestination: z.string().optional(),
  travelDate: z.string().refine((val) => new Date(val) > new Date(), {
    message: "Travel date must be in the future",
  }),
  travelers: z.number().min(1).optional(),
  budget: z.string().optional(),
  message: z.string().optional(),
});

export type HeroFormData = z.infer<typeof heroFormSchema>;
export type BannerFormData = z.infer<typeof bannerFormSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
