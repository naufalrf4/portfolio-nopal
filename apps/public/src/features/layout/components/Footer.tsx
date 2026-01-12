import { cn } from '@/src/lib/utils';
import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

const socialLinks = [
  { href: 'https://github.com/naufalrf', label: 'GitHub', icon: Github },
  { href: 'https://linkedin.com/in/naufalrf', label: 'LinkedIn', icon: Linkedin },
  { href: 'https://twitter.com/naufalrf', label: 'Twitter', icon: Twitter },
  { href: 'mailto:contact@naufalrf.tech', label: 'Email', icon: Mail },
];

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn('bg-[#E0E5EC] py-12 px-4 md:px-8 pb-24 md:pb-12', className)}>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <Link
              href="/"
              className="text-xl font-bold text-[#3D4852] hover:text-[#3B82F6] transition-colors"
            >
              NaufalRF
            </Link>
            <p className="text-sm text-[#6B7280] mt-1">Full-Stack Engineer & AI Enthusiast</p>
          </div>

          <div className="flex items-center gap-3">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl text-[#6B7280] hover:text-[#3B82F6] transition-all duration-200 shadow-[4px_4px_8px_rgba(163,177,198,0.6),-4px_-4px_8px_rgba(255,255,255,0.5)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.6),-6px_-6px_12px_rgba(255,255,255,0.5)]"
                  aria-label={link.label}
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[#d1d5db] text-center">
          <p className="text-sm text-[#6B7280]">© {currentYear} NaufalRF. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
