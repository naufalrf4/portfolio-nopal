# Graph Report - portfolio-nopal  (2026-08-04)

## Corpus Check
- 824 files · ~1,213,933 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3890 nodes · 8279 edges · 263 communities (170 shown, 93 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 114 edges (avg confidence: 0.61)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0ac52af6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- PageWrapper.tsx
- cn
- db/schema.ts
- successResponse
- ExperienceModal.tsx
- .error
- button.tsx
- card.tsx
- features/blogs/index.ts
- validationErrorResponse
- messages/components/index.ts
- responses/index.ts
- ContactContent.tsx
- admin/projects/route.ts
- admin/achievements/route.ts
- links/index.ts
- []
- cn
- public-astro/src/lib/api.ts
- ProjectsPageContent.tsx
- seed.ts
- DashboardPageContent.tsx
- Entries
- DayCard.tsx
- BookingCalendar.tsx
- AnalyticsDashboard.tsx
- analytics.service.ts
- Guestbook.tsx
- drizzle/schema.ts
- ai
- lib/auth.ts
- admin/knowledge/[id]/route.ts
- useLiveCursorPresence.ts
- bookings.types.ts
- KnowledgeTable.tsx
- src/types.ts
- internal/chat-logs/route.ts
- booking-slots/route.ts
- EntryCard.tsx
- Visual blueprint — total layout redesign
- ui/index.ts
- shared/utils/index.ts
- public-astro/src/layouts/BaseLayout.astro
- public/about/route.ts
- NaufalRF Portfolio Platform
- status/route.ts
- server.ts
- devDependencies
- lib/submission-context.ts
- storage.ts
- getErrorMessage
- llm-provider.ts
- devDependencies
- public-astro full revamp plan (13 feedback items)
- scripts
- ContactsService
- useChat.ts
- chat-service.ts
- dependencies
- admin/bookings/route.ts
- contacts/route.ts
- public-astro/src/types/index.ts
- DESIGN.md — naufalrf.net Cross-App Design Contract
- dependencies
- AnonymousMessagesService
- FileUpload.tsx
- components.json
- useProjectEdit.ts
- ingest-service.ts
- getSubmissionContext
- dependencies
- MessagesPageContent.tsx
- links-astro/tsconfig.json
- googleCalendarService.ts
- compilerOptions
- compilerOptions
- app/layout.tsx
- booking-availability.service.ts
- rag-service/package.json
- admin/links/route.ts
- SettingsPageContent.tsx
- ProjectArticle.tsx
- scripts
- compilerOptions
- contact-settings/route.ts
- messages.types.ts
- github_webhook_server.py
- BookingsTab.tsx
- tool-service.ts
- http/src/index.ts
- start-standalone.mjs
- projects/types/index.ts
- gtag.ts
- GuestbookService
- booking-availability.schema.ts
- AvailabilityTab.tsx
- date.ts
- ProjectDetail.tsx
- bookings/[id]/page.tsx
- ragIngest.ts
- MessageCard.tsx
- validations/bookings.ts
- contacts.ts
- proxy.ts
- live-presence/package.json
- GeminiClient
- src/types.d.ts
- compilerOptions
- reset-db.ts
- contracts/package.json
- lucide-react
- tailwind-merge
- projects/[id]/page.tsx
- page-utils.ts
- http/package.json
- ngl-svelte/eslint.config.js
- +page.svelte
- next.config.js
- error/page.tsx
- app/page.tsx
- guestbook.schema.ts
- start-dev.sh
- dependencies
- next-env.d.ts
- clsx
- AGENTS.md
- @dnd-kit/sortable
- @dnd-kit/utilities
- dom-to-image-more
- compilerOptions
- @google-cloud/storage
- googleapis
- html2canvas
- next
- admin/AGENTS.md
- novel
- postgres
- @radix-ui/react-avatar
- @radix-ui/react-checkbox
- @radix-ui/react-dialog
- @radix-ui/react-label
- @radix-ui/react-popover
- @radix-ui/react-select
- @radix-ui/react-separator
- @radix-ui/react-slot
- @radix-ui/react-tooltip
- react
- react-day-picker
- react-dropzone
- react-map-gl
- sonner
- @tiptap/extension-link
- @tiptap/extension-placeholder
- @tiptap/starter-kit
- tsx
- @types/leaflet
- MessageDetailModal.tsx
- ngl-svelte/AGENTS.md
- dom-to-image-more.d.ts
- app.d.ts
- prerender
- public-astro/AGENTS.md
- GlobalScene.tsx
- rag-service/AGENTS.md
- src/config.ts
- AchievementsService
- DESIGN.md — NaufalRF public-astro
- admin-client.ts
- docker-dev-down.sh
- docker-dev-migrate.sh
- docker-dev-reset-seed.sh
- docker-dev-seed.sh
- docker-dev-up.sh
- docker-prod-bootstrap.sh
- docker-prod-migrate.sh
- docker-prod-up.sh
- github-webhook-deploy.sh
- { GET, POST }
- Architecture
- contracts/tsconfig.json
- BlogLinksService
- links-astro/AGENTS.md
- Legacy Phase2 UI Baseline
- http/tsconfig.json
- ai/page.tsx
- live-presence/AGENTS.md
- compilerOptions
- Maintenance
- Service Boundaries
- design-tokens/package.json
- PROGRESS.md
- vision-review.mjs
- icons.ts
- Baseline Evidence — Track A Pre-migration
- tsconfig/package.json
- @dnd-kit/core
- dotenv
- @google-analytics/data
- @hookform/resolvers
- leaflet
- mammoth
- mapbox-gl
- @naufalrf/contracts
- @naufalrf/design-tokens
- @next/third-parties
- nodemailer
- @paralleldrive/cuid2
- @radix-ui/react-alert-dialog
- @radix-ui/react-switch
- @radix-ui/react-tabs
- react-dom
- react-hook-form
- react-markdown
- remark-gfm
- @tiptap/extension-image
- @tiptap/react
- zod
- eslint
- eslint-config-prettier
- @eslint/js
- eslint-plugin-svelte
- prettier
- svelte-check
- typescript
- vite
- overview.md
- .context/README.md
- decisions.md
- issues.md
- learnings.md
- problems.md

## God Nodes (most connected - your core abstractions)
1. `successResponse` - 168 edges
2. `serverErrorResponse()` - 159 edges
3. `cn()` - 140 edges
4. `validationErrorResponse()` - 90 edges
5. `cn()` - 77 edges
6. `withAdminAuth()` - 76 edges
7. `Button()` - 71 edges
8. `Entries` - 70 edges
9. `notFoundResponse()` - 55 edges
10. `PageWrapper()` - 44 edges

## Surprising Connections (you probably didn't know these)
- `BookingDetailClient()` --calls--> `getErrorMessage()`  [EXTRACTED]
  apps/admin/src/app/(dashboard)/bookings/[id]/BookingDetailClient.tsx → packages/http/src/index.ts
- `FileUpload()` --calls--> `getErrorMessage()`  [EXTRACTED]
  apps/admin/src/components/upload/FileUpload.tsx → packages/http/src/index.ts
- `ImageUploader()` --calls--> `getErrorMessage()`  [EXTRACTED]
  apps/admin/src/components/upload/ImageUploader.tsx → packages/http/src/index.ts
- `useAbout()` --calls--> `getErrorMessage()`  [EXTRACTED]
  apps/admin/src/features/about/hooks/useAbout.ts → packages/http/src/index.ts
- `AvailabilityTab()` --calls--> `getErrorMessage()`  [EXTRACTED]
  apps/admin/src/features/bookings/components/AvailabilityTab.tsx → packages/http/src/index.ts

## Import Cycles
- 3-file cycle: `apps/admin/src/app/(dashboard)/contacts/[id]/ContactActions.tsx -> apps/admin/src/features/contacts/components/index.ts -> apps/admin/src/features/contacts/components/ContactDetailView.tsx -> apps/admin/src/app/(dashboard)/contacts/[id]/ContactActions.tsx`

## Communities (263 total, 93 thin omitted)

### Community 0 - "PageWrapper.tsx"
Cohesion: 0.03
Nodes (40): AboutPageContent(), metadata, AnalyticsPageContent(), metadata, NEUMORPHIC_SHADOWS, ChatLog, ChatLogsPageContent(), ChatMessage (+32 more)

### Community 1 - "cn"
Cohesion: 0.05
Nodes (68): RichTextEditor(), RichTextEditorProps, AppSidebar(), AppSidebarProps, navigation, NeuAvatar(), NeuBadge(), AlertDialogAction (+60 more)

### Community 2 - "db/schema.ts"
Cohesion: 0.03
Nodes (84): loadAdminRuntime(), handleGet(), handlePost(), GET, LocationStat, POST, ProjectContentRepairUpdate, GET (+76 more)

### Community 3 - "successResponse"
Cohesion: 0.06
Nodes (74): DELETE(), GET(), PATCH(), PUT(), RouteContext, GET, handleGet(), GET (+66 more)

### Community 4 - "ExperienceModal.tsx"
Cohesion: 0.10
Nodes (34): EMPTY_PROFILE, FreelanceToolPanel(), normalizeProfile(), parseOptionalNumber(), Textarea(), BioTab(), ExperienceCard(), ExperienceCardProps (+26 more)

### Community 5 - ".error"
Cohesion: 0.09
Nodes (51): GaDashboardSummary, GaOverview, GaPageViewPoint, getClient(), getCredentials(), getDateRange(), getGaDashboardSummary(), getGaOverview() (+43 more)

### Community 6 - "button.tsx"
Cohesion: 0.07
Nodes (41): Booking, BookingDetailClientProps, ContactActionsProps, DeleteConfirmModalProps, FormData, initialFormData, ProjectModalProps, Button() (+33 more)

### Community 7 - "card.tsx"
Cohesion: 0.05
Nodes (45): ChatLog, ChatLogDetailPageContent(), ChatLogDetailPageContentProps, ChatMessage, metadata, PageProps, ContactActions(), EditKnowledgePageContent() (+37 more)

### Community 8 - "features/blogs/index.ts"
Cohesion: 0.11
Nodes (33): BlogsPageContent(), metadata, handleSubmit(), BlogCard(), BlogCardProps, CreateBlogModal(), CreateBlogModalProps, DeleteConfirmModal() (+25 more)

### Community 9 - "validationErrorResponse"
Cohesion: 0.09
Nodes (43): handlePost(), handlePatch(), handlePost(), modelsQuerySchema, POST, PUT(), handlePost(), POST() (+35 more)

### Community 10 - "messages/components/index.ts"
Cohesion: 0.18
Nodes (12): EmptyState(), GlobalStyles(), LoadingState(), countryCoordinates, flagMap, LocationMap(), LocationMapProps, LocationStat (+4 more)

### Community 11 - "responses/index.ts"
Cohesion: 0.09
Nodes (35): GET, GET(), GET(), GET, handleGet(), handlePut(), llmConfigSchema, PUT (+27 more)

### Community 12 - "ContactContent.tsx"
Cohesion: 0.10
Nodes (29): ContactContent(), ContactContentProps, FAQS, Tab, ContactInfo(), ContactInfoProps, socialIcons, HeroFlipCard() (+21 more)

### Community 13 - "admin/projects/route.ts"
Cohesion: 0.07
Nodes (33): GET, handleGet(), handlePut(), PUT, GET, handleGet(), POST, querySchema (+25 more)

### Community 14 - "admin/achievements/route.ts"
Cohesion: 0.15
Nodes (13): handlePost(), POST, GET, POST, AchievementQueryInput, achievementQuerySchema, assetValueSchema, CreateAchievementInput (+5 more)

### Community 15 - "links/index.ts"
Cohesion: 0.10
Nodes (29): LinksPageContent(), metadata, DeleteConfirmModal(), EmptyState(), EmptyStateProps, FilterButtons(), FilterButtonsProps, IconSelector() (+21 more)

### Community 16 - "[]"
Cohesion: 0.10
Nodes (28): buildGuestIdentity(), getColorFromSeed(), getHealthUrl(), getSocketUrl(), hashString(), LivePresencePill(), LivePresencePillProps, PresenceMessage (+20 more)

### Community 17 - "cn"
Cohesion: 0.06
Nodes (45): ChatHeader(), ChatHeaderProps, ChatInput(), ChatInputProps, ChatWidget(), ChatWidgetProps, ChatWindow(), ChatWindowProps (+37 more)

### Community 18 - "public-astro/src/lib/api.ts"
Cohesion: 0.14
Nodes (16): FALLBACK_ABOUT, FetchRequestInit, getAbout(), getAchievements(), getBlogs(), getGuestbookEntries(), getProjects(), requestProjects() (+8 more)

### Community 19 - "ProjectsPageContent.tsx"
Cohesion: 0.09
Nodes (25): ProjectsPageContent(), metadata, FloatingActionButton(), FloatingActionButtonProps, ProjectModal(), DeleteConfirmModal(), EmptyState(), ProjectCard() (+17 more)

### Community 20 - "seed.ts"
Cohesion: 0.07
Nodes (43): pdf-parse, AboutInsert, AchievementInsert, AdminRuntime, buildAboutRow(), buildAchievementRows(), buildKnowledgeDocs(), buildProfileLinkRows() (+35 more)

### Community 21 - "DashboardPageContent.tsx"
Cohesion: 0.09
Nodes (20): DashboardPageContent(), DashboardStatsContent(), DashboardStatsGridProps, metadata, AnalyticsSummary, AnalyticsSummaryCard(), EmptyState(), QuickActionButton() (+12 more)

### Community 22 - "Entries"
Cohesion: 0.03
Nodes (70): 2026-03-15 14:41, 2026-03-15 14:56, 2026-03-15 15:05, 2026-03-15 16:10, 2026-03-15 16:32, 2026-03-15 18:06, 2026-03-15 19:06, 2026-03-15 19:27 (+62 more)

### Community 23 - "DayCard.tsx"
Cohesion: 0.18
Nodes (13): AddSlotModalProps, DayCardProps, SlotCard(), SlotCardProps, COMMON_TIMES, COMMON_TIMEZONES, DAY_NAMES, FILTER_BUTTONS (+5 more)

### Community 24 - "BookingCalendar.tsx"
Cohesion: 0.07
Nodes (36): BookingCalendar(), BookingCalendarProps, BookingFormData, BookingStep, formatDateLabel(), formatTimeRange(), INITIAL_FORM, isValidEmail() (+28 more)

### Community 25 - "AnalyticsDashboard.tsx"
Cohesion: 0.11
Nodes (27): AnalyticsDashboard(), AnalyticsDashboardProps, CountryDistribution(), CountryDistributionProps, getFlagEmoji(), InteractionBreakdown(), countryCoordinates, InteractionLocationMap() (+19 more)

### Community 26 - "analytics.service.ts"
Cohesion: 0.11
Nodes (20): handlePost(), POST, RATE_LIMIT_CONFIG, AnalyticsEventInsert, AnalyticsRange, AnalyticsService, asRecord(), getNullableString() (+12 more)

### Community 27 - "Guestbook.tsx"
Cohesion: 0.07
Nodes (34): AboutContent(), AboutContentProps, socialIcons, Achievement, AchievementCardProps, AchievementModal(), AchievementModalProps, AchievementsDisplay() (+26 more)

### Community 28 - "drizzle/schema.ts"
Cohesion: 0.07
Nodes (36): accountsRelations, bookingSlotsRelations, bookingsRelations, guestbookEntriesRelations, projectContextsRelations, projectImagesRelations, projectsRelations, sessionsRelations (+28 more)

### Community 30 - "lib/auth.ts"
Cohesion: 0.06
Nodes (32): buildSignInUrl(), GET(), normalizeAdminCallbackUrl(), SignInPage(), SignInPageProps, normalizeCallbackUrl(), SignInForm(), SignInFormProps (+24 more)

### Community 31 - "admin/knowledge/[id]/route.ts"
Cohesion: 0.09
Nodes (21): handlePost(), POST, RouteContext, DELETE, GET, handleDelete(), handleGet(), handlePut() (+13 more)

### Community 32 - "useLiveCursorPresence.ts"
Cohesion: 0.11
Nodes (35): clearTimers(), connect(), disconnect(), flushQueuedMove(), getHealthUrl(), getPageLabel(), getServerSnapshot(), getSnapshot() (+27 more)

### Community 33 - "bookings.types.ts"
Cohesion: 0.14
Nodes (20): SettingsCardProps, formatDateISO(), getWeekDates(), useAvailability(), useBookings(), BookingAvailability, BookingSettings, BookingsPagination (+12 more)

### Community 34 - "KnowledgeTable.tsx"
Cohesion: 0.12
Nodes (26): Booking, BookingDetailPageContentProps, ChatLog, ChatLogsTableProps, DeleteConfirmModal(), DeleteConfirmModalProps, IngestButton(), IngestButtonProps (+18 more)

### Community 35 - "src/types.ts"
Cohesion: 0.09
Nodes (25): AgenticToolName, executeCreateBooking(), executeSendMessage(), executeSubmitGuestbook(), PendingAction, stageCreateBooking(), stageSendMessage(), stageSubmitGuestbook() (+17 more)

### Community 36 - "internal/chat-logs/route.ts"
Cohesion: 0.09
Nodes (18): GET(), POST(), GET, handleGet(), GET, handleGet(), handlePost(), POST (+10 more)

### Community 37 - "booking-slots/route.ts"
Cohesion: 0.12
Nodes (18): handlePost(), POST, handlePost(), POST, GET, handleGet(), handlePost(), POST (+10 more)

### Community 38 - "EntryCard.tsx"
Cohesion: 0.10
Nodes (22): GuestbookPanel(), GuestbookPanelProps, DeleteConfirmModal(), EmptyState(), EmptyStateProps, EntryCard(), EntryCardProps, BookOpenIcon() (+14 more)

### Community 39 - "Visual blueprint — total layout redesign"
Cohesion: 0.07
Nodes (29): About — interactive professional dossier, Admin — dark operational system, AI assistant — research cockpit, Architecture targets (end state), Blogs — digital publication, not a card catalog, Contact — communication console, Decisions locked by user (owner calls — do NOT relitigate), Final verification wave (+21 more)

### Community 40 - "ui/index.ts"
Cohesion: 0.08
Nodes (32): FeaturedProjects(), FeaturedProjectsProps, badgeClass, BadgeTone, cloudIcons, SkillGroup, skillGroups, TechnicalExpertise() (+24 more)

### Community 41 - "shared/utils/index.ts"
Cohesion: 0.07
Nodes (14): BOOKING_STATUS_LABELS, COMMON_TIMES, COMMON_TIMEZONES, DAY_NAMES, PAGINATION_DEFAULT, REMINDER_DAYS, SHORT_DAY_NAMES, SLOT_DURATIONS (+6 more)

### Community 42 - "public-astro/src/layouts/BaseLayout.astro"
Cohesion: 0.10
Nodes (18): LiveCursorBand(), LiveCursorBandProps, MobileBottomNav(), MobileBottomNavProps, navItems, PresenceChip(), PresenceChipProps, ScrollToTopButton() (+10 more)

### Community 43 - "public/about/route.ts"
Cohesion: 0.05
Nodes (53): asString(), Experience, GET(), getUrlMetadata(), hasKeyword(), inferPlatform(), normalizeComparableUrl(), normalizeExperience() (+45 more)

### Community 44 - "NaufalRF Portfolio Platform"
Cohesion: 0.07
Nodes (28): 1. Install dependencies, 2. Create environment files, 3. Run the local stack, AI and retrieval separation, App-local development, Application Matrix, Architecture, Canonical machine-readable site guidance (+20 more)

### Community 45 - "status/route.ts"
Cohesion: 0.11
Nodes (19): GET, handleGet(), handlePut(), PUT, BookingStatusUpdate, PATCH, PUT(), readBookingMetadata() (+11 more)

### Community 46 - "server.ts"
Cohesion: 0.13
Nodes (27): broadcastOverview(), broadcastState(), clampCoordinate(), ClientMessage, configuredAllowedOrigins, ConnectionData, createCorsHeaders(), getRoom() (+19 more)

### Community 47 - "devDependencies"
Cohesion: 0.04
Nodes (48): devDependencies, drizzle-kit, eslint, eslint-config-next, geoip-lite, tailwindcss, @tailwindcss/postcss, tw-animate-css (+40 more)

### Community 48 - "lib/submission-context.ts"
Cohesion: 0.13
Nodes (21): buildSubmissionProxyHeaders(), getBrowserTimezone(), normalizeValue(), ProxyHeadersOptions, POST(), POST(), proxy(), POST() (+13 more)

### Community 49 - "storage.ts"
Cohesion: 0.14
Nodes (17): handlePost(), POST, ALLOWED_DOCUMENT_TYPES, ALLOWED_IMAGE_TYPES, AssetValue, extractStorageKeyFromUrl(), getBucketName(), getCredentials() (+9 more)

### Community 50 - "getErrorMessage"
Cohesion: 0.07
Nodes (37): ContactDetailPageContentProps, Select(), SelectContent(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator() (+29 more)

### Community 51 - "llm-provider.ts"
Cohesion: 0.13
Nodes (16): embedTexts(), generateText(), RagServiceError, AdminLlmConfigResponse, buildEnvFallbackConfig(), fetchLlmConfigFromAdmin(), internalToken(), resolveLlmConfig() (+8 more)

### Community 52 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, @eslint/compat, globals, prettier-plugin-svelte, svelte, @sveltejs/kit, @sveltejs/vite-plugin-svelte, @types/node (+9 more)

### Community 53 - "public-astro full revamp plan (13 feedback items)"
Cohesion: 0.07
Nodes (26): 404, 👤 ABOUT `/about`, 🤖 AI CHATBOT `/ai-chatbot` (revamp penuh), 📝 BLOGS `/blogs`, BRAINSTORM PER HALAMAN (layout, struktur, animasi), ✉️ CONTACT `/contact`, Execution order, 📖 GUESTBOOK `/guestbook` (+18 more)

### Community 54 - "scripts"
Cohesion: 0.04
Nodes (48): @commitlint/cli, @commitlint/config-conventional, eslint-plugin-react, lint-staged, description, devDependencies, @commitlint/cli, @commitlint/config-conventional (+40 more)

### Community 55 - "ContactsService"
Cohesion: 0.14
Nodes (10): ContactDetailPageContent(), ContactDetailPage(), generateMetadata(), PageProps, getContactById(), markContactAsRead(), normalizeContact(), ContactsService (+2 more)

### Community 56 - "useChat.ts"
Cohesion: 0.13
Nodes (20): ChatServiceError, confirmAction(), sendChatMessage(), SendChatMessageOptions, SourcesList(), SourcesListProps, ChatMetadata, ChatRequest (+12 more)

### Community 57 - "chat-service.ts"
Cohesion: 0.17
Nodes (23): getChatLog(), ABOUT_FALLBACK_ACTION, AGENTIC_PATTERNS, buildAbstentionActions(), buildCitations(), buildSuggestedActions(), buildToolArguments(), chat() (+15 more)

### Community 58 - "dependencies"
Cohesion: 0.04
Nodes (46): dependencies, astro, @astrojs/node, @astrojs/react, @astrojs/sitemap, clsx, framer-motion, lucide-react (+38 more)

### Community 59 - "admin/bookings/route.ts"
Cohesion: 0.14
Nodes (18): GET, handleGet(), GET, handleGet(), handlePost(), POST, bookingsService, bookings (+10 more)

### Community 60 - "contacts/route.ts"
Cohesion: 0.17
Nodes (12): PATCH, GET, handleGet(), handlePost(), POST, contactForms, BulkContactActionInput, bulkContactActionSchema (+4 more)

### Community 61 - "public-astro/src/types/index.ts"
Cohesion: 0.06
Nodes (49): SkillBadgesProps, BlogCard(), BlogCardProps, BlogsContentProps, BlogsGrid(), BlogsGridProps, AchievementsPreview(), AchievementsPreviewProps (+41 more)

### Community 62 - "DESIGN.md — naufalrf.net Cross-App Design Contract"
Cohesion: 0.08
Nodes (23): 0. Source of Truth, 10. Token Verification, 1. Design Principles, 2.1 Color, 2.2 Typography, 2.3 Radius, 2.4 Tailwind 4 `@theme` Mappings, 2. Design Tokens (+15 more)

### Community 63 - "dependencies"
Cohesion: 0.05
Nodes (40): dependencies, astro, @astrojs/node, @astrojs/react, @astrojs/sitemap, clsx, lucide-react, @naufalrf/contracts (+32 more)

### Community 65 - "FileUpload.tsx"
Cohesion: 0.08
Nodes (23): DeleteConfirmModal(), DeleteConfirmModalProps, DraggableImageGrid(), DraggableImageGridProps, ProjectImage, SortableImage(), Switch(), FileUpload() (+15 more)

### Community 66 - "components.json"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 67 - "useProjectEdit.ts"
Cohesion: 0.12
Nodes (17): ProjectEditPageContent(), PageProps, ContentTab(), ContentTabProps, ImageTab(), extractLeadingJsonDocument(), JsonMark, JsonNode (+9 more)

### Community 68 - "ingest-service.ts"
Cohesion: 0.18
Nodes (18): chunkText(), ingest(), ingestAbout(), ingestKnowledgeDoc(), ingestProject(), ingestTextDocument(), buildSourceMetadata(), sourceLabel() (+10 more)

### Community 69 - "getSubmissionContext"
Cohesion: 0.21
Nodes (17): getCityFromHeaders(), getClientIp(), getCountryCodeFromHeaders(), getLanguage(), getReferrerDomain(), getRegionFromHeaders(), getSubmissionContext(), inferCountryCodeFromTimezone() (+9 more)

### Community 70 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, @naufalrf/contracts, @naufalrf/design-tokens, @naufalrf/http, @sveltejs/adapter-node, tailwindcss, @tailwindcss/vite, @naufalrf/contracts (+5 more)

### Community 71 - "MessagesPageContent.tsx"
Cohesion: 0.17
Nodes (12): MessagesPanel(), MessagesPanelProps, DeleteConfirmModal(), FilterTabs(), MarkAllAsReadButton(), MessageDetailModalProps, MessageListProps, useDeleteModal() (+4 more)

### Community 72 - "links-astro/tsconfig.json"
Cohesion: 0.17
Nodes (11): compilerOptions, baseUrl, paths, strictNullChecks, exclude, extends, include, astro/tsconfigs/strict (+3 more)

### Community 73 - "googleCalendarService.ts"
Cohesion: 0.15
Nodes (12): BookingCalendarEventInput, BookingCalendarEventResult, buildCallbackUrl(), createOAuthClient(), decryptRefreshToken(), encryptRefreshToken(), getConfiguredRefreshToken(), getGoogleClientCredentials() (+4 more)

### Community 74 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowJs, baseUrl, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules, jsx (+22 more)

### Community 75 - "compilerOptions"
Cohesion: 0.09
Nodes (22): ES2022, **/*.js, **/*.jsx, compilerOptions, allowJs, baseUrl, isolatedModules, jsx (+14 more)

### Community 76 - "app/layout.tsx"
Cohesion: 0.18
Nodes (10): dmSans, metadata, plusJakarta, AnalyticsPageView(), GoogleAnalytics(), GoogleAnalyticsProps, isGAReady(), trackPageView() (+2 more)

### Community 77 - "booking-availability.service.ts"
Cohesion: 0.15
Nodes (8): AvailabilityQueryInput, BookingAvailabilityRecord, BookingAvailabilityService, BookingAvailabilityUpdate, BulkUpdateAvailabilityInput, CreateBookingAvailabilityInput, UpdateBookingAvailabilityInput, bookingAvailability

### Community 78 - "rag-service/package.json"
Cohesion: 0.09
Nodes (21): dependencies, hono, postgres, devDependencies, @types/bun, typescript, postgres, typescript (+13 more)

### Community 79 - "admin/links/route.ts"
Cohesion: 0.11
Nodes (13): handlePost(), POST, GET, handleGet(), handlePost(), POST, ProfileLinksService, CreateProfileLinkInput (+5 more)

### Community 80 - "SettingsPageContent.tsx"
Cohesion: 0.17
Nodes (7): neuStyles, SettingsPageContentProps, neuStyles, SignOutButton(), Avatar(), AvatarFallback(), AvatarImage()

### Community 81 - "ProjectArticle.tsx"
Cohesion: 0.25
Nodes (14): ARTICLE_STYLES, extractLeadingJsonDocument(), getNormalizedContent(), isSafeImageUrl(), isSafeUrl(), JsonNode, MarkdownArticle(), parseJsonSafely() (+6 more)

### Community 82 - "scripts"
Cohesion: 0.14
Nodes (13): name, private, scripts, build, check, check:watch, dev, format (+5 more)

### Community 83 - "compilerOptions"
Cohesion: 0.14
Nodes (13): compilerOptions, allowJs, checkJs, esModuleInterop, forceConsistentCasingInFileNames, moduleResolution, resolveJsonModule, rewriteRelativeImportExtensions (+5 more)

### Community 84 - "contact-settings/route.ts"
Cohesion: 0.23
Nodes (8): GET, handleGet(), handlePut(), PUT, ContactSettingsService, contactSettings, UpdateContactSettingsInput, updateContactSettingsSchema

### Community 85 - "messages.types.ts"
Cohesion: 0.27
Nodes (9): EMPTY_STATE_CONFIG, EmptyStateProps, FilterTabsProps, MarkAllAsReadButtonProps, MessagesContentProps, COLORS, FILTER_TABS, NEUMORPHIC_SHADOWS (+1 more)

### Community 86 - "github_webhook_server.py"
Cohesion: 0.29
Nodes (7): BaseHTTPRequestHandler, HTTPStatus, Handler, json_response(), mark_delivery(), spawn_deploy(), verify_signature()

### Community 87 - "BookingsTab.tsx"
Cohesion: 0.27
Nodes (8): ActionButton(), ActionButtonProps, BookingsTab(), BookingsTabProps, BulkAddModal(), DetailField(), DetailFieldProps, SettingsCard()

### Community 88 - "tool-service.ts"
Cohesion: 0.40
Nodes (14): normalizeLanguage(), asFloat(), asFreelanceProfile(), asReferencePrices(), asString(), asStringList(), executeFeaturePricingQuote(), executeFreelanceProfileLookup() (+6 more)

### Community 89 - "http/src/index.ts"
Cohesion: 0.09
Nodes (29): buildAnalyticsProxyHeaders(), apiFetch(), getAboutData(), getLinksPageData(), getProfileLinks(), LinksPageData, POST(), AboutData (+21 more)

### Community 90 - "start-standalone.mjs"
Cohesion: 0.22
Nodes (8): publicSourceDir, publicTargetDir, rootDir, serverEntry, standaloneDir, standaloneNextDir, staticSourceDir, staticTargetDir

### Community 91 - "projects/types/index.ts"
Cohesion: 0.25
Nodes (7): FILTER_BUTTONS, NEUMORPHIC_STYLES, FilterMode, Project, ProjectCardProps, ProjectTableProps, ViewMode

### Community 92 - "gtag.ts"
Cohesion: 0.42
Nodes (7): event(), GA_MEASUREMENT_ID, GtagEvent, isProduction(), pageview(), shouldLoadAnalytics(), Window

### Community 94 - "booking-availability.schema.ts"
Cohesion: 0.22
Nodes (8): AvailabilityQueryInput, availabilityQuerySchema, BulkUpdateAvailabilityInput, bulkUpdateAvailabilitySchema, CreateBookingAvailabilityInput, createBookingAvailabilitySchema, UpdateBookingAvailabilityInput, updateBookingAvailabilitySchema

### Community 95 - "AvailabilityTab.tsx"
Cohesion: 0.34
Nodes (11): AddSlotModal(), AvailabilityTab(), DayCard(), formatDateFull(), formatDateISO(), formatDateShort(), getServerDate(), getWeekDates() (+3 more)

### Community 96 - "date.ts"
Cohesion: 0.31
Nodes (12): BookingDetailClient(), BookingDetailPageContent(), formatDate(), formatDateTime(), formatJakartaKey(), formatRelativeTime(), getValidDate(), isFuture() (+4 more)

### Community 97 - "ProjectDetail.tsx"
Cohesion: 0.22
Nodes (9): LatestArticles(), ImageCarousel(), ImageCarouselProps, ProjectDetail(), Section(), SectionProps, getProjectBySlug(), formatDate() (+1 more)

### Community 98 - "bookings/[id]/page.tsx"
Cohesion: 0.39
Nodes (5): BookingDetailPage(), generateMetadata(), PageProps, getBookingById(), Booking

### Community 99 - "ragIngest.ts"
Cohesion: 0.36
Nodes (7): dispatchRagIngest(), normalizeBaseUrl(), parseResponsePayload(), RagIngestRequest, RagIngestResult, RagIngestType, toErrorMessage()

### Community 100 - "MessageCard.tsx"
Cohesion: 0.20
Nodes (3): MessageCard(), MessageCardProps, truncate()

### Community 101 - "validations/bookings.ts"
Cohesion: 0.29
Nodes (6): BookingInput, bookingSchema, StatusUpdateInput, statusUpdateSchema, UpdateBookingInput, updateBookingSchema

### Community 102 - "contacts.ts"
Cohesion: 0.29
Nodes (6): BulkActionInput, bulkActionSchema, ContactFormInput, contactFormSchema, UpdateContactInput, updateContactSchema

### Community 103 - "proxy.ts"
Cohesion: 0.33
Nodes (6): applyPublicApiCors(), config, configuredPublicApiAllowedOrigins, defaultPublicApiAllowedOrigins, protectedRoutes, proxy()

### Community 104 - "live-presence/package.json"
Cohesion: 0.29
Nodes (6): name, private, scripts, dev, start, type

### Community 105 - "GeminiClient"
Cohesion: 0.17
Nodes (3): GeminiClient, LlmClient, OpenAiCompatibleClient

### Community 106 - "src/types.d.ts"
Cohesion: 0.33
Nodes (5): @auth/core/jwt, JWT, next-auth, Session, User

### Community 107 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, module, moduleResolution, outDir, rootDir, types, extends, include (+3 more)

### Community 108 - "reset-db.ts"
Cohesion: 0.50
Nodes (4): EXCLUDED_TABLES, main(), sql, TableRow

### Community 109 - "contracts/package.json"
Cohesion: 0.17
Nodes (11): devDependencies, @naufalrf/tsconfig, typescript, exports, @naufalrf/tsconfig, typescript, main, name (+3 more)

### Community 113 - "page-utils.ts"
Cohesion: 0.50
Nodes (3): PAGE_ANIMATION, PAGE_CONTAINER_CLASSES, SECTION_GAP

### Community 114 - "http/package.json"
Cohesion: 0.17
Nodes (11): devDependencies, @naufalrf/tsconfig, typescript, exports, @naufalrf/tsconfig, typescript, main, name (+3 more)

### Community 116 - "+page.svelte"
Cohesion: 0.24
Nodes (4): clearTimers(), connect(), scheduleReconnect(), ./$types

### Community 117 - "next.config.js"
Cohesion: 0.50
Nodes (3): __dirname, nextConfig, WORKSPACE_ROOT

### Community 126 - "dependencies"
Cohesion: 0.13
Nodes (15): dependencies, class-variance-authority, date-fns, drizzle-orm, @naufalrf/http, next-auth, use-debounce, vaul (+7 more)

### Community 129 - "AGENTS.md"
Cohesion: 0.18
Nodes (9): 1. Project Context, 2. Technology Baseline, 3. Architecture and Structure Rules, 4. Operational Command Set, 5. Git Workflow Rules, 6. Agent Behavior, 7. Authority Order, 8. Self-Learn and Learned Rules (+1 more)

### Community 133 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, moduleResolution, noUncheckedIndexedAccess, skipLibCheck, strict (+2 more)

### Community 138 - "admin/AGENTS.md"
Cohesion: 0.20
Nodes (8): 1. Project Context, 2. Technology Baseline, 3. Architecture and Structure Rules, 4. Operational Command Set, 5. Git Workflow Rules, 6. Agent Behavior, 7. Authority Order, 8. Self-Learn and Learned Rules

### Community 160 - "MessageDetailModal.tsx"
Cohesion: 0.42
Nodes (7): MessageDetailModal(), COLORS, downloadMessageImage(), escapeHtml(), generateMessageImage(), ImageGeneratorOptions, shareToInstagramStory()

### Community 161 - "ngl-svelte/AGENTS.md"
Cohesion: 0.20
Nodes (8): 1. Project Context, 2. Technology Baseline, 3. Architecture and Structure Rules, 4. Operational Command Set, 5. Git Workflow Rules, 6. Agent Behavior, 7. Authority Order, 8. Self-Learn and Learned Rules

### Community 175 - "public-astro/AGENTS.md"
Cohesion: 0.20
Nodes (8): 1. Project Context, 2. Technology Baseline, 3. Architecture and Structure Rules, 4. Operational Command Set, 5. Git Workflow Rules, 6. Agent Behavior, 7. Authority Order, 8. Self-Learn and Learned Rules

### Community 179 - "GlobalScene.tsx"
Cohesion: 0.29
Nodes (8): GlobalScene(), initEngine(), makeDotTexture(), pickStarClass(), shouldUseWebGL(), STAR_COLORS, STAR_SCALE, STAR_WEIGHTS

### Community 180 - "rag-service/AGENTS.md"
Cohesion: 0.20
Nodes (8): 1. Project Context, 2. Technology Baseline, 3. Architecture and Structure Rules, 4. Operational Command Set, 5. Git Workflow Rules, 6. Agent Behavior, 7. Authority Order, 8. Self-Learn and Learned Rules

### Community 181 - "src/config.ts"
Cohesion: 0.38
Nodes (7): config, env(), envBool(), envFloat(), envInt(), bootstrap(), Sql

### Community 183 - "DESIGN.md — NaufalRF public-astro"
Cohesion: 0.22
Nodes (8): 0. Palette (from `@naufalrf/design-tokens`, dark default), 1. Typography, 2. Layout principles (THE point of this redesign), 3. Motion, 4. Components, 5. Accessibility, 6. Accepted debt, DESIGN.md — NaufalRF public-astro

### Community 184 - "admin-client.ts"
Cohesion: 0.39
Nodes (7): adminRequest(), getContentExport(), getFreelanceIntentContext(), getKnowledgeDocById(), internalToken(), markKnowledgeDocIndexed(), saveChatLog()

### Community 204 - "Architecture"
Cohesion: 0.22
Nodes (8): App boundaries, Architecture, Data flow, Database ownership, Design baseline, Execution model, Repo truth notes, Style

### Community 209 - "contracts/tsconfig.json"
Cohesion: 0.22
Nodes (8): compilerOptions, outDir, rootDir, extends, include, @naufalrf/tsconfig/base.json, src/**/*.ts, __tests__/drift-compile-check.ts

### Community 212 - "links-astro/AGENTS.md"
Cohesion: 0.25
Nodes (6): 1. Project Context, 4. Operational Command Set, 5. Git Workflow Rules, 6. Agent Behavior, 7. Authority Order, 8. Self-Learn and Learned Rules

### Community 213 - "Legacy Phase2 UI Baseline"
Cohesion: 0.25
Nodes (7): Admin baseline, Current carryover already visible in this repo, Legacy Phase2 UI Baseline, Public-app page baseline, Rules for future UI work, Shared primitives to preserve, Visual language

### Community 214 - "http/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, outDir, rootDir, extends, include, @naufalrf/tsconfig/base.json, src/**/*.ts

### Community 215 - "ai/page.tsx"
Cohesion: 0.33
Nodes (6): AISettingsPage(), LlmConfigData, maskApiKey(), PROVIDER_OPTIONS, Slot, SlotState

### Community 216 - "live-presence/AGENTS.md"
Cohesion: 0.29
Nodes (5): 1. Project Context, 2. Technology Baseline, 3. Architecture and Structure Rules, 4. Operational Command Set, 5. Self-Learn and Learned Rules

### Community 217 - "compilerOptions"
Cohesion: 0.29
Nodes (6): compilerOptions, baseUrl, paths, strictNullChecks, extends, astro/tsconfigs/strict

### Community 218 - "Maintenance"
Cohesion: 0.33
Nodes (5): Dependency posture, Maintenance, Ownership posture, Progress logging, Refresh triggers

### Community 219 - "Service Boundaries"
Cohesion: 0.33
Nodes (5): Boundary rules, Contract-sensitive areas, Cross-app contract model, Observed API consumers, Service Boundaries

### Community 220 - "design-tokens/package.json"
Cohesion: 0.40
Nodes (4): exports, name, private, version

### Community 221 - "PROGRESS.md"
Cohesion: 0.40
Nodes (4): 2026-07-26 — Neu system fully removed (public-astro), 2026-07-26 — Projects/Contact/About token consistency sweep (public-astro), 2026-08-02 — GlobalScene circuit+flow fidelity pass (public-astro), 2026-08-04 — Home landing revamp: glass CTA, guestbook marquee rewrite, richer expertise (public-astro)

### Community 222 - "vision-review.mjs"
Cohesion: 0.40
Nodes (4): b64, body, ext, MIME

### Community 224 - "Baseline Evidence — Track A Pre-migration"
Cohesion: 0.50
Nodes (3): Baseline Evidence — Track A Pre-migration, Commands & Results, Summary

### Community 225 - "tsconfig/package.json"
Cohesion: 0.50
Nodes (3): name, private, version

## Knowledge Gaps
- **1358 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+1353 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **93 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `PageWrapper.tsx`, `FileUpload.tsx`, `KnowledgeTable.tsx`, `ExperienceModal.tsx`, `button.tsx`, `card.tsx`, `SettingsPageContent.tsx`, `getErrorMessage`, `AnalyticsDashboard.tsx`, `lib/auth.ts`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `pdf-parse` connect `seed.ts` to `dependencies`, `card.tsx`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `clsx`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `dom-to-image-more`, `@google-cloud/storage`, `googleapis`, `html2canvas`, `next`, `novel`, `postgres`, `@radix-ui/react-avatar`, `@radix-ui/react-checkbox`, `@radix-ui/react-dialog`, `@radix-ui/react-label`, `@radix-ui/react-popover`, `@radix-ui/react-select`, `@radix-ui/react-separator`, `seed.ts`, `@radix-ui/react-slot`, `@radix-ui/react-tooltip`, `react`, `react-day-picker`, `react-dropzone`, `react-map-gl`, `sonner`, `@tiptap/extension-link`, `ai`, `@tiptap/extension-placeholder`, `@tiptap/starter-kit`, `tsx`, `@types/leaflet`, `devDependencies`, `zod`, `@dnd-kit/core`, `dotenv`, `@google-analytics/data`, `@hookform/resolvers`, `leaflet`, `mammoth`, `mapbox-gl`, `@naufalrf/contracts`, `@naufalrf/design-tokens`, `@next/third-parties`, `nodemailer`, `@paralleldrive/cuid2`, `lucide-react`, `@radix-ui/react-alert-dialog`, `@radix-ui/react-switch`, `@radix-ui/react-tabs`, `react-dom`, `react-hook-form`, `react-markdown`, `remark-gfm`, `tailwind-merge`, `@tiptap/extension-image`, `@tiptap/react`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _1358 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PageWrapper.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.033129459734964326 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.04911180773249739 - nodes in this community are weakly interconnected._
- **Should `db/schema.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.03096872616323417 - nodes in this community are weakly interconnected._