'use client';

interface ProfileLink {
  id: string;
  label: string;
  url: string;
  icon?: string;
}

interface LinkButtonsProps {
  links: ProfileLink[];
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" x2="21" y1="14" y2="3" />
    </svg>
  );
}

export function LinkButtons({ links }: LinkButtonsProps) {
  return (
    <div className="w-full flex flex-col gap-3">
      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 px-6 rounded-2xl neu-extruded flex items-center justify-between text-foreground font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-[12px_12px_24px_rgba(163,177,198,0.7),-12px_-12px_24px_rgba(255,255,255,0.6)] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.3)] active:translate-y-0"
        >
          <span>{link.label}</span>
          <ExternalLinkIcon className="w-4 h-4 text-muted-foreground" />
        </a>
      ))}
    </div>
  );
}
