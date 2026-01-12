export interface Experience {
  id: string;
  type: 'work' | 'education' | 'certification' | 'organization';
  title: string;
  organization: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description?: string;
  skills?: string[];
}

export interface Skill {
  name: string;
  category: string;
  level?: string;
}

export interface AboutData {
  fullName: string;
  tagline: string;
  roles: string[];
  bio: string;
  email?: string;
  location?: string;
  avatarUrl?: string;
  resumeUrl?: string;
  skills: Skill[];
  experience: Experience[];
  socialLinks?: Array<{ platform: string; url: string }>;
}
