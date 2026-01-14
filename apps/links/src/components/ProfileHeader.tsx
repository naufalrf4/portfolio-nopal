'use client';

import Image from 'next/image';

interface ProfileHeaderProps {
  name: string;
  bio: string;
  avatarUrl?: string;
}

export function ProfileHeader({ name, bio, avatarUrl }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-5 md:gap-7 py-8 md:py-10">
      <div className="relative">
        <div className="neu-avatar-ring md:scale-125">
          <div className="neu-avatar-inner">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={name}
                width={120}
                height={120}
                className="w-full h-full object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold bg-gradient-to-br from-primary to-accent text-white">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
        <div className="absolute -bottom-1 -right-1 neu-emoji-badge">
          <span className="text-lg">👋</span>
        </div>
      </div>

      <div className="text-center space-y-3 md:space-y-4">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{name}</h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-xs md:max-w-md mx-auto leading-relaxed">
          {bio}
        </p>
      </div>

      <div className="neu-status-badge md:scale-110">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
        <span className="text-sm md:text-base text-muted-foreground font-medium">
          Available for work
        </span>
      </div>
    </div>
  );
}
