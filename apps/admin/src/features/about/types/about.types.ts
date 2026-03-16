export type ExperienceType = 'Education' | 'Work' | 'Organizational' | 'Certification';

export interface ExperienceItem {
  type: ExperienceType;
  title: string;
  organization: string;
  location?: string;
  startDate: string;
  endDate?: string | null;
  description?: string;
  logoUrl?: string;
  skills?: string[];
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  website?: string;
}

export interface FreelanceFeaturePrice {
  feature: string;
  price?: number | null;
  notes?: string;
  relatedProjectSlugs?: string[];
}

export interface FreelanceProjectReference {
  slug: string;
  title: string;
  notes?: string;
}

export interface FreelanceProfile {
  hourlyRate?: number | null;
  currency?: string;
  completedProjects?: number | null;
  pricingNotes?: string;
  featurePricing?: FreelanceFeaturePrice[];
  projectReferences?: FreelanceProjectReference[];
}

export interface AboutMeData {
  id: string;
  fullName: string;
  tagline: string | null;
  roles: string[];
  shortBio: string | null;
  bio: string | null;
  email: string;
  phone: string | null;
  location: string | null;
  avatarUrl: string | null;
  resumeUrl: string | null;
  skills: string[];
  experience: ExperienceItem[] | null;
  socialLinks: SocialLinks | null;
  freelanceProfile: FreelanceProfile | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateAboutInput {
  fullName: string;
  email: string;
  skills: string[];
  roles: string[];
  tagline?: string | null;
  shortBio?: string | null;
  bio?: string;
  phone?: string | null;
  location?: string | null;
  avatarUrl?: string | null;
  resumeUrl?: string | null;
  experience?: ExperienceItem[] | null;
  socialLinks?: SocialLinks | null;
  freelanceProfile?: FreelanceProfile | null;
}

export interface UseAboutOptions {
  enabled?: boolean;
}

export interface UseAboutResult {
  data: AboutMeData | null;
  loading: boolean;
  saving: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  updateAbout: (input: UpdateAboutInput) => Promise<boolean>;
  updateField: <K extends keyof UpdateAboutInput>(
    field: K,
    value: UpdateAboutInput[K]
  ) => Promise<boolean>;
}
