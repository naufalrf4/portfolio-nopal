'use client';

import type { ComponentType } from 'react';
import { NeuCard } from '@/src/features/shared/components';
import {
  MapPin,
  Mail,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Globe,
  AlertCircle,
} from 'lucide-react';

interface SocialLink {
  platform: string;
  url: string;
}

interface ContactInfoProps {
  location?: string;
  email?: string;
  socialLinks?: SocialLink[];
  availabilityStatus?: 'available' | 'busy' | 'unavailable';
  error?: string | null;
}

const socialIcons: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  email: Mail,
  website: Globe,
};

export function ContactInfo({
  location,
  email,
  socialLinks = [],
  availabilityStatus,
  error,
}: ContactInfoProps) {
  return (
    <NeuCard className="p-6 md:p-8 h-full">
      <div className="flex flex-col h-full">
        <h2 className="text-2xl md:text-3xl font-bold text-[#3D4852] mb-2">Get in Touch</h2>
        <p className="text-[#6B7280] mb-8">
          Have a question or want to work together? I&apos;d love to hear from you.
        </p>

        {error ? (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200 mb-6">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Failed to load contact information</p>
              <p className="text-xs text-red-600 mt-1">{error}</p>
            </div>
          </div>
        ) : null}

        <div className="space-y-4 mb-8">
          {location && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E0E5EC] shadow-[4px_4px_8px_rgba(163,177,198,0.6),-4px_-4px_8px_rgba(255,255,255,0.5)] flex items-center justify-center">
                <MapPin size={18} className="text-[#3B82F6]" />
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Location</p>
                <p className="text-[#3D4852] font-medium">{location}</p>
              </div>
            </div>
          )}

          {email && (
            <a href={`mailto:${email}`} className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#E0E5EC] shadow-[4px_4px_8px_rgba(163,177,198,0.6),-4px_-4px_8px_rgba(255,255,255,0.5)] flex items-center justify-center transition-all duration-200 group-hover:shadow-[6px_6px_12px_rgba(163,177,198,0.7),-6px_-6px_12px_rgba(255,255,255,0.6)]">
                <Mail size={18} className="text-[#3B82F6]" />
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Email</p>
                <p className="text-[#3D4852] font-medium group-hover:text-[#3B82F6] transition-colors">
                  {email}
                </p>
              </div>
            </a>
          )}

          {availabilityStatus && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E0E5EC] shadow-[4px_4px_8px_rgba(163,177,198,0.6),-4px_-4px_8px_rgba(255,255,255,0.5)] flex items-center justify-center">
                {availabilityStatus === 'available' ? (
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                ) : availabilityStatus === 'busy' ? (
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-gray-400" />
                )}
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Status</p>
                <p className="text-[#3D4852] font-medium">
                  {availabilityStatus === 'available' && 'Available to work'}
                  {availabilityStatus === 'busy' && 'Currently busy'}
                  {availabilityStatus === 'unavailable' && 'Not available'}
                </p>
              </div>
            </div>
          )}
        </div>

        {socialLinks.length > 0 && (
          <div className="mt-auto">
            <p className="text-sm text-[#6B7280] mb-4">Connect with me</p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link, index) => {
                const Icon = socialIcons[link.platform.toLowerCase()] || Globe;
                return (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl text-[#6B7280] hover:text-[#3B82F6] transition-all duration-200 shadow-[4px_4px_8px_rgba(163,177,198,0.6),-4px_-4px_8px_rgba(255,255,255,0.5)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.7),-6px_-6px_12px_rgba(255,255,255,0.6)]"
                    aria-label={link.platform}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </NeuCard>
  );
}
