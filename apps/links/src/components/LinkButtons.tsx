'use client';

import { ExternalLink, Globe, FileText, Briefcase, Code, BookOpen } from 'lucide-react';

interface ProfileLink {
  id: string;
  label: string;
  url: string;
  icon?: string;
}

interface LinkButtonsProps {
  links: ProfileLink[];
}

function getLinkIcon(link: ProfileLink) {
  const labelLower = link.label.toLowerCase();
  const iconLower = link.icon?.toLowerCase() || '';

  if (labelLower.includes('portfolio') || iconLower.includes('portfolio')) {
    return Briefcase;
  }
  if (labelLower.includes('blog') || iconLower.includes('blog')) {
    return BookOpen;
  }
  if (labelLower.includes('resume') || labelLower.includes('cv') || iconLower.includes('resume')) {
    return FileText;
  }
  if (labelLower.includes('project') || iconLower.includes('code')) {
    return Code;
  }
  if (labelLower.includes('website') || iconLower.includes('website')) {
    return Globe;
  }

  return Globe;
}

export function LinkButtons({ links }: LinkButtonsProps) {
  return (
    <div className="w-full flex flex-col gap-4">
      {links.map((link, index) => {
        const IconComponent = getLinkIcon(link);

        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group neu-link-button"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="neu-link-icon">
              <IconComponent className="w-5 h-5 text-primary transition-transform duration-300 group-hover:scale-110" />
            </div>
            <span className="flex-1 font-semibold text-center text-foreground/90 group-hover:text-foreground transition-colors duration-300">
              {link.label}
            </span>
            <div className="w-10 flex justify-center">
              <ExternalLink className="w-4 h-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5" />
            </div>
          </a>
        );
      })}
    </div>
  );
}
