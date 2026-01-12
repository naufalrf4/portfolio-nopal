'use client';

import { cn } from '@/src/lib/utils';
import Image from 'next/image';
import { Section, NeuCard, NeuButton, NeuBadge } from '@/src/features/shared/components';
import { ExperienceTabs } from './ExperienceTabs';
import { SkillBadges } from './SkillBadges';
import { MapPin, Mail, Download, Github, Linkedin, Twitter } from 'lucide-react';
import type { AboutData } from './types';

interface AboutContentProps {
  about: AboutData;
}

const socialIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  email: Mail,
};

export function AboutContent({ about }: AboutContentProps) {
  return (
    <div className="py-8 md:py-16">
      <Section>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <NeuCard>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="w-32 h-32 flex-shrink-0 rounded-full shadow-[8px_8px_16px_rgba(163,177,198,0.6),-8px_-8px_16px_rgba(255,255,255,0.5)] p-1.5 bg-[#E0E5EC]">
                    <div className="w-full h-full rounded-full overflow-hidden shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
                      {about.avatarUrl ? (
                        <Image
                          src={about.avatarUrl}
                          alt={about.fullName}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center">
                          <span className="text-4xl text-white font-bold">
                            {about.fullName.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-center sm:text-left flex-1">
                    <h1 className="text-2xl font-bold text-[#3D4852] mb-1">{about.fullName}</h1>
                    <p className="text-[#3B82F6] font-medium mb-3">{about.tagline}</p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-[#6B7280] mb-4">
                      {about.location && (
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>{about.location}</span>
                        </div>
                      )}
                      {about.email && (
                        <a
                          href={`mailto:${about.email}`}
                          className="flex items-center gap-1 hover:text-[#3B82F6] transition-colors"
                        >
                          <Mail size={14} />
                          <span>{about.email}</span>
                        </a>
                      )}
                    </div>

                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      {Array.isArray(about.socialLinks) &&
                        about.socialLinks.map((link, index) => {
                          const Icon = socialIcons[link.platform.toLowerCase()] || Mail;
                          return (
                            <a
                              key={index}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg text-[#6B7280] hover:text-[#3B82F6] transition-all duration-200 shadow-[3px_3px_6px_rgba(163,177,198,0.6),-3px_-3px_6px_rgba(255,255,255,0.5)]"
                              aria-label={link.platform}
                            >
                              <Icon size={18} />
                            </a>
                          );
                        })}

                      {about.resumeUrl && (
                        <a
                          href={about.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2"
                        >
                          <NeuButton variant="accent" size="sm">
                            <Download size={16} className="mr-1" />
                            CV
                          </NeuButton>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </NeuCard>

              <NeuCard>
                <h2 className="text-xl font-bold text-[#3D4852] mb-4">About Me</h2>
                <p className="text-[#6B7280] leading-relaxed whitespace-pre-line">{about.bio}</p>
              </NeuCard>

              {about.skills && about.skills.length > 0 && (
                <NeuCard>
                  <h2 className="text-xl font-bold text-[#3D4852] mb-6">Skills & Technologies</h2>
                  <SkillBadges skills={about.skills} />
                </NeuCard>
              )}
            </div>

            <div>
              <div className="sticky top-24">
                <h2 className="text-xl font-bold text-[#3D4852] mb-6">Experience</h2>
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
