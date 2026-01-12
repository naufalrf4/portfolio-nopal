'use client';

import { useEffect } from 'react';
import { trackBlogView } from '@/lib/analytics/tracker';

interface BlogViewTrackerProps {
  blogId: string;
  blogTitle: string;
}

export function BlogViewTracker({ blogId, blogTitle }: BlogViewTrackerProps): null {
  useEffect(() => {
    trackBlogView(blogId, blogTitle);
  }, [blogId, blogTitle]);

  return null;
}
