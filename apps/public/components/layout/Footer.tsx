import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

const SOCIAL_LINKS = [
  { href: 'https://github.com/naufalrf', icon: Github, label: 'GitHub' },
  { href: 'https://linkedin.com/in/naufalrf', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://twitter.com/naufalrf', icon: Twitter, label: 'Twitter' },
  { href: 'mailto:contact@naufalrf.tech', icon: Mail, label: 'Email' },
];

const QUICK_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/guestbook', label: 'Guestbook' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="neu-card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4">NaufalRF</h3>
              <p className="text-sm text-muted-foreground">
                Full-Stack Engineer specializing in scalable web applications
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Quick Links</h4>
              <div className="flex flex-col gap-2">
                {QUICK_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Connect</h4>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="neu-extruded p-3 rounded-2xl neu-transition hover:neu-extruded-hover"
                    aria-label={label}
                  >
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              &copy; {currentYear} NaufalRF. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
