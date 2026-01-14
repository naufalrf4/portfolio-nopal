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
  isGAEnabled,
} from './src/tracker';
export type { GAEvent } from './src/types';
