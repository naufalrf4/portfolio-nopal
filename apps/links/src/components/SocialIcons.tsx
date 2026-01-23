'use client';

import { Github, Linkedin, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

interface ProfileLink {
  id: string;
  label: string;
  url: string;
  icon?: string;
}

interface SocialIconsProps {
  links: ProfileLink[];
}

function getIconComponent(link: ProfileLink) {
  const iconLower = link.icon?.toLowerCase() || '';
  const labelLower = link.label.toLowerCase();

  if (iconLower.includes('github') || labelLower.includes('github')) {
    return Github;
  }
  if (iconLower.includes('linkedin') || labelLower.includes('linkedin')) {
    return Linkedin;
  }
  if (iconLower.includes('twitter') || labelLower.includes('twitter') || iconLower.includes('x')) {
    return Twitter;
  }
  if (iconLower.includes('instagram') || labelLower.includes('instagram')) {
    return Instagram;
  }
  if (iconLower.includes('youtube') || labelLower.includes('youtube')) {
    return Youtube;
  }
  if (
    iconLower.includes('email') ||
    iconLower.includes('mail') ||
    labelLower.includes('email') ||
    labelLower.includes('mail')
  ) {
    return Mail;
  }

  return null;
}

export function SocialIcons({ links }: SocialIconsProps) {
  return (
    <div className="flex items-center justify-center gap-4 md:gap-5 flex-wrap py-2">
      {links.map((link, index) => {
        const IconComponent = getIconComponent(link);
        if (!IconComponent) return null;

        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className="neu-social-icon md:w-12 md:h-12 text-muted-foreground hover:text-primary"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <IconComponent className="w-5 h-5 md:w-6 md:h-6 transition-all duration-300" />
          </a>
        );
      })}
    </div>
  );
}
