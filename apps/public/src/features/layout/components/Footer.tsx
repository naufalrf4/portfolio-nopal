import { cn } from '@/src/lib/utils';
import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail, Heart } from 'lucide-react';

const socialLinks = [
  { href: 'https://github.com/naufalrf', label: 'GitHub', icon: Github },
  { href: 'https://linkedin.com/in/naufalrf', label: 'LinkedIn', icon: Linkedin },
  { href: 'https://twitter.com/naufalrf', label: 'Twitter', icon: Twitter },
  { href: 'mailto:contact@naufalrf.tech', label: 'Email', icon: Mail },
];

const quickLinks = [
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/contact', label: 'Contact' },
];

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn('bg-[#E0E5EC] py-12 px-4 md:px-8 pb-28 md:pb-12', className)}>
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl bg-[#E0E5EC] p-8 shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center md:text-left">
              <Link
                href="/"
                className="text-2xl font-bold text-[#3D4852] hover:text-[#3B82F6] transition-colors"
              >
                NaufalRF
              </Link>
              <p className="text-sm text-[#6B7280] mt-2 max-w-xs mx-auto md:mx-0">
                Full-Stack Engineer & AI Enthusiast crafting digital experiences with passion.
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-sm font-semibold text-[#3D4852] uppercase tracking-wide mb-4">
                Quick Links
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 rounded-xl text-sm text-[#6B7280] hover:text-[#3B82F6] transition-all duration-200 hover:shadow-[4px_4px_8px_rgba(163,177,198,0.6),-4px_-4px_8px_rgba(255,255,255,0.5)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="text-center md:text-right">
              <h3 className="text-sm font-semibold text-[#3D4852] uppercase tracking-wide mb-4">
                Connect
              </h3>
              <div className="flex items-center justify-center md:justify-end gap-3">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl text-[#6B7280] hover:text-[#3B82F6] transition-all duration-200 shadow-[5px_5px_10px_rgb(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.5)] hover:shadow-[6px_6px_12px_rgb(163,177,198,0.7),-6px_-6px_12px_rgba(255,255,255,0.6)] hover:-translate-y-0.5"
                      aria-label={link.label}
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#d1d5db]/50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-[#6B7280]">
                © {currentYear} NaufalRF. All rights reserved.
              </p>
              <p className="text-sm text-[#6B7280] flex items-center gap-1">
                Made with <Heart size={14} className="text-[#EF4444] fill-[#EF4444]" /> in Indonesia
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
