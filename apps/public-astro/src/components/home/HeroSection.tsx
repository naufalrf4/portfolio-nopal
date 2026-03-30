import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { filterPublicSocialLinks } from '@/lib/social-links';
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  Download,
  ArrowRight,
  Instagram,
  Youtube,
} from 'lucide-react';
import { NeuButton } from '@/components/shared/NeuButton';
import type { AboutData } from '@/types';
import { motion, useScroll, useTransform } from 'framer-motion';

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
  instagram: Instagram,
  youtube: Youtube,
  email: Mail,
};

export function HeroSection({ about }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [isRoleVisible, setIsRoleVisible] = useState(true);
  const [isGreetingVisible, setIsGreetingVisible] = useState(true);

  const roles = about.roles || ['Full-Stack Engineer'];
  const socialLinks = filterPublicSocialLinks(about.socialLinks);
  const heroBio =
    about.shortBio?.trim() || 'Building digital experiences with purpose and precision.';
  const fullName = about.fullName?.trim() || 'NaufalRF';
  const firstName = fullName.split(' ')[0];
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const avatarY = useTransform(scrollYProgress, [0, 1], [0, 56]);
  const avatarOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.78]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 28]);
  const contentOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.88]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGreetingVisible(false);
      setTimeout(() => {
        setGreetingIndex((prev) => (prev + 1) % GREETING_KEYS.length);
        setIsGreetingVisible(true);
      }, 460);
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
      }, 460);
    }, 3000);

    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <motion.section
      ref={sectionRef}
      className="min-h-[85vh] flex items-center justify-center py-16 md:py-24 px-4 md:px-8 homepage-reveal-soft"
      style={{ opacity: contentOpacity }}
    >
      <div className="mx-auto max-w-4xl w-full text-center">
        <motion.div
          className="flex justify-center mb-8 homepage-reveal-pop"
          style={{ animationDelay: '0.04s', y: avatarY, opacity: avatarOpacity }}
        >
          <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-full shadow-[12px_12px_24px_rgba(163,177,198,0.6),-12px_-12px_24px_rgba(255,255,255,0.5)] p-2 bg-[#E0E5EC] homepage-card-hover group hover:shadow-[16px_16px_28px_rgba(163,177,198,0.62),-16px_-16px_28px_rgba(255,255,255,0.58)]">
            <div className="w-full h-full rounded-full overflow-hidden shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
              {about.avatarUrl ? (
                <img
                  src={about.avatarUrl}
                  alt={fullName}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center">
                  <span className="text-5xl md:text-6xl text-white font-bold">
                    {fullName.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#3D4852] mb-4 homepage-reveal"
          style={{ animationDelay: '0.14s', y: contentY }}
        >
          <span
            className={cn(
              'inline-block transition-all duration-500 ease-out',
              isGreetingVisible
                ? 'opacity-100 translate-y-0 blur-0'
                : 'opacity-0 -translate-y-3 blur-[2px]'
            )}
          >
            {GREETINGS[GREETING_KEYS[greetingIndex]]}
          </span>{' '}
          {firstName} <span className="inline-block animate-wave origin-[70%_70%]">👋</span>
        </motion.h1>

        <motion.div
          className="h-12 md:h-14 flex items-center justify-center mb-6 homepage-reveal-soft"
          style={{ animationDelay: '0.24s', y: contentY }}
        >
          <p
            className={cn(
              'text-xl md:text-2xl lg:text-3xl font-semibold text-[#3B82F6] transition-all duration-500 ease-out',
              isRoleVisible
                ? 'opacity-100 translate-y-0 blur-0'
                : 'opacity-0 translate-y-3 blur-[2px]'
            )}
          >
            {roles[currentRoleIndex]}
          </p>
        </motion.div>

        <motion.p
          className="text-[#6B7280] text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto homepage-reveal-soft"
          style={{ animationDelay: '0.34s', y: contentY }}
        >
          {heroBio}
        </motion.p>

        {socialLinks.length > 0 && (
          <motion.div
            className="flex items-center justify-center gap-3 mb-10 homepage-reveal-soft"
            style={{ animationDelay: '0.42s', y: contentY }}
          >
            {socialLinks.slice(0, 4).map((link, index) => {
              const Icon = socialIcons[link.platform.toLowerCase()] || Mail;
              return (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl text-[#6B7280] hover:text-[#3B82F6] homepage-icon-hover shadow-[4px_4px_8px_rgba(163,177,198,0.6),-4px_-4px_8px_rgba(255,255,255,0.5)] hover:shadow-[8px_8px_14px_rgba(163,177,198,0.6),-8px_-8px_14px_rgba(255,255,255,0.54)] homepage-stagger"
                  style={{ animationDelay: `${0.5 + index * 0.08}s` }}
                  aria-label={link.platform}
                >
                  <Icon size={22} />
                </a>
              );
            })}
          </motion.div>
        )}

        <motion.div
          className="flex flex-row items-center justify-center gap-2 md:gap-4 homepage-reveal-soft"
          style={{ animationDelay: '0.62s', y: contentY }}
        >
          <a href="/about">
            <NeuButton
              variant="accent"
              size="sm"
              className="text-sm px-3 py-2 md:px-6 md:py-3 md:text-base group"
            >
              Learn More
              <ArrowRight
                className="ml-1 md:ml-2 transition-transform duration-300 ease-out group-hover:translate-x-1"
                size={16}
              />
            </NeuButton>
          </a>
          {about.resumeUrl && (
            <a href={about.resumeUrl} target="_blank" rel="noopener noreferrer">
              <NeuButton
                variant="default"
                size="sm"
                className="text-sm px-3 py-2 md:px-6 md:py-3 md:text-base group"
              >
                <Download
                  className="mr-1 md:mr-2 transition-transform duration-300 ease-out group-hover:-translate-y-0.5"
                  size={16}
                />
                Download CV
              </NeuButton>
            </a>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}
