'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Clock, Info } from 'lucide-react';
import { SignOutButton } from '../../../components/common/SignOutButton';
import type { Session } from 'next-auth';

const neuStyles = {
  background: '#E0E5EC',
  foreground: '#3D4852',
  muted: '#6B7280',
  blue: '#3B82F6',
  extruded: '6px 6px 12px rgba(163,177,198,0.6), -6px -6px 12px rgba(255,255,255,0.5)',
  inset: 'inset 6px 6px 10px rgba(163,177,198,0.6), inset -6px -6px 10px rgba(255,255,255,0.5)',
};

interface SettingsPageContentProps {
  session: Session;
}

function NeuCard({
  children,
  className = '',
}: {
  children: import('react').ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl p-6 md:p-8 ${className}`}
      style={{
        background: neuStyles.background,
        boxShadow: neuStyles.extruded,
      }}
    >
      {children}
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: import('react').ElementType;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div
        className="flex items-center justify-center h-10 w-10 rounded-2xl"
        style={{
          background: neuStyles.background,
          boxShadow: neuStyles.inset,
        }}
      >
        <Icon className="h-5 w-5" style={{ color: neuStyles.blue }} />
      </div>
      <h2 className="text-xl font-semibold" style={{ color: neuStyles.foreground }}>
        {title}
      </h2>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: import('react').ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b border-gray-200/50 last:border-0 gap-2">
      <span className="text-sm font-medium" style={{ color: neuStyles.muted }}>
        {label}
      </span>
      <span className="text-sm sm:text-right break-all" style={{ color: neuStyles.foreground }}>
        {value}
      </span>
    </div>
  );
}

function Badge({
  children,
  variant = 'default',
}: {
  children: import('react').ReactNode;
  variant?: 'default' | 'blue';
}) {
  const colors = {
    default: { bg: neuStyles.background, text: neuStyles.foreground },
    blue: { bg: neuStyles.blue, text: '#FFFFFF' },
  };
  const color = colors[variant];

  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
      style={{
        background: color.bg,
        color: color.text,
        boxShadow: variant === 'default' ? neuStyles.extruded : `0 2px 8px ${color.bg}40`,
      }}
    >
      {children}
    </span>
  );
}

export function SettingsPageContent({ session }: SettingsPageContentProps) {
  const user = session?.user;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const lastSignIn = user?.email
    ? new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Unknown';

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NeuCard className="lg:col-span-2">
          <SectionHeader icon={User} title="Profile" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
            <div
              className="rounded-full p-1 mx-auto sm:mx-0"
              style={{ boxShadow: neuStyles.extruded }}
            >
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                <AvatarImage src={user?.image || undefined} alt={user?.name || 'User'} />
                <AvatarFallback
                  className="text-2xl font-semibold"
                  style={{ background: neuStyles.background, color: neuStyles.blue }}
                >
                  {user?.name ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 text-center sm:text-left w-full">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 mb-2">
                <h3 className="text-2xl font-bold" style={{ color: neuStyles.foreground }}>
                  {user?.name}
                </h3>
                <Badge variant="blue">ADMIN</Badge>
              </div>
              <p className="text-sm break-all" style={{ color: neuStyles.muted }}>
                {user?.email}
              </p>
            </div>
          </div>

          <div
            className="rounded-2xl p-5"
            style={{
              background: neuStyles.background,
              boxShadow: neuStyles.inset,
            }}
          >
            <InfoRow label="Name" value={user?.name || 'Not set'} />
            <InfoRow label="Email" value={user?.email || 'Not set'} />
            <InfoRow label="Provider" value={<Badge>Google</Badge>} />
          </div>
        </NeuCard>

        <NeuCard>
          <SectionHeader icon={Clock} title="Session" />

          <div
            className="rounded-2xl p-5 mb-6"
            style={{
              background: neuStyles.background,
              boxShadow: neuStyles.inset,
            }}
          >
            <InfoRow label="Last Sign In" value={lastSignIn} />
            <InfoRow label="Status" value={<Badge variant="blue">Active</Badge>} />
          </div>

          <SignOutButton />
        </NeuCard>

        <NeuCard>
          <SectionHeader icon={Info} title="About" />

          <div
            className="rounded-2xl p-5"
            style={{
              background: neuStyles.background,
              boxShadow: neuStyles.inset,
            }}
          >
            <InfoRow label="Application" value="NaufalRF Portfolio Admin" />
            <InfoRow label="Version" value="1.0.0" />
            <InfoRow label="Framework" value="Next.js 15" />
          </div>
        </NeuCard>
      </div>

      <div className="text-center py-6">
        <p className="text-sm" style={{ color: neuStyles.muted }}>
          Made with care by NaufalRF
        </p>
      </div>
    </>
  );
}
