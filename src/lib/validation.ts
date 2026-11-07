import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  mobile: z
    .string()
    .trim()
    .min(10, "Enter a valid mobile number.")
    .max(15)
    .regex(/^[0-9+\-\s]+$/, "Enter a valid mobile number."),
  email: z.string().trim().email("Enter a valid email address.").max(191),
  service: z.string().trim().min(2, "Select a service.").max(120),
  message: z.string().trim().min(10, "Please add a short message.").max(2000),
});

export const loginSchema = z.object({
  identifier: z.string().trim().min(3, "Enter your login ID.").max(80),
  password: z.string().min(1, "Enter your password.").max(128),
});

export const createClientSchema = z.object({
  name: z.string().trim().min(2, "Enter the client full name.").max(120),
  mobile: z
    .string()
    .trim()
    .min(10, "Enter a valid mobile number.")
    .max(15)
    .regex(/^[0-9+\-\s]+$/, "Enter a valid mobile number."),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: z
      .string()
      .min(10, "Use at least 10 characters.")
      .regex(/[A-Z]/, "Include an uppercase letter.")
      .regex(/[a-z]/, "Include a lowercase letter.")
      .regex(/[0-9]/, "Include a number.")
      .regex(/[^A-Za-z0-9]/, "Include a special character."),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const websiteSettingsSchema = z.object({
  websiteName: z.string().trim().min(2).max(80),
  tagline: z.string().trim().min(8).max(240),
  subBrand: z.string().trim().min(2).max(120),
  contactPhone: z.string().trim().min(8).max(20),
  whatsappNumber: z.string().trim().min(10).max(20),
  email: z.string().trim().email().max(191),
  address: z.string().trim().min(10).max(400),
  websiteUrl: z.string().trim().url(),
  footerText: z.string().trim().min(8).max(500),
  googleReviewsUrl: z.string().trim().url(),
  googleReviewCount: z.string().trim().max(10),
  mapsEmbedUrl: z.string().trim().min(8),
  mapsDirectionsUrl: z.string().trim().url(),
});

export const testimonialSchema = z.object({
  quote: z.string().trim().min(8).max(600),
  author: z.string().trim().max(80).optional(),
  source: z.string().trim().max(80).optional(),
  isEnabled: z.boolean().optional(),
});

export const documentMetaSchema = z.object({
  clientId: z.string().min(1),
  documentName: z.string().trim().min(2).max(160),
  categoryName: z.string().trim().min(2).max(80),
  description: z.string().trim().max(500).optional(),
});
