import { useState, type FC, type ComponentType } from 'react';
import { NeuCard } from '../shared/NeuCard';
import { NeuButton } from '../shared/NeuButton';
import { ExperienceTabs } from './ExperienceTabs';
import { SkillBadges } from './SkillBadges';
import { AchievementsDisplay, type Achievement } from './AchievementsDisplay';
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
import type { AboutData } from '../../types';
import { filterPublicSocialLinks } from '@/lib/social-links';

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

export const AboutContent: FC<AboutContentProps> = ({ about, achievements }) => {
  const fullName = about.fullName?.trim() || 'NaufalRF';
  const socialLinksList = filterPublicSocialLinks(about.socialLinks);
  const [mobileTab, setMobileTab] = useState<'about' | 'skills'>('about');
  const hasSkills = Boolean(about.skills && about.skills.length > 0);

  return (
    <div className="animate-fade-in space-y-12">
      {/* Profile and Experience Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-5 space-y-6">
          <NeuCard className="p-6 md:p-8 stagger-item">
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-full neu-extruded p-1.5 mb-6">
                <div className="w-full h-full rounded-full overflow-hidden neu-inset relative">
                  {about.avatarUrl ? (
                    <img
                      src={about.avatarUrl}
                      alt={fullName}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <span className="text-4xl md:text-5xl text-white font-bold">
                        {fullName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{fullName}</h1>
              {about.tagline && (
                <p className="text-primary font-medium text-lg mb-4">{about.tagline}</p>
              )}

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

          <div className="lg:hidden">
            {hasSkills ? (
              <NeuCard className="p-4 stagger-item">
                <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#E0E5EC]/70 p-2 shadow-[inset_4px_4px_8px_rgba(163,177,198,0.32),inset_-4px_-4px_8px_rgba(255,255,255,0.45)]">
                  <button
                    type="button"
                    onClick={() => setMobileTab('about')}
                    className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                      mobileTab === 'about'
                        ? 'bg-[#E0E5EC] text-[#3B82F6] shadow-[6px_6px_12px_rgba(163,177,198,0.45),-6px_-6px_12px_rgba(255,255,255,0.55)]'
                        : 'text-muted-foreground hover:text-[#3B82F6]'
                    }`}
                  >
                    About Me
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileTab('skills')}
                    className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                      mobileTab === 'skills'
                        ? 'bg-[#E0E5EC] text-[#3B82F6] shadow-[6px_6px_12px_rgba(163,177,198,0.45),-6px_-6px_12px_rgba(255,255,255,0.55)]'
                        : 'text-muted-foreground hover:text-[#3B82F6]'
                    }`}
                  >
                    Skills
                  </button>
                </div>

                <div className="mt-5">
                  {mobileTab === 'about' ? (
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-4">About Me</h2>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {about.bio}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-6">
                        Skills & Technologies
                      </h2>
                      <SkillBadges skills={about.skills} />
                    </div>
                  )}
                </div>
              </NeuCard>
            ) : (
              <NeuCard className="p-6 md:p-8 stagger-item">
                <h2 className="text-xl font-bold text-foreground mb-4">About Me</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {about.bio}
                </p>
              </NeuCard>
            )}
          </div>

          <div className="hidden lg:block space-y-6">
            <NeuCard className="p-6 md:p-8 stagger-item">
              <h2 className="text-xl font-bold text-foreground mb-4">About Me</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {about.bio}
              </p>
            </NeuCard>

            {hasSkills && (
              <NeuCard className="p-6 md:p-8 stagger-item">
                <h2 className="text-xl font-bold text-foreground mb-6">Skills & Technologies</h2>
                <SkillBadges skills={about.skills} />
              </NeuCard>
            )}
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-24">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Experience, Education & Certifications
            </h2>
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

      {achievements && achievements.length > 0 && (
        <div className="stagger-item">
          <AchievementsDisplay achievements={achievements} />
        </div>
      )}
    </div>
  );
};
