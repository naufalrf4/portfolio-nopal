import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { NeuCard } from '../shared/NeuCard';
import { ContactForm } from './ContactForm';
import { BookingCalendar } from './BookingCalendar';
import { ContactInfo } from './ContactInfo';
import { Mail, Calendar, ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import type { AboutData } from '../../types';

interface ContactContentProps {
  aboutData: AboutData;
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

export function ContactContent({ aboutData }: ContactContentProps) {
  const [activeTab, setActiveTab] = useState<Tab>('form');
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div className="animate-fade-in min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E0E5EC] text-[#3B82F6] mb-6 shadow-[6px_6px_12px_rgba(163,177,198,0.6),-6px_-6px_12px_rgba(255,255,255,0.5)]">
            <MessageSquare size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#3D4852] mb-4">Get in Touch</h1>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
            Have a question or want to work together? Send me a message or book a call to discuss
            your project, collaboration, or job opportunity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          <div className="lg:col-span-5 stagger-item">
            <ContactInfo
              location={aboutData.location}
              email={aboutData.email}
              socialLinks={aboutData.socialLinks}
              availabilityStatus={aboutData.availabilityStatus}
              error={null}
            />
          </div>

          <div className="lg:col-span-7 stagger-item">
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('form')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium transition-all duration-200',
                  activeTab === 'form'
                    ? 'text-[#3B82F6] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]'
                    : 'text-[#6B7280] shadow-[4px_4px_8px_rgba(163,177,198,0.6),-4px_-4px_8px_rgba(255,255,255,0.5)] hover:text-[#3B82F6]'
                )}
              >
                <Mail size={20} />
                Send Message
              </button>
              <button
                onClick={() => setActiveTab('booking')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium transition-all duration-200',
                  activeTab === 'booking'
                    ? 'text-[#3B82F6] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]'
                    : 'text-[#6B7280] shadow-[4px_4px_8px_rgba(163,177,198,0.6),-4px_-4px_8px_rgba(255,255,255,0.5)] hover:text-[#3B82F6]'
                )}
              >
                <Calendar size={20} />
                Book a Call
              </button>
            </div>

            <NeuCard>{activeTab === 'form' ? <ContactForm /> : <BookingCalendar />}</NeuCard>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#E0E5EC] shadow-[4px_4px_8px_rgba(163,177,198,0.6),-4px_-4px_8px_rgba(255,255,255,0.5)] flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-[#3B82F6]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#3D4852]">Frequently Asked Questions</h2>
              <p className="text-[#6B7280]">Quick answers to common questions</p>
            </div>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqId === faq.id;
              return (
                <NeuCard
                  key={faq.id}
                  className="cursor-pointer overflow-hidden stagger-item"
                  style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                  onClick={() => toggleFaq(faq.id)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-[#3D4852] pr-4">{faq.question}</h3>
                    <ChevronDown
                      size={20}
                      className={cn(
                        'text-[#6B7280] flex-shrink-0 transition-transform duration-300 ease-in-out',
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
                      <p className="mt-4 text-[#6B7280] leading-relaxed">{faq.answer}</p>
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
