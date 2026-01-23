export { fetchApi, buildQueryString, ApiError } from './client';
export * from './types';
export * from './endpoints';

import { aboutApi } from './endpoints/about';
import { achievementsApi } from './endpoints/achievements';
import { blogsApi } from './endpoints/blogs';
import { bookingsApi } from './endpoints/bookings';
import { contactApi } from './endpoints/contact';
import { guestbookApi } from './endpoints/guestbook';
import { linksApi } from './endpoints/links';
import { projectsApi } from './endpoints/projects';

export const api = {
  about: aboutApi,
  achievements: achievementsApi,
  blogs: blogsApi,
  bookings: bookingsApi,
  contact: contactApi,
  guestbook: guestbookApi,
  links: linksApi,
  projects: projectsApi,
};
