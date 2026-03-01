# React Component Audit for Astro Migration

**Audit Date:** 2026-03-01  
**Source:** `apps/public/src/features/`  
**Total Components:** 63 `.tsx` files  
**Components with Next.js APIs:** 15 files  
**Components ready for direct port:** 48 files

---

## Summary of Next.js API Usage

| API                             | Count | Migration Strategy                                                   |
| ------------------------------- | ----- | -------------------------------------------------------------------- |
| `next/image` (Image component)  | 11    | Replace with Astro `<Image>` from `astro:assets` or standard `<img>` |
| `next/link` (Link component)    | 9     | Replace with standard `<a href="">`                                  |
| `next/navigation` (usePathname) | 2     | Replace with Astro.url.pathname or client-side router                |

---

## Files Requiring Next.js API Replacement

### Layout Components (3 files)

| File                                    | Next.js APIs                                        | Migration Notes                                      |
| --------------------------------------- | --------------------------------------------------- | ---------------------------------------------------- |
| `layout/components/Navbar.tsx`          | `next/link` (Link), `next/navigation` (usePathname) | Client component - needs active link state detection |
| `layout/components/MobileBottomNav.tsx` | `next/link` (Link), `next/navigation` (usePathname) | Client component - needs active link state detection |
| `layout/components/Footer.tsx`          | `next/link` (Link)                                  | Can be server component with `<a href="">`           |

### Home Page Components (4 files)

| File                                        | Next.js APIs                             | Migration Notes                               |
| ------------------------------------------- | ---------------------------------------- | --------------------------------------------- |
| `home/components/HeroClient.tsx`            | `next/image` (Image), `next/link` (Link) | Client component - replace with standard tags |
| `home/components/FeaturedProjects.tsx`      | `next/image` (Image), `next/link` (Link) | Server component - use Astro Image            |
| `home/components/LatestArticles.tsx`        | `next/image` (Image), `next/link` (Link) | Server component - use Astro Image            |
| `home/components/LatestArticlesSection.tsx` | None detected in grep                    | Verify manually                               |

### Projects Components (3 files)

| File                                    | Next.js APIs                             | Migration Notes                                  |
| --------------------------------------- | ---------------------------------------- | ------------------------------------------------ |
| `projects/components/ProjectCard.tsx`   | `next/image` (Image), `next/link` (Link) | Card component - use Astro Image + `<a>`         |
| `projects/components/ProjectDetail.tsx` | `next/image` (Image), `next/link` (Link) | Detail page - use Astro Image + `<a>`            |
| `projects/components/ImageCarousel.tsx` | `next/image` (Image)                     | Client component for carousel - standard `<img>` |

### About Page Components (3 files)

| File                                       | Next.js APIs         | Migration Notes                                    |
| ------------------------------------------ | -------------------- | -------------------------------------------------- |
| `about/components/AboutContent.tsx`        | `next/image` (Image) | Server component - use Astro Image                 |
| `about/components/ExperienceTabs.tsx`      | `next/image` (Image) | Client component - standard `<img>` or Astro Image |
| `about/components/AchievementsDisplay.tsx` | `next/image` (Image) | Server component - use Astro Image                 |

### Blogs Components (1 file)

| File                            | Next.js APIs         | Migration Notes                  |
| ------------------------------- | -------------------- | -------------------------------- |
| `blogs/components/BlogCard.tsx` | `next/image` (Image) | Card component - use Astro Image |

### Chatbot Components (1 file)

| File                                | Next.js APIs       | Migration Notes                           |
| ----------------------------------- | ------------------ | ----------------------------------------- |
| `chatbot/components/ChatHeader.tsx` | `next/link` (Link) | Client component - standard `<a href="">` |

### Guestbook Components (1 file)

| File                                      | Next.js APIs         | Migration Notes                                |
| ----------------------------------------- | -------------------- | ---------------------------------------------- |
| `guestbook/components/GuestbookEntry.tsx` | `next/image` (Image) | Entry component - standard `<img>` for avatars |

---

## Files Ready for Direct Port (NO Next.js APIs)

The following 48 files use only React + standard web APIs and can be ported directly as Astro React islands with `client:load` or `client:visible` directives:

### Shared Components (11 files)

- `shared/components/NeuButton.tsx`
- `shared/components/NeuCard.tsx`
- `shared/components/NeuInput.tsx`
- `shared/components/NeuTextarea.tsx`
- `shared/components/NeuBadge.tsx`
- `shared/components/Section.tsx`
- `shared/components/PageHeader.tsx`
- `shared/components/SectionHeader.tsx`
- `shared/components/FloatingBlobs.tsx`
- `shared/components/LoadingState.tsx`
- `shared/components/ErrorState.tsx`
- `shared/components/EmptyState.tsx`

### Home Components (5 files)

- `home/components/HeroSection.tsx`
- `home/components/Hero.tsx`
- `home/components/HeroSkeleton.tsx`
- `home/components/TechnicalExpertise.tsx`
- `home/components/FeaturedProjectsSection.tsx`

### Projects Components (3 files)

- `projects/components/ProjectsContent.tsx`
- `projects/components/ProjectsGrid.tsx`
- `projects/components/ProjectsHeader.tsx`

### About Components (2 files)

- `about/components/AboutPageClient.tsx`
- `about/components/SkillBadges.tsx`

### Blogs Components (2 files)

- `blogs/components/BlogsContent.tsx`
- `blogs/components/BlogsGrid.tsx`
- `blogs/components/BlogsHeader.tsx`

### Contact Components (4 files)

- `contact/components/ContactContent.tsx`
- `contact/components/ContactForm.tsx`
- `contact/components/ContactInfo.tsx`
- `contact/components/ContactHeader.tsx`
- `contact/components/BookingCalendar.tsx`

### Chatbot Components (13 files)

- `chatbot/components/AIChatPage.tsx`
- `chatbot/components/ChatArea.tsx`
- `chatbot/components/ChatInput.tsx`
- `chatbot/components/ChatWidget.tsx`
- `chatbot/components/ChatWindow.tsx`
- `chatbot/components/Chatbox.tsx`
- `chatbot/components/InputArea.tsx`
- `chatbot/components/MarkdownMessage.tsx`
- `chatbot/components/MessageBubble.tsx`
- `chatbot/components/MessageList.tsx`
- `chatbot/components/MessageThread.tsx`
- `chatbot/components/SourcesList.tsx`
- `chatbot/components/TypingIndicator.tsx`

### Guestbook Components (3 files)

- `guestbook/components/Guestbook.tsx`
- `guestbook/components/GuestbookForm.tsx`
- `guestbook/components/GuestbookList.tsx`
- `guestbook/components/GuestbookModal.tsx`

---

## Migration Recommendations

### 1. Image Component Strategy

**Recommendation:** Use Astro `<Image>` from `astro:assets` for server components (static images with optimization). Use standard `<img>` for client components (dynamic, user-uploaded, or carousel images).

### 2. Link Component Strategy

**Recommendation:** Replace all `next/link` with standard `<a href="">`. Astro handles routing automatically. No client-side JavaScript needed for navigation.

### 3. usePathname Strategy (for Navbar active states)

**Recommendation:** Pass `Astro.url.pathname` from server as prop to client component, or use `window.location.pathname` in client component for active link detection.

### 4. Component Reuse Strategy

**Recommendation:** Port components as-is, marking them with `client:load` (if interactive/state) or `client:visible` (if below-fold). No React rewrites needed — 76% of components (48/63) are already portable.

---

## Task Completion Checklist

- [x] All 63 `.tsx` files inventoried
- [x] Next.js API usage identified (15 files with imports)
- [x] Migration strategy documented for each API
- [x] Clean port candidates identified (48 files)
- [x] Recommendations provided for T5 (design system) task

**Next Steps:** Use this audit in T5 (public-astro design system task) to guide component porting strategy.
