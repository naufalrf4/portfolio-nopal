'use client';

import type { ComponentType } from 'react';
import Image from 'next/image';
import { NeuCard, NeuButton } from '@/src/features/shared/components';
import { ExperienceTabs } from './ExperienceTabs';
import { SkillBadges } from './SkillBadges';
import { AchievementsDisplay } from './AchievementsDisplay';
import {
  MapPin,
  Mail,
  Download,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
} from 'lucide-react';
import type { AboutData, SocialLinks } from './types';
import type { Achievement } from '@/src/lib/api/types';

interface AboutContentProps {
  about: AboutData;
  achievements: Achievement[];
}

const socialIcons: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  email: Mail,
};

interface SocialLinkItem {
  platform: string;
  url: string;
}

function normalizeSocialLinks(
  socialLinks: SocialLinks | Array<{ platform: string; url: string }> | undefined
): SocialLinkItem[] {
  if (!socialLinks) return [];

  if (Array.isArray(socialLinks)) {
    return socialLinks;
  }

  return Object.entries(socialLinks)
    .filter(([, url]) => url && typeof url === 'string')
    .map(([platform, url]) => ({ platform, url: url as string }));
}

export function AboutContent({ about, achievements }: AboutContentProps) {
  const socialLinksList = normalizeSocialLinks(about.socialLinks);

  return (
    <div className="animate-fade-in space-y-12">
      {/* Profile and Experience Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-5 space-y-6">
          <NeuCard className="p-6 md:p-8 stagger-item">
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-full neu-extruded p-1.5 mb-6">
                <div className="w-full h-full rounded-full overflow-hidden neu-inset">
                  {about.avatarUrl ? (
                    <Image
                      src={about.avatarUrl}
                      alt={about.fullName}
                      width={160}
                      height={160}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <span className="text-4xl md:text-5xl text-white font-bold">
                        {about.fullName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {about.fullName}
              </h1>
              <p className="text-primary font-medium text-lg mb-4">{about.tagline}</p>

              <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground mb-6">
                {about.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-primary" />
                    <span>{about.location}</span>
                  </div>
                )}
                {about.email && (
                  <a
                    href={`mailto:${about.email}`}
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <Mail size={16} className="text-primary" />
                    <span>{about.email}</span>
                  </a>
                )}
              </div>

              {socialLinksList.length > 0 && (
                <div className="flex items-center justify-center gap-3 mb-4">
                  {socialLinksList.map((link, index) => {
                    const Icon = socialIcons[link.platform.toLowerCase()] || Mail;
                    return (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl text-muted-foreground hover:text-primary transition-all duration-200 neu-extruded hover:neu-extruded-hover"
                        aria-label={link.platform}
                      >
                        <Icon size={20} />
                      </a>
                    );
                  })}
                </div>
              )}

              {about.resumeUrl && (
                <a href={about.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <NeuButton variant="accent" size="md">
                    <Download size={18} className="mr-2" />
                    Download CV
                  </NeuButton>
                </a>
              )}
            </div>
          </NeuCard>

          <NeuCard className="p-6 md:p-8 stagger-item">
            <h2 className="text-xl font-bold text-foreground mb-4">About Me</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{about.bio}</p>
          </NeuCard>

          {about.skills && about.skills.length > 0 && (
            <NeuCard className="p-6 md:p-8 stagger-item">
              <h2 className="text-xl font-bold text-foreground mb-6">Skills & Technologies</h2>
              <SkillBadges skills={about.skills} />
            </NeuCard>
          )}
        </div>

        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-24">
            <h2 className="text-xl font-bold text-foreground mb-6">Experience & Background</h2>
            {about.experience && about.experience.length > 0 ? (
              <ExperienceTabs experience={about.experience} />
            ) : (
              <NeuCard>
                <p className="text-muted-foreground text-center py-8">
                  No experience data available.
                </p>
              </NeuCard>
            )}
          </div>
        </div>
      </div>

      {/* Achievements Section - Standalone Center */}
      {achievements && achievements.length > 0 && (
        <div className="stagger-item">
          <AchievementsDisplay achievements={achievements} />
        </div>
      )}
    </div>
  );
}
