'use client';

import type { ComponentType } from 'react';
import Image from 'next/image';
import { Section, NeuCard, NeuButton } from '@/src/features/shared/components';
import { ExperienceTabs } from './ExperienceTabs';
import { SkillBadges } from './SkillBadges';
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

interface AboutContentProps {
  about: AboutData;
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

export function AboutContent({ about }: AboutContentProps) {
  const socialLinksList = normalizeSocialLinks(about.socialLinks);

  return (
    <div className="py-8 md:py-16 animate-fade-in">
      <Section>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-5 space-y-6">
              <NeuCard className="p-6 md:p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-full shadow-[8px_8px_16px_rgba(163,177,198,0.6),-8px_-8px_16px_rgba(255,255,255,0.5)] p-1.5 bg-[#E0E5EC] mb-6">
                    <div className="w-full h-full rounded-full overflow-hidden shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
                      {about.avatarUrl ? (
                        <Image
                          src={about.avatarUrl}
                          alt={about.fullName}
                          width={160}
                          height={160}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center">
                          <span className="text-4xl md:text-5xl text-white font-bold">
                            {about.fullName.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <h1 className="text-2xl md:text-3xl font-bold text-[#3D4852] mb-2">
                    {about.fullName}
                  </h1>
                  <p className="text-[#3B82F6] font-medium text-lg mb-4">{about.tagline}</p>

                  <div className="flex flex-col items-center gap-2 text-sm text-[#6B7280] mb-6">
                    {about.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-[#3B82F6]" />
                        <span>{about.location}</span>
                      </div>
                    )}
                    {about.email && (
                      <a
                        href={`mailto:${about.email}`}
                        className="flex items-center gap-2 hover:text-[#3B82F6] transition-colors"
                      >
                        <Mail size={16} className="text-[#3B82F6]" />
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
                            className="p-3 rounded-xl text-[#6B7280] hover:text-[#3B82F6] transition-all duration-200 shadow-[4px_4px_8px_rgba(163,177,198,0.6),-4px_-4px_8px_rgba(255,255,255,0.5)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.7),-6px_-6px_12px_rgba(255,255,255,0.6)]"
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

              <NeuCard className="p-6 md:p-8">
                <h2 className="text-xl font-bold text-[#3D4852] mb-4">About Me</h2>
                <p className="text-[#6B7280] leading-relaxed whitespace-pre-line">{about.bio}</p>
              </NeuCard>

              {about.skills && about.skills.length > 0 && (
                <NeuCard className="p-6 md:p-8">
                  <h2 className="text-xl font-bold text-[#3D4852] mb-6">Skills & Technologies</h2>
                  <SkillBadges skills={about.skills} />
                </NeuCard>
              )}
            </div>

            <div className="lg:col-span-7">
              <div className="lg:sticky lg:top-24">
                <h2 className="text-xl font-bold text-[#3D4852] mb-6">Experience & Background</h2>
                {about.experience && about.experience.length > 0 ? (
                  <ExperienceTabs experience={about.experience} />
                ) : (
                  <NeuCard>
                    <p className="text-[#6B7280] text-center py-8">No experience data available.</p>
                  </NeuCard>
                )}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
