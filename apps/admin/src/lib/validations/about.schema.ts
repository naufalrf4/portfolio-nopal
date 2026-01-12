import { z } from 'zod';

const experienceItemSchema = z.object({
  type: z.enum(['Education', 'Work', 'Organizational']),
  title: z.string().min(1).max(200),
  organization: z.string().min(1).max(200),
  location: z.string().optional().or(z.literal('')),
  startDate: z.string().min(1),
  endDate: z.string().optional().or(z.literal('')).nullable(),
  description: z.string().optional().or(z.literal('')),
  logoUrl: z.string().url().optional().or(z.literal('')),
});

const socialLinksSchema = z.object({
  github: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  instagram: z.string().url().optional().or(z.literal('')),
  youtube: z.string().url().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
});

export const updateAboutSchema = z.object({
  fullName: z.string().min(2).max(100),
  tagline: z.string().max(200).optional().or(z.literal('')).nullable(),
  roles: z.array(z.string()).max(10),
  bio: z.string().optional().or(z.literal('')),
  email: z.string().email(),
  phone: z.string().optional().or(z.literal('')).nullable(),
  location: z.string().optional().or(z.literal('')).nullable(),
  avatarUrl: z.string().url().optional().or(z.literal('')).nullable(),
  resumeUrl: z.string().url().optional().or(z.literal('')).nullable(),
  skills: z.array(z.string()).max(50),
  experience: z.array(experienceItemSchema).optional().nullable(),
  socialLinks: socialLinksSchema.optional().nullable(),
});

export type UpdateAboutInput = z.infer<typeof updateAboutSchema>;
export type ExperienceItem = z.infer<typeof experienceItemSchema>;
export type SocialLinks = z.infer<typeof socialLinksSchema>;
