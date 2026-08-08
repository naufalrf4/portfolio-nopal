# Graph Report - .  (2026-08-01)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 3474 nodes · 8082 edges · 211 communities (145 shown, 66 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 238 edges (avg confidence: 0.56)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0ac52af6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- PageWrapper.tsx
- cn
- db/schema.ts
- SuccessResponse
- admin/src/lib/utils.ts
- .error
- button.tsx
- card.tsx
- features/blogs/index.ts
- validationErrorResponse
- messages/components/index.ts
- responses/index.ts
- AboutContent.tsx
- admin/projects/route.ts
- admin/achievements/route.ts
- links/index.ts
- []
- cn
- public-astro/src/lib/api.ts
- ProjectsPageContent.tsx
- seed.ts
- DashboardPageContent.tsx
- chat_service.py
- AvailabilityTab.tsx
- BookingCalendar.tsx
- AnalyticsDashboard.tsx
- analytics.service.ts
- routes/chat.py
- drizzle/schema.ts
- dependencies
- lib/auth.ts
- RagRepository
- Guestbook.tsx
- bookings.types.ts
- KnowledgeTable.tsx
- ingest_service.py
- internal/chat-logs/route.ts
- booking-slots/route.ts
- EntryCard.tsx
- ChatService
- pages/index.astro
- shared/utils/index.ts
- public-astro/src/layouts/BaseLayout.astro
- content-export.service.ts
- deploy.py
- status/route.ts
- server.ts
- devDependencies
- lib/submission-context.ts
- storage.ts
- contacts.types.ts
- AdminApiClient
- devDependencies
- about.service.ts
- devDependencies
- ContactsService
- useChat.ts
- LlmService
- dependencies
- admin/bookings/route.ts
- contacts/[id]/route.ts
- components/shared/index.ts
- ToolService
- dependencies
- admin/messages/route.ts
- ImageUploader.tsx
- components.json
- useProjectEdit.ts
- scripts
- scripts
- tailwindcss
- public/about/route.ts
- links-astro/tsconfig.json
- googleCalendarService.ts
- compilerOptions
- compilerOptions
- app/layout.tsx
- booking-availability.service.ts
- scripts
- admin/links/route.ts
- SettingsPageContent.tsx
- ProjectArticle.tsx
- scripts
- compilerOptions
- contact-settings/route.ts
- TokenizerService
- github_webhook_server.py
- BookingsTab.tsx
- include
- ngl-svelte/src/lib/api.ts
- start-standalone.mjs
- projects/types/index.ts
- gtag.ts
- GuestbookService
- booking-availability.schema.ts
- links-astro/package.json
- public-astro/package.json
- include
- bookings/[id]/page.tsx
- ragIngest.ts
- ProfileLinksService
- validations/bookings.ts
- contacts.ts
- proxy.ts
- live-presence/package.json
- unauthorized/page.tsx
- src/types.d.ts
- lib/analytics.ts
- reset-db.ts
- +server.ts
- lucide-react
- tailwind-merge
- projects/[id]/page.tsx
- page-utils.ts
- lib
- ngl-svelte/eslint.config.js
- lib/LivePresenceBadge.svelte
- next.config.js
- error/page.tsx
- app/page.tsx
- guestbook.schema.ts
- start-dev.sh
- class-variance-authority
- next-env.d.ts
- clsx
- date-fns
- @dnd-kit/sortable
- @dnd-kit/utilities
- dom-to-image-more
- drizzle-orm
- @google-cloud/storage
- googleapis
- html2canvas
- next
- next-auth
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
- use-debounce
- vaul
- dom-to-image-more.d.ts
- app.d.ts
- prerender
- +page.server.ts
- api/__init__.py
- routes/__init__.py
- db/__init__.py
- app/__init__.py
- schemas/__init__.py
- services/__init__.py
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
- rag-service-fastapi

## God Nodes (most connected - your core abstractions)
1. `SuccessResponse` - 161 edges
2. `serverErrorResponse()` - 152 edges
3. `cn()` - 140 edges
4. `validationErrorResponse()` - 86 edges
5. `withAdminAuth()` - 74 edges
6. `Button()` - 71 edges
7. `cn()` - 59 edges
8. `notFoundResponse()` - 55 edges
9. `PageWrapper()` - 44 edges
10. `db` - 37 edges

## Surprising Connections (you probably didn't know these)
- `UnauthorizedPage()` --calls--> `safeAuth()`  [EXTRACTED]
  apps/admin/src/app/unauthorized/page.tsx → apps/admin/src/lib/auth.ts
- `SortableImage()` --calls--> `cn()`  [EXTRACTED]
  apps/admin/src/components/images/DraggableImageGrid.tsx → apps/admin/src/lib/utils.ts
- `TableFooter()` --calls--> `cn()`  [EXTRACTED]
  apps/admin/src/components/ui/table.tsx → apps/admin/src/lib/utils.ts
- `TableCaption()` --calls--> `cn()`  [EXTRACTED]
  apps/admin/src/components/ui/table.tsx → apps/admin/src/lib/utils.ts
- `ProgressBar()` --calls--> `cn()`  [EXTRACTED]
  apps/admin/src/components/upload/FileUpload.tsx → apps/admin/src/lib/utils.ts

## Import Cycles
- 3-file cycle: `apps/admin/src/app/(dashboard)/contacts/[id]/ContactActions.tsx -> apps/admin/src/features/contacts/components/index.ts -> apps/admin/src/features/contacts/components/ContactDetailView.tsx -> apps/admin/src/app/(dashboard)/contacts/[id]/ContactActions.tsx`

## Communities (211 total, 66 thin omitted)

### Community 0 - "PageWrapper.tsx"
Cohesion: 0.03
Nodes (46): AnalyticsPageContent(), metadata, NEUMORPHIC_SHADOWS, ChatLog, ChatLogsPageContent(), ChatMessage, PaginationInfo, metadata (+38 more)

### Community 1 - "cn"
Cohesion: 0.04
Nodes (77): RichTextEditor(), RichTextEditorProps, AppSidebar(), AppSidebarProps, navigation, NeuAvatar(), NeuBadge(), BottomNav() (+69 more)

### Community 2 - "db/schema.ts"
Cohesion: 0.03
Nodes (71): loadAdminRuntime(), GET, handleGet(), LocationStat, POST, ProjectContentRepairUpdate, GET, PATCH (+63 more)

### Community 3 - "SuccessResponse"
Cohesion: 0.06
Nodes (71): DELETE(), GET(), PATCH(), PUT(), RouteContext, GET, handleGet(), GET (+63 more)

### Community 4 - "admin/src/lib/utils.ts"
Cohesion: 0.05
Nodes (61): AboutPageContent(), metadata, EMPTY_PROFILE, FreelanceToolPanel(), normalizeProfile(), parseOptionalNumber(), FormData, initialFormData (+53 more)

### Community 5 - ".error"
Cohesion: 0.09
Nodes (40): getEmailTransporter(), isEmailConfigured(), parseSmtpPort(), parseSmtpSecure(), adminBookingNotificationTemplate(), adminContactNotificationTemplate(), bookingConfirmationTemplate(), bookingConfirmedTemplate() (+32 more)

### Community 6 - "button.tsx"
Cohesion: 0.06
Nodes (38): Booking, BookingDetailClientProps, Booking, BookingDetailPageContentProps, ContactActionsProps, ErrorProps, ErrorProps, ErrorProps (+30 more)

### Community 7 - "card.tsx"
Cohesion: 0.06
Nodes (40): ChatLog, ChatLogDetailPageContent(), ChatLogDetailPageContentProps, ChatMessage, metadata, PageProps, ContactActions(), ChatConversation() (+32 more)

### Community 8 - "features/blogs/index.ts"
Cohesion: 0.07
Nodes (43): BlogsPageContent(), metadata, handleSubmit(), BlogCard(), BlogCardProps, CreateBlogModal(), CreateBlogModalProps, DeleteConfirmModal() (+35 more)

### Community 9 - "validationErrorResponse"
Cohesion: 0.07
Nodes (58): handlePost(), handlePatch(), PUT(), handlePost(), POST(), RATE_LIMIT_CONFIG, POST(), RATE_LIMIT_CONFIG (+50 more)

### Community 10 - "messages/components/index.ts"
Cohesion: 0.07
Nodes (43): MessagesPanel(), MessagesPanelProps, DeleteConfirmModal(), EMPTY_STATE_CONFIG, EmptyState(), EmptyStateProps, FilterTabs(), FilterTabsProps (+35 more)

### Community 11 - "responses/index.ts"
Cohesion: 0.07
Nodes (38): GET, GET(), GET(), handlePost(), POST, RouteContext, GET, handleGet() (+30 more)

### Community 12 - "AboutContent.tsx"
Cohesion: 0.06
Nodes (45): AboutContent(), AboutContentProps, socialIcons, Achievement, cn(), ExperienceTabs(), ExperienceTabsProps, formatExperienceDateValue() (+37 more)

### Community 13 - "admin/projects/route.ts"
Cohesion: 0.07
Nodes (33): GET, handleGet(), handlePut(), PUT, GET, handleGet(), POST, querySchema (+25 more)

### Community 14 - "admin/achievements/route.ts"
Cohesion: 0.07
Nodes (28): handlePost(), POST, GET, handleGet(), handlePost(), POST, GET(), AchievementCreateInput (+20 more)

### Community 15 - "links/index.ts"
Cohesion: 0.10
Nodes (30): LinksPageContent(), metadata, DeleteConfirmModal(), EmptyState(), EmptyStateProps, FilterButtons(), FilterButtonsProps, IconSelector() (+22 more)

### Community 16 - "[]"
Cohesion: 0.08
Nodes (37): buildGuestIdentity(), getColorFromSeed(), getHealthUrl(), getSocketUrl(), hashString(), LivePresencePill(), LivePresencePillProps, PresenceMessage (+29 more)

### Community 17 - "cn"
Cohesion: 0.08
Nodes (34): AchievementCardProps, AchievementModal(), AchievementModalProps, AchievementsDisplay(), AchievementsDisplayProps, ChatHeader(), ChatHeaderProps, ChatInput() (+26 more)

### Community 18 - "public-astro/src/lib/api.ts"
Cohesion: 0.08
Nodes (35): SkillBadges(), SkillBadgesProps, ImageCarousel(), ImageCarouselProps, ProjectDetail(), ProjectDetailProps, ProjectCard(), ProjectCardProps (+27 more)

### Community 19 - "ProjectsPageContent.tsx"
Cohesion: 0.09
Nodes (25): ProjectsPageContent(), metadata, FloatingActionButton(), FloatingActionButtonProps, DeleteConfirmModal(), EmptyState(), EmptyStateProps, ProjectCard() (+17 more)

### Community 20 - "seed.ts"
Cohesion: 0.07
Nodes (43): pdf-parse, AboutInsert, AchievementInsert, AdminRuntime, buildAboutRow(), buildAchievementRows(), buildKnowledgeDocs(), buildProfileLinkRows() (+35 more)

### Community 21 - "DashboardPageContent.tsx"
Cohesion: 0.06
Nodes (23): DashboardPageContent(), DashboardStatsContent(), DashboardStatsGridProps, metadata, AnalyticsSuspense(), AnalyticsSuspenseProps, DataListSuspense(), DataListSuspenseProps (+15 more)

### Community 22 - "chat_service.py"
Cohesion: 0.09
Nodes (32): ChatCitation, ChatPublicMetadata, ChatResponse, BaseModel, SuggestedAction, ChatLogMessage, ChatRequest, _string_or_none() (+24 more)

### Community 23 - "AvailabilityTab.tsx"
Cohesion: 0.12
Nodes (32): Select(), SelectValue(), AddSlotModal(), AddSlotModalProps, ValidationErrors, AvailabilityTab(), BulkAddModal(), BulkAddModalProps (+24 more)

### Community 24 - "BookingCalendar.tsx"
Cohesion: 0.08
Nodes (34): AuthErrorContent(), AuthErrorContentProps, BookingCalendar(), BookingCalendarProps, BookingFormData, BookingStep, formatDateLabel(), formatTimeRange() (+26 more)

### Community 25 - "AnalyticsDashboard.tsx"
Cohesion: 0.11
Nodes (27): AnalyticsDashboard(), AnalyticsDashboardProps, CountryDistribution(), CountryDistributionProps, getFlagEmoji(), InteractionBreakdown(), countryCoordinates, InteractionLocationMap() (+19 more)

### Community 26 - "analytics.service.ts"
Cohesion: 0.09
Nodes (29): GaDashboardSummary, GaOverview, GaPageViewPoint, getClient(), getCredentials(), getDateRange(), getGaDashboardSummary(), getGaOverview() (+21 more)

### Community 27 - "routes/chat.py"
Cohesion: 0.08
Nodes (27): alias, require_service_token(), detail_from_exception(), error_response(), Any, success_response(), chat(), ChatRequest (+19 more)

### Community 28 - "drizzle/schema.ts"
Cohesion: 0.07
Nodes (36): accountsRelations, bookingSlotsRelations, bookingsRelations, guestbookEntriesRelations, projectContextsRelations, projectImagesRelations, projectsRelations, sessionsRelations (+28 more)

### Community 29 - "dependencies"
Cohesion: 0.05
Nodes (37): ai, dependencies, ai, @dnd-kit/core, dotenv, @google-analytics/data, @hookform/resolvers, leaflet (+29 more)

### Community 30 - "lib/auth.ts"
Cohesion: 0.08
Nodes (25): buildSignInUrl(), GET(), normalizeAdminCallbackUrl(), SignInPage(), SignInPageProps, normalizeCallbackUrl(), SignInForm(), SignInFormProps (+17 more)

### Community 31 - "RagRepository"
Cohesion: 0.13
Nodes (17): do_run_migrations(), run_migrations_online(), Base, RagChunk, RagDocument, RagIngestionRun, utcnow(), ChunkWritePayload (+9 more)

### Community 32 - "Guestbook.tsx"
Cohesion: 0.11
Nodes (28): PublicSignInForm(), PublicSignInFormProps, SyncedUser, Guestbook(), GuestbookProps, GuestbookResponse, SYNC_KEYS, getHealthUrl() (+20 more)

### Community 33 - "bookings.types.ts"
Cohesion: 0.11
Nodes (25): BookingDetailClient(), formatDateISO(), getWeekDates(), useAvailability(), useBookings(), useBookingSettings(), UseBookingSettingsResult, Booking (+17 more)

### Community 34 - "KnowledgeTable.tsx"
Cohesion: 0.14
Nodes (22): ChatLog, ChatLogsTableProps, DeleteConfirmModal(), IngestButton(), IngestButtonProps, KnowledgeDoc, KnowledgeTable(), KnowledgeTableProps (+14 more)

### Community 35 - "ingest_service.py"
Cohesion: 0.17
Nodes (19): ingest(), AsyncSession, post, ProjectContent, ProjectContext, SkillItem, IngestRequest, IngestResponse (+11 more)

### Community 36 - "internal/chat-logs/route.ts"
Cohesion: 0.09
Nodes (18): GET(), POST(), GET, handleGet(), GET, handleGet(), handlePost(), POST (+10 more)

### Community 37 - "booking-slots/route.ts"
Cohesion: 0.11
Nodes (19): handlePost(), POST, handlePost(), POST, GET, handleGet(), handlePost(), POST (+11 more)

### Community 38 - "EntryCard.tsx"
Cohesion: 0.11
Nodes (19): DeleteConfirmModal(), EmptyState(), EmptyStateProps, EntryCard(), EntryCardProps, BookOpenIcon(), EyeIcon(), EyeOffIcon() (+11 more)

### Community 39 - "ChatService"
Cohesion: 0.28
Nodes (20): ChatLogMessage, ContentExport, ChatRequest, ChatService, EmbeddingService, GeneratedText, QueryPlan, ToolExecutionResult (+12 more)

### Community 40 - "pages/index.astro"
Cohesion: 0.11
Nodes (21): FeaturedProjects(), FeaturedProjectsProps, buildGeometry(), FloatShape(), FloatShapeProps, init(), SHAPE_SPEED, ShapeKind (+13 more)

### Community 41 - "shared/utils/index.ts"
Cohesion: 0.07
Nodes (14): BOOKING_STATUS_LABELS, COMMON_TIMES, COMMON_TIMEZONES, DAY_NAMES, PAGINATION_DEFAULT, REMINDER_DAYS, SHORT_DAY_NAMES, SLOT_DURATIONS (+6 more)

### Community 42 - "public-astro/src/layouts/BaseLayout.astro"
Cohesion: 0.11
Nodes (18): ChatWidget(), ChatWidgetProps, LiveCursorBand(), LiveCursorBandProps, MobileBottomNav(), MobileBottomNavProps, navItems, ScrollToTopButton() (+10 more)

### Community 43 - "content-export.service.ts"
Cohesion: 0.10
Nodes (22): ContentExportService, FreelanceProfileIntentContext, hasFreelanceProfileContent(), normalizeExperienceItems(), normalizeFreelanceProfile(), normalizeRagSkills(), RagAboutContent, RagContentExport (+14 more)

### Community 44 - "deploy.py"
Cohesion: 0.14
Nodes (21): ask(), ask_bool(), collect_config(), deploy(), DeployConfig, DeployError, ensure_remote_repo(), main() (+13 more)

### Community 45 - "status/route.ts"
Cohesion: 0.11
Nodes (19): GET, handleGet(), handlePut(), PUT, BookingStatusUpdate, PATCH, PUT(), readBookingMetadata() (+11 more)

### Community 46 - "server.ts"
Cohesion: 0.13
Nodes (27): broadcastOverview(), broadcastState(), clampCoordinate(), ClientMessage, configuredAllowedOrigins, ConnectionData, createCorsHeaders(), getRoom() (+19 more)

### Community 47 - "devDependencies"
Cohesion: 0.08
Nodes (26): devDependencies, drizzle-kit, eslint-config-next, geoip-lite, @tailwindcss/postcss, tw-animate-css, @types/geoip-lite, @types/mapbox-gl (+18 more)

### Community 48 - "lib/submission-context.ts"
Cohesion: 0.13
Nodes (21): buildSubmissionProxyHeaders(), FORWARDED_HEADER_NAMES, getBrowserTimezone(), normalizeValue(), ProxyHeadersOptions, POST(), POST(), proxy() (+13 more)

### Community 49 - "storage.ts"
Cohesion: 0.14
Nodes (17): handlePost(), POST, ALLOWED_DOCUMENT_TYPES, ALLOWED_IMAGE_TYPES, AssetValue, extractStorageKeyFromUrl(), getBucketName(), getCredentials() (+9 more)

### Community 50 - "contacts.types.ts"
Cohesion: 0.13
Nodes (19): ContactDetailPageContentProps, ContactDetailModalProps, ContactDetailView(), ContactDetailViewProps, ContactTableProps, SettingsTab(), useContactDetail(), UseContactDetailOptions (+11 more)

### Community 51 - "AdminApiClient"
Cohesion: 0.17
Nodes (12): AboutContent, ChatLogMessageMetadata, ChatLogRecord, ExperienceItem, FreelanceFeaturePrice, FreelanceIntentContext, FreelanceProfile, FreelanceProjectReference (+4 more)

### Community 52 - "devDependencies"
Cohesion: 0.08
Nodes (24): devDependencies, @eslint/compat, eslint-config-prettier, eslint-plugin-svelte, prettier, prettier-plugin-svelte, svelte, svelte-check (+16 more)

### Community 53 - "about.service.ts"
Cohesion: 0.16
Nodes (17): AboutSkill, asString(), normalizeAboutSkills(), normalizeSkillCategory(), AboutMeRecord, getAboutMeRecord(), isMissingFreelanceProfileColumnError(), normalizeAboutRecord() (+9 more)

### Community 54 - "devDependencies"
Cohesion: 0.08
Nodes (25): eslint, eslint, @eslint/js, globals, @commitlint/cli, @commitlint/config-conventional, eslint-plugin-react, lint-staged (+17 more)

### Community 55 - "ContactsService"
Cohesion: 0.14
Nodes (10): ContactDetailPageContent(), ContactDetailPage(), generateMetadata(), PageProps, getContactById(), markContactAsRead(), normalizeContact(), ContactsService (+2 more)

### Community 56 - "useChat.ts"
Cohesion: 0.16
Nodes (17): ChatServiceError, createAbortSignal(), isAbortError(), sendChatMessage(), SendChatMessageOptions, ChatMetadata, ChatRequest, ChatResponse (+9 more)

### Community 57 - "LlmService"
Cohesion: 0.17
Nodes (6): AsyncSession, RagServiceError, LlmService, normalize_intent(), test_normalize_intent_collapses_aliases(), Exception

### Community 58 - "dependencies"
Cohesion: 0.10
Nodes (21): react-markdown, remark-gfm, react-markdown, remark-gfm, dependencies, astro, clsx, framer-motion (+13 more)

### Community 59 - "admin/bookings/route.ts"
Cohesion: 0.15
Nodes (17): GET, handleGet(), GET, handleGet(), handlePost(), POST, bookingsService, BookingQueryInput (+9 more)

### Community 60 - "contacts/[id]/route.ts"
Cohesion: 0.14
Nodes (16): PATCH, DELETE(), GET(), PATCH(), RouteContext, GET, handleGet(), handlePost() (+8 more)

### Community 61 - "components/shared/index.ts"
Cohesion: 0.16
Nodes (12): BlogCard(), BlogCardProps, BlogsContentProps, BlogsGrid(), BlogsGridProps, LatestArticles(), LatestArticlesProps, PageHero() (+4 more)

### Community 62 - "ToolService"
Cohesion: 0.26
Nodes (16): normalize_language(), _as_float(), _as_freelance_profile(), _as_reference_prices(), _as_string(), _as_string_list(), _format_currency(), _normalize_key() (+8 more)

### Community 63 - "dependencies"
Cohesion: 0.10
Nodes (20): react-dom, react-dom, dependencies, astro, @astrojs/node, @astrojs/react, @astrojs/sitemap, clsx (+12 more)

### Community 64 - "admin/messages/route.ts"
Cohesion: 0.11
Nodes (11): AnonymousMessageCreateInput, GET, handleGet(), handlePost(), POST, AnonymousMessagesService, isMissingMetadataColumnError(), CreateAnonymousMessageInput (+3 more)

### Community 65 - "ImageUploader.tsx"
Cohesion: 0.15
Nodes (10): UploadFolder, ImageUploader(), ImageUploaderProps, UploadFolder, ContentTab(), ContentTabProps, ImageTab(), ImageTabProps (+2 more)

### Community 66 - "components.json"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 67 - "useProjectEdit.ts"
Cohesion: 0.16
Nodes (13): ProjectEditPageContent(), PageProps, extractLeadingJsonDocument(), JsonMark, JsonNode, parseJsonSafely(), renderBlock(), renderInline() (+5 more)

### Community 68 - "scripts"
Cohesion: 0.11
Nodes (18): description, engines, node, name, private, scripts, commitlint, dev:all (+10 more)

### Community 69 - "scripts"
Cohesion: 0.11
Nodes (17): name, private, scripts, build, clean, db:generate, db:migrate, db:push (+9 more)

### Community 70 - "tailwindcss"
Cohesion: 0.12
Nodes (18): tailwindcss, typescript, tailwindcss, typescript, devDependencies, tailwindcss, @tailwindcss/vite, typescript (+10 more)

### Community 71 - "public/about/route.ts"
Cohesion: 0.20
Nodes (17): asString(), Experience, GET(), getUrlMetadata(), hasKeyword(), inferPlatform(), normalizeComparableUrl(), normalizeExperience() (+9 more)

### Community 72 - "links-astro/tsconfig.json"
Cohesion: 0.11
Nodes (16): compilerOptions, baseUrl, paths, strictNullChecks, exclude, extends, include, astro/tsconfigs/strict (+8 more)

### Community 73 - "googleCalendarService.ts"
Cohesion: 0.15
Nodes (12): BookingCalendarEventInput, BookingCalendarEventResult, buildCallbackUrl(), createOAuthClient(), decryptRefreshToken(), encryptRefreshToken(), getConfiguredRefreshToken(), getGoogleClientCredentials() (+4 more)

### Community 74 - "compilerOptions"
Cohesion: 0.12
Nodes (17): compilerOptions, allowJs, baseUrl, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules, jsx (+9 more)

### Community 75 - "compilerOptions"
Cohesion: 0.12
Nodes (17): ES2022, compilerOptions, allowJs, baseUrl, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx (+9 more)

### Community 76 - "app/layout.tsx"
Cohesion: 0.18
Nodes (10): dmSans, metadata, plusJakarta, AnalyticsPageView(), GoogleAnalytics(), GoogleAnalyticsProps, isGAReady(), trackPageView() (+2 more)

### Community 77 - "booking-availability.service.ts"
Cohesion: 0.15
Nodes (8): AvailabilityQueryInput, BookingAvailabilityRecord, BookingAvailabilityService, BookingAvailabilityUpdate, BulkUpdateAvailabilityInput, CreateBookingAvailabilityInput, UpdateBookingAvailabilityInput, bookingAvailability

### Community 78 - "scripts"
Cohesion: 0.12
Nodes (15): name, private, scripts, build, build:fastapi, check:fastapi, clean, compare (+7 more)

### Community 79 - "admin/links/route.ts"
Cohesion: 0.15
Nodes (12): handlePost(), POST, GET, handleGet(), handlePost(), POST, CreateProfileLinkInput, createProfileLinkSchema (+4 more)

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

### Community 85 - "TokenizerService"
Cohesion: 0.29
Nodes (3): AsyncSession, TokenChunk, TokenizerService

### Community 86 - "github_webhook_server.py"
Cohesion: 0.29
Nodes (7): BaseHTTPRequestHandler, HTTPStatus, Handler, json_response(), mark_delivery(), spawn_deploy(), verify_signature()

### Community 87 - "BookingsTab.tsx"
Cohesion: 0.24
Nodes (7): ActionButton(), ActionButtonProps, BookingsTab(), BookingsTabProps, DetailField(), DetailFieldProps, FILTER_BUTTONS

### Community 88 - "include"
Cohesion: 0.20
Nodes (9): exclude, include, .next, **/*.ts, **/*.tsx, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts (+1 more)

### Community 89 - "ngl-svelte/src/lib/api.ts"
Cohesion: 0.33
Nodes (8): createAbortSignal(), FORWARDED_HEADER_NAMES, isAbortError(), MessageResult, submitMessage(), submitMessageWithContext(), MessagePayload, MessageResponse

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

### Community 95 - "links-astro/package.json"
Cohesion: 0.22
Nodes (8): name, scripts, astro, build, dev, preview, type, version

### Community 96 - "public-astro/package.json"
Cohesion: 0.22
Nodes (8): name, scripts, astro, build, dev, preview, type, version

### Community 97 - "include"
Cohesion: 0.22
Nodes (8): **/*.js, **/*.jsx, exclude, include, dist, .next, **/*.ts, **/*.tsx

### Community 98 - "bookings/[id]/page.tsx"
Cohesion: 0.39
Nodes (5): BookingDetailPageContent(), BookingDetailPage(), generateMetadata(), PageProps, getBookingById()

### Community 99 - "ragIngest.ts"
Cohesion: 0.36
Nodes (7): dispatchRagIngest(), normalizeBaseUrl(), parseResponsePayload(), RagIngestRequest, RagIngestResult, RagIngestType, toErrorMessage()

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

### Community 105 - "unauthorized/page.tsx"
Cohesion: 0.40
Nodes (4): UnauthorizedPageContent(), UnauthorizedPageContentProps, metadata, UnauthorizedPage()

### Community 106 - "src/types.d.ts"
Cohesion: 0.33
Nodes (5): @auth/core/jwt, JWT, next-auth, Session, User

### Community 107 - "lib/analytics.ts"
Cohesion: 0.53
Nodes (4): buildAnalyticsProxyHeaders(), FORWARDED_HEADER_NAMES, normalizeValue(), POST()

### Community 108 - "reset-db.ts"
Cohesion: 0.50
Nodes (4): EXCLUDED_TABLES, main(), sql, TableRow

### Community 109 - "+server.ts"
Cohesion: 0.60
Nodes (4): buildAnalyticsProxyHeaders(), FORWARDED_HEADER_NAMES, normalizeValue(), POST()

### Community 110 - "lucide-react"
Cohesion: 0.50
Nodes (4): lucide-react, lucide-react, lucide-react, lucide-react

### Community 111 - "tailwind-merge"
Cohesion: 0.50
Nodes (4): tailwind-merge, tailwind-merge, tailwind-merge, tailwind-merge

### Community 113 - "page-utils.ts"
Cohesion: 0.50
Nodes (3): PAGE_ANIMATION, PAGE_CONTAINER_CLASSES, SECTION_GAP

### Community 114 - "lib"
Cohesion: 0.50
Nodes (4): lib, DOM, DOM.Iterable, ES2020

### Community 116 - "lib/LivePresenceBadge.svelte"
Cohesion: 1.00
Nodes (3): clearTimers(), connect(), scheduleReconnect()

## Knowledge Gaps
- **929 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+924 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **66 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `clsx`, `date-fns`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `dom-to-image-more`, `drizzle-orm`, `@google-cloud/storage`, `googleapis`, `html2canvas`, `next`, `next-auth`, `novel`, `postgres`, `@radix-ui/react-avatar`, `@radix-ui/react-checkbox`, `@radix-ui/react-dialog`, `@radix-ui/react-label`, `@radix-ui/react-popover`, `@radix-ui/react-select`, `@radix-ui/react-separator`, `seed.ts`, `@radix-ui/react-slot`, `@radix-ui/react-tooltip`, `react`, `react-day-picker`, `react-dropzone`, `react-map-gl`, `sonner`, `@tiptap/extension-link`, `@tiptap/extension-placeholder`, `@tiptap/starter-kit`, `tsx`, `@types/leaflet`, `use-debounce`, `vaul`, `dependencies`, `dependencies`, `scripts`, `lucide-react`, `tailwind-merge`, `class-variance-authority`?**
  _High betweenness centrality (0.140) - this node is a cross-community bridge._
- **Why does `pdf-parse` connect `seed.ts` to `dependencies`, `card.tsx`?**
  _High betweenness centrality (0.137) - this node is a cross-community bridge._
- **Why does `apiFetch()` connect `public-astro/src/lib/api.ts` to `.error`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _929 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PageWrapper.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.03325143325143325 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.04184704184704185 - nodes in this community are weakly interconnected._
- **Should `db/schema.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.03399122807017544 - nodes in this community are weakly interconnected._