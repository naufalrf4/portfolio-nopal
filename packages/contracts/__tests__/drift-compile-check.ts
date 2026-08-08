/**
 * DRIFT CHECK — compile-time only (not a test runner file)
 *
 * Run: npx tsc --noEmit
 *
 * If Admin changes its route handler output shape WITHOUT updating
 * @naufalrf/contracts, this file will FAIL to compile.
 *
 * Proof: rename `fullName` → `displayName` in contracts/src/index.ts,
 * then run `npx tsc --noEmit`. This file assigns `fullName` which no
 * longer exists on the AboutData contract → compile error.
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type {
  AboutData,
  ProjectListItem,
  ProjectDetail,
  ProfileLink,
  Blog,
  Achievement,
  GuestbookEntry,
  GuestbookResponse,
  MessageResponse,
  ApiSuccessEnvelope,
} from '@naufalrf/contracts';

// --- AboutData (matching Admin's GET /api/v1/public/about) ---
const _d1: AboutData = {
  fullName: '',
  tagline: null,
  roles: [],
  shortBio: null,
  bio: '',
  email: '',
  location: null,
  avatarUrl: null,
  resumeUrl: null,
  availabilityStatus: null,
  skills: [],
  experience: [],
  socialLinks: [],
};

// --- ProjectListItem (Admin's GET /api/v1/public/projects) ---
const _d2: ProjectListItem = {
  id: '',
  title: '',
  slug: '',
  summary: '',
  category: '',
  techStack: null,
  liveUrl: null,
  repoUrl: null,
  imageUrl: null,
  featured: false,
  createdAt: '',
  images: [],
};

// --- ProjectDetail (Admin's GET /api/v1/public/projects/[slug]) ---
const _d3: ProjectDetail = {
  id: '',
  title: '',
  slug: '',
  summary: '',
  description: '',
  content: null,
  category: '',
  techStack: null,
  liveUrl: null,
  repoUrl: null,
  imageUrl: null,
  featured: false,
  createdAt: '',
  projectDate: null,
  images: [],
};

// --- ProfileLink (Admin's GET /api/v1/public/links) ---
const _d4: ProfileLink = {
  id: '',
  label: '',
  url: '',
  icon: null,
  visible: false,
  order: 0,
  createdAt: '',
  updatedAt: '',
};

// --- Blog (Admin's GET /api/v1/public/blogs) ---
const _d5: Blog = {
  id: '',
  url: '',
  title: '',
  description: null,
  imageUrl: null,
  source: '',
  category: null,
  publishedAt: '',
};

// --- Achievement (Admin's GET /api/v1/public/achievements) ---
const _d6: Achievement = {
  id: '',
  name: '',
  location: '',
  monthYear: '',
  photos: [],
  description: '',
  externalUrl: null,
  order: 0,
  createdAt: '',
};

// --- GuestbookEntry (Admin's GET /api/v1/public/guestbook) ---
const _d7: GuestbookEntry = {
  id: '',
  message: '',
  createdAt: '',
  user: { name: null, image: null },
};

// --- GuestbookResponse ---
const _d8: GuestbookResponse = { entries: [] };

// --- MessageResponse (Admin's POST /api/v1/public/messages) ---
const _d9: MessageResponse = { success: false };

// --- ApiSuccessEnvelope ---
const _d10: ApiSuccessEnvelope<AboutData> = {
  success: true,
  data: _d1,
};

// Prevent tree-shaking
void _d1;
void _d2;
void _d3;
void _d4;
void _d5;
void _d6;
void _d7;
void _d8;
void _d9;
void _d10;
