import React, { useState } from 'react';
import { Calendar, ChevronDown, HelpCircle, Mail } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { AboutData } from '../../types';
import { NeuCard } from '../shared/NeuCard';
import { BookingCalendar } from './BookingCalendar';
import { ContactForm } from './ContactForm';
import { ContactInfo } from './ContactInfo';

interface ContactContentProps {
  aboutData: AboutData;
  turnstileSiteKey: string;
}

const FAQS = [
  {
    id: '1',
    question: 'What services do you offer?',
    answer:
      'I specialize in full-stack web development, including frontend (React, Next.js), backend (Node.js, Python), cloud infrastructure (AWS, GCP), and AI/ML integrations.',
  },
  {
    id: '2',
    question: 'Are you available for freelance work?',
    answer:
      'Yes! I am open to freelance projects, consulting, and contract work. Feel free to reach out through the contact form or book a call to discuss your project.',
  },
  {
    id: '3',
    question: 'What is your typical project timeline?',
    answer:
      'Timelines vary based on project scope. Small projects typically take 2-4 weeks, medium projects 1-3 months, and larger enterprise solutions 3-6 months or more.',
  },
  {
    id: '4',
    question: 'Do you provide ongoing maintenance and support?',
    answer:
      'Yes, I offer maintenance packages for projects I build. This includes bug fixes, security updates, performance optimization, and feature enhancements.',
  },
  {
    id: '5',
    question: 'What technologies do you work with?',
    answer:
      'My primary stack includes TypeScript, React, Next.js, Node.js, PostgreSQL, and AWS. I also work with Python, Docker, Kubernetes, and various AI/ML tools.',
  },
  {
    id: '6',
    question: 'Can you help with existing projects?',
    answer:
      'Absolutely! I can help with code reviews, performance optimization, refactoring, adding new features, or migrating to modern technologies.',
  },
];

type Tab = 'form' | 'booking';

export function ContactContent({ aboutData, turnstileSiteKey }: ContactContentProps) {
  const [activeTab, setActiveTab] = useState<Tab>('form');
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div className="animate-fade-in px-4 pb-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="stagger-item lg:col-span-5">
            <ContactInfo
              location={aboutData.location}
              email={aboutData.email}
              socialLinks={aboutData.socialLinks}
              availabilityStatus={aboutData.availabilityStatus}
              error={null}
            />
          </div>

          <div className="stagger-item lg:col-span-7">
            <div className="mb-6 rounded-[28px] bg-[#E7ECF2] p-3 shadow-[inset_4px_4px_10px_rgba(163,177,198,0.32),inset_-4px_-4px_10px_rgba(255,255,255,0.46)]">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  onClick={() => setActiveTab('form')}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-[22px] px-6 py-4 font-medium transition-all duration-200',
                    activeTab === 'form'
                      ? 'bg-[#DCE8FF] text-[#2453C5] shadow-[inset_4px_4px_10px_rgba(163,177,198,0.28),inset_-4px_-4px_10px_rgba(255,255,255,0.45)]'
                      : 'bg-[#E0E5EC] text-[#6B7280] shadow-[5px_5px_10px_rgba(163,177,198,0.55),-5px_-5px_10px_rgba(255,255,255,0.45)] hover:-translate-y-0.5 hover:text-[#3B82F6]'
                  )}
                >
                  <Mail size={20} />
                  Send Message
                </button>
                <button
                  onClick={() => setActiveTab('booking')}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-[22px] px-6 py-4 font-medium transition-all duration-200',
                    activeTab === 'booking'
                      ? 'bg-[#DCE8FF] text-[#2453C5] shadow-[inset_4px_4px_10px_rgba(163,177,198,0.28),inset_-4px_-4px_10px_rgba(255,255,255,0.45)]'
                      : 'bg-[#E0E5EC] text-[#6B7280] shadow-[5px_5px_10px_rgba(163,177,198,0.55),-5px_-5px_10px_rgba(255,255,255,0.45)] hover:-translate-y-0.5 hover:text-[#3B82F6]'
                  )}
                >
                  <Calendar size={20} />
                  Book a Call
                </button>
              </div>
            </div>

            <NeuCard className="homepage-card-hover p-6 md:p-8">
              {activeTab === 'form' ? <ContactForm turnstileSiteKey={turnstileSiteKey} /> : <BookingCalendar turnstileSiteKey={turnstileSiteKey} />}
            </NeuCard>
          </div>
        </div>

        <div>
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E0E5EC] shadow-[4px_4px_8px_rgba(163,177,198,0.6),-4px_-4px_8px_rgba(255,255,255,0.5)]">
              <HelpCircle className="h-6 w-6 text-[#3B82F6]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#3D4852]">Frequently Asked Questions</h2>
              <p className="text-[#6B7280]">
                Quick answers before you send a message or book time.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqId === faq.id;
              return (
                <NeuCard
                  key={faq.id}
                  className="stagger-item cursor-pointer overflow-hidden"
                  style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                  onClick={() => toggleFaq(faq.id)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="pr-4 font-semibold text-[#3D4852]">{faq.question}</h3>
                    <ChevronDown
                      size={20}
                      className={cn(
                        'flex-shrink-0 text-[#6B7280] transition-transform duration-300 ease-in-out',
                        isOpen && 'rotate-180'
                      )}
                    />
                  </div>
                  <div
                    className={cn(
                      'grid transition-all duration-300 ease-in-out',
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="mt-4 leading-relaxed text-[#6B7280]">{faq.answer}</p>
                    </div>
                  </div>
                </NeuCard>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
