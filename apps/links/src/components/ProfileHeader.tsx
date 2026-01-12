'use client';

import Image from 'next/image';

interface ProfileHeaderProps {
  name: string;
  bio: string;
  avatarUrl?: string;
}

export function ProfileHeader({ name, bio, avatarUrl }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-24 h-24 rounded-full overflow-hidden neu-extruded p-1">
        <div className="w-full h-full rounded-full overflow-hidden bg-secondary">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={name}
              width={96}
              height={96}
              className="w-full h-full object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-muted-foreground">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-xl font-bold text-foreground">{name}</h1>
        <p className="text-sm text-muted-foreground mt-1">{bio}</p>
      </div>
    </div>
  );
}
