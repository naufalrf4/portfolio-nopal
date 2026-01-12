'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, MessageSquare, Calendar } from 'lucide-react';

const CTA_ITEMS = [
  {
    icon: Mail,
    title: 'Get in Touch',
    description: 'Have a project in mind? Let&apos;s discuss how I can help.',
    href: '/contact',
    label: 'Contact Me',
  },
  {
    icon: MessageSquare,
    title: 'Leave a Message',
    description: 'Share your thoughts or feedback in the guestbook.',
    href: '/guestbook',
    label: 'Visit Guestbook',
  },
  {
    icon: Calendar,
    title: 'Schedule a Call',
    description: 'Book a time to discuss your project or collaboration.',
    href: '/schedule',
    label: 'Schedule',
  },
];

export function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Let&apos;s Work Together
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            I&apos;m always open to discussing new projects, creative ideas, or opportunities to be
            part of your vision.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CTA_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="block neu-card h-full neu-transition hover:neu-extruded-hover group"
                >
                  <div className="neu-inset p-4 rounded-2xl inline-block mb-4 group-hover:neu-inset-deep transition-all">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>

                  <p className="text-sm text-muted-foreground mb-4">{item.description}</p>

                  <span className="text-sm font-medium text-primary">{item.label} →</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
