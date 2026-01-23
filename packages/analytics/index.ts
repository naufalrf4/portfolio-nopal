// Google Analytics 4 Implementation
export {
  initGA,
  trackPageView,
  trackEvent,
  trackProjectView,
  trackBlogView,
  trackContactForm,
  trackNGLSubmission,
  trackGuestbookEntry,
  trackBookingRequest,
  isGAConfigured,
  isGAReady,
  isGAEnabled, // Backward compatibility alias for isGAConfigured
} from './src/tracker';
export type { GAEvent } from './src/types';
