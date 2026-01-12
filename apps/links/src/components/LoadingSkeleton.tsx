'use client';

export function ProfileHeaderSkeleton() {
  return (
    <div className="flex flex-col items-center gap-5 py-8 animate-pulse">
      {/* Avatar skeleton */}
      <div className="relative">
        <div className="neu-avatar-ring">
          <div className="neu-avatar-inner bg-gradient-to-br from-gray-300 to-gray-400" />
        </div>
        <div className="absolute -bottom-1 -right-1 neu-emoji-badge">
          <div className="w-5 h-5 bg-gray-300 rounded-full" />
        </div>
      </div>

      {/* Name and bio skeleton */}
      <div className="text-center space-y-3 w-full max-w-xs">
        <div className="h-7 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg mx-auto w-48" />
        <div className="space-y-2">
          <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg mx-auto w-64" />
          <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg mx-auto w-56" />
        </div>
      </div>

      {/* Status badge skeleton */}
      <div className="neu-status-badge">
        <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
        <div className="h-4 w-32 bg-gradient-to-r from-gray-300 to-gray-400 rounded" />
      </div>
    </div>
  );
}

export function LinkButtonsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="w-full flex flex-col gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="neu-link-button animate-pulse"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="neu-link-icon">
            <div className="w-5 h-5 bg-gradient-to-br from-gray-300 to-gray-400 rounded" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="h-5 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-32" />
          </div>
          <div className="w-10 flex justify-center">
            <div className="w-4 h-4 bg-gray-300 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SocialIconsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex gap-4 justify-center">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="neu-social-icon animate-pulse">
          <div className="w-5 h-5 bg-gradient-to-br from-gray-300 to-gray-400 rounded" />
        </div>
      ))}
    </div>
  );
}
