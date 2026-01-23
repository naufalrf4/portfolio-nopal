import type { GAEvent, GtagFunction, PageViewEvent } from './types';

// GA4 Measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Check if GA is configured (SSR-safe - only checks env var)
export const isGAConfigured = (): boolean => {
  return !!GA_MEASUREMENT_ID;
};

// Check if GA is ready for tracking (client-only - checks window + env var)
export const isGAReady = (): boolean => {
  return typeof window !== 'undefined' && !!GA_MEASUREMENT_ID;
};

// Backward compatibility alias (deprecated - use isGAConfigured for SSR-safe checks)
export const isGAEnabled = isGAConfigured;

const getGtag = (): GtagFunction | undefined => {
  if (typeof window === 'undefined') return undefined;
  return (window as Window & { gtag?: GtagFunction }).gtag;
};

// Initialize Google Analytics
export const initGA = (): void => {
  const gtag = getGtag();
  if (!isGAReady() || !gtag) return;

  gtag('config', GA_MEASUREMENT_ID!, {
    page_title: document.title,
    page_location: window.location.href,
  });
};

// Track page views
export const trackPageView = (pageData?: Partial<PageViewEvent>): void => {
  const gtag = getGtag();
  if (!isGAReady() || !gtag) return;

  const eventData: PageViewEvent = {
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname,
    ...pageData,
  };

  gtag('config', GA_MEASUREMENT_ID!, {
    page_title: eventData.page_title,
    page_location: eventData.page_location,
    page_path: eventData.page_path,
  });
};

// Track custom events
export const trackEvent = (event: GAEvent): void => {
  const gtag = getGtag();
  if (!isGAReady() || !gtag) return;

  gtag('event', event.action, {
    event_category: event.category,
    event_label: event.label,
    value: event.value,
  });
};

// Specific tracking functions
export const trackProjectView = (projectId: string, projectTitle?: string): void => {
  trackEvent({
    action: 'project_view',
    category: 'engagement',
    label: `${projectId}${projectTitle ? `_${projectTitle}` : ''}`,
  });
};

export const trackBlogView = (blogId: string, blogTitle?: string): void => {
  trackEvent({
    action: 'blog_view',
    category: 'engagement',
    label: `${blogId}${blogTitle ? `_${blogTitle}` : ''}`,
  });
};

export const trackContactForm = (formType: string = 'general'): void => {
  trackEvent({
    action: 'contact_form_submit',
    category: 'conversion',
    label: formType,
  });
};

export const trackNGLSubmission = (): void => {
  trackEvent({
    action: 'ngl_message_submit',
    category: 'conversion',
    label: 'anonymous_message',
  });
};

export const trackGuestbookEntry = (): void => {
  trackEvent({
    action: 'guestbook_entry',
    category: 'engagement',
    label: 'public_message',
  });
};

export const trackBookingRequest = (slotId?: string): void => {
  trackEvent({
    action: 'booking_request',
    category: 'conversion',
    label: slotId ? `slot_${slotId}` : 'general_booking',
  });
};

// gtag is loaded by Google Analytics script and available on window
