declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

function isGAConfigured(): boolean {
  return !!GA_MEASUREMENT_ID;
}

export function initGA(): void {
  if (!isGAConfigured() || typeof window === 'undefined') {
    return;
  }

  if (window.gtag) {
    return;
  }

  window.gtag = function gtag() {
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID!, {
    send_page_view: false,
  });
}

export function trackPageView(page: string, title: string): void {
  if (!isGAConfigured() || !window.gtag || typeof window === 'undefined') {
    return;
  }

  window.gtag('event', 'page_view', {
    page_title: title,
    page_path: page,
  });
}

export function trackEvent(category: string, action: string, label?: string, value?: number): void {
  if (!isGAConfigured() || !window.gtag || typeof window === 'undefined') {
    return;
  }

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
}

export function trackLinkClick(linkType: string, linkId: string, linkLabel: string): void {
  trackEvent('link_click', linkType, `${linkId}: ${linkLabel}`);
}

export function trackProjectView(projectId: string, _projectTitle: string): void {
  trackEvent('project_view', 'view', projectId, 1);
}

export function trackBlogView(blogId: string, _blogTitle: string): void {
  trackEvent('blog_view', 'view', blogId, 1);
}

export function trackNGLSubmission(): void {
  trackEvent('ngl_submission', 'submit', 'ngl_message', 1);
}

export function isTrackingEnabled(): boolean {
  return isGAConfigured();
}
