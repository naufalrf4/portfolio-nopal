'use client';

import { ExternalLink, Github } from 'lucide-react';
import { trackLinkClick } from '@/lib/analytics/tracker';

interface ProjectLinksProps {
  liveUrl?: string;
  repoUrl?: string;
}

export function ProjectLinks({ liveUrl, repoUrl }: ProjectLinksProps) {
  if (!liveUrl && !repoUrl) {
    return null;
  }

  return (
    <div className="neu-card">
      <h3 className="text-lg font-bold text-foreground mb-4">Links</h3>
      <div className="flex flex-wrap gap-4">
        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 neu-extruded px-6 py-3 rounded-2xl font-medium text-foreground hover:neu-extruded-hover transition-all"
            onClick={() => trackLinkClick('live_url', liveUrl, 'Live Demo')}
          >
            <ExternalLink size={18} />
            <span>Live Demo</span>
          </a>
        )}
        {repoUrl && (
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 neu-extruded px-6 py-3 rounded-2xl font-medium text-foreground hover:neu-extruded-hover transition-all"
            onClick={() => trackLinkClick('repo_url', repoUrl, 'Source Code')}
          >
            <Github size={18} />
            <span>Source Code</span>
          </a>
        )}
      </div>
    </div>
  );
}
