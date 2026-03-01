import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Github, Linkedin, Twitter, Mail, Download, ArrowRight } from 'lucide-react';
import { NeuButton } from '@/components/shared/NeuButton';
import type { AboutData } from '@/types';

interface HeroSectionProps {
  about: AboutData;
}

const GREETINGS = {
  en: "Hi, I'm",
  id: 'Halo, saya',
  ms: 'Hai, saya',
  de: 'Hallo, ich bin',
  nl: 'Hallo, ik ben',
  ja: 'こんにちは、私は',
  ko: '안녕하세요, 저는',
  pl: 'Cześć, jestem',
  cs: 'Ahoj, jsem',
  ro: 'Salut, sunt',
  tr: 'Merhaba, ben',
  fa: 'سلام، من',
  hi: 'नमस्ते, मैं',
  sw: 'Habari, mimi ni',
  zh: '你好，我是',
} as const;

const GREETING_KEYS = Object.keys(GREETINGS) as (keyof typeof GREETINGS)[];

const socialIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  email: Mail,
};

export function HeroSection({ about }: HeroSectionProps) {
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [isRoleVisible, setIsRoleVisible] = useState(true);
  const [isGreetingVisible, setIsGreetingVisible] = useState(true);

  const roles = about.roles || ['Full-Stack Engineer'];
  const firstName = about.fullName.split(' ')[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGreetingVisible(false);
      setTimeout(() => {
        setGreetingIndex((prev) => (prev + 1) % GREETING_KEYS.length);
        setIsGreetingVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (roles.length <= 1) return;

    const interval = setInterval(() => {
      setIsRoleVisible(false);
      setTimeout(() => {
        setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        setIsRoleVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <section className="min-h-[85vh] flex items-center justify-center py-16 md:py-24 px-4 md:px-8 animate-fade-in">
      <div className="mx-auto max-w-4xl w-full text-center">
        <div className="flex justify-center mb-8">
          <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-full shadow-[12px_12px_24px_rgba(163,177,198,0.6),-12px_-12px_24px_rgba(255,255,255,0.5)] p-2 bg-[#E0E5EC]">
            <div className="w-full h-full rounded-full overflow-hidden shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
              {about.avatarUrl ? (
                <img
                  src={about.avatarUrl}
                  alt={about.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center">
                  <span className="text-5xl md:text-6xl text-white font-bold">
                    {about.fullName.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#3D4852] mb-4">
          <span
            className={cn(
              'inline-block transition-all duration-300',
              isGreetingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
            )}
          >
            {GREETINGS[GREETING_KEYS[greetingIndex]]}
          </span>{' '}
          {firstName} <span className="inline-block animate-wave origin-[70%_70%]">👋</span>
        </h1>

        <div className="h-12 md:h-14 flex items-center justify-center mb-6">
          <p
            className={cn(
              'text-xl md:text-2xl lg:text-3xl font-semibold text-[#3B82F6] transition-all duration-300',
              isRoleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
            )}
          >
            {roles[currentRoleIndex]}
          </p>
        </div>

        <p className="text-[#6B7280] text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
          {about.bio}
        </p>

        {Array.isArray(about.socialLinks) && about.socialLinks.length > 0 && (
          <div className="flex items-center justify-center gap-3 mb-10">
            {about.socialLinks.slice(0, 4).map((link, index) => {
              const Icon = socialIcons[link.platform.toLowerCase()] || Mail;
              return (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl text-[#6B7280] hover:text-[#3B82F6] transition-all duration-200 shadow-[4px_4px_8px_rgba(163,177,198,0.6),-4px_-4px_8px_rgba(255,255,255,0.5)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.6),-6px_-6px_12px_rgba(255,255,255,0.5)]"
                  aria-label={link.platform}
                >
                  <Icon size={22} />
                </a>
              );
            })}
          </div>
        )}

        <div className="flex flex-row items-center justify-center gap-2 md:gap-4">
          <a href="/about">
            <NeuButton
              variant="accent"
              size="sm"
              className="text-sm px-3 py-2 md:px-6 md:py-3 md:text-base"
            >
              Learn More
              <ArrowRight className="ml-1 md:ml-2" size={16} />
            </NeuButton>
          </a>
          {about.resumeUrl && (
            <a href={about.resumeUrl} target="_blank" rel="noopener noreferrer">
              <NeuButton
                variant="default"
                size="sm"
                className="text-sm px-3 py-2 md:px-6 md:py-3 md:text-base"
              >
                <Download className="mr-1 md:mr-2" size={16} />
                Download CV
              </NeuButton>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
