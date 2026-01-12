'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/src/lib/utils';
import { Section, NeuCard } from '@/src/features/shared/components';
import { ContactForm } from './ContactForm';
import { BookingCalendar } from './BookingCalendar';
import { ContactInfo } from './ContactInfo';
import { Mail, Calendar, ChevronDown, HelpCircle } from 'lucide-react';
import { FAQS } from '@/src/lib/constants';
import { api } from '@/src/lib/api';

type Tab = 'form' | 'booking';

interface AboutData {
  location?: string;
  email?: string;
  socialLinks?: Array<{ platform: string; url: string }>;
}

export function ContactContent() {
  const [activeTab, setActiveTab] = useState<Tab>('form');
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [aboutData, setAboutData] = useState<AboutData | null>(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const data = await api.about.get();
        setAboutData(data);
      } catch (error) {
        console.error('Failed to fetch about data:', error);
      }
    };
    fetchAboutData();
  }, []);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const socialLinks = aboutData?.socialLinks || [];

  return (
    <div className="py-8 md:py-16">
      <Section>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
            <div className="lg:col-span-5">
              <ContactInfo
                location={aboutData?.location}
                email={aboutData?.email}
                socialLinks={socialLinks}
              />
            </div>

            <div className="lg:col-span-7">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FAQS.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <NeuCard
                    key={faq.id}
                    className="cursor-pointer"
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-[#3D4852] pr-4">{faq.question}</h3>
                      <ChevronDown
                        size={20}
                        className={cn(
                          'text-[#6B7280] flex-shrink-0 transition-transform duration-200',
                          isOpen && 'rotate-180'
                        )}
                      />
                    </div>
                    {isOpen && <p className="mt-4 text-[#6B7280] leading-relaxed">{faq.answer}</p>}
                  </NeuCard>
                );
              })}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
