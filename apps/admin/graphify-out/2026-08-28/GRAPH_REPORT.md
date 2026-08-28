# Graph Report - admin  (2026-08-28)

## Corpus Check
- 541 files · ~203,104 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2486 nodes · 6295 edges · 165 communities (105 shown, 60 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 106 edges (avg confidence: 0.6)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6081ee08`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- cn
- successResponse
- button.tsx
- publications/index.ts
- db/index.ts
- messages/components/index.ts
- .error
- ExperienceModal.tsx
- analytics.service.ts
- validationErrorResponse
- card.tsx
- withAdminAuth
- contacts/components/index.ts
- seed.ts
- AboutPageContent.tsx
- AnalyticsDashboard.tsx
- responses/index.ts
- KnowledgeTable.tsx
- ProjectEditPageContent.tsx
- links/index.ts
- drizzle/schema.ts
- ExperienceTab.tsx
- projects/components/index.ts
- AvailabilityTab.tsx
- EntryCard.tsx
- ContactsService
- bookings.types.ts
- compilerOptions
- admin/knowledge/[id]/route.ts
- db/schema.ts
- shared/utils/index.ts
- BookingsTab.tsx
- admin/messages/route.ts
- skeleton.tsx
- .next
- DashboardPageContent.tsx
- logs/route.ts
- responsive-modal.tsx
- booking-slots.service.ts
- content-export.service.ts
- storage.ts
- models/route.ts
- getSubmissionContext
- bookings.service.ts
- googleCalendarService.ts
- components.json
- admin/links/route.ts
- ContactsPageContent.tsx
- projects.service.ts
- [id]/content/route.ts
- public/about/route.ts
- date.ts
- formatDate
- app/layout.tsx
- booking-availability.service.ts
- booking-settings.service.ts
- lib/auth.ts
- LinksPageContent.tsx
- logIngest.service.ts
- scripts
- safeAuth
- ContactTable.tsx
- dependencies
- devDependencies
- achievements/reorder/route.ts
- callback/route.ts
- about-read.service.ts
- shared/constants/index.ts
- AGENTS.md
- about.service.ts
- guestbook-token.ts
- start-standalone.mjs
- ChatLogsPageContent.tsx
- ChatLogDetailPageContent.tsx
- gtag.ts
- AchievementsService
- ContentExportService
- GuestbookService
- booking-availability.schema.ts
- [imageId]/route.ts
- images/route.ts
- bookings/[id]/page.tsx
- contact-settings.service.ts
- ProfileLinksService
- bookings.ts
- contacts.ts
- proxy.ts
- unauthorized/page.tsx
- src/types.d.ts
- package.json
- reset-db.ts
- next.config.js
- page-utils.ts
- error/page.tsx
- app/page.tsx
- guestbook.schema.ts
- clsx
- date-fns
- @dnd-kit/core
- @dnd-kit/sortable
- @dnd-kit/utilities
- dotenv
- drizzle-kit
- drizzle-orm
- geoip-lite
- @google-cloud/storage
- googleapis
- @hookform/resolvers
- lucide-react
- mammoth
- mapbox-gl
- @naufalrf/contracts
- next
- next-auth
- next-env.d.ts
- nodemailer
- @paralleldrive/cuid2
- postgres
- @radix-ui/react-alert-dialog
- @radix-ui/react-avatar
- @radix-ui/react-checkbox
- @radix-ui/react-dialog
- @radix-ui/react-label
- @radix-ui/react-popover
- @radix-ui/react-select
- @radix-ui/react-separator
- @radix-ui/react-slot
- @radix-ui/react-switch
- @radix-ui/react-tabs
- @radix-ui/react-tooltip
- react-day-picker
- react-dom
- react-dropzone
- react-hook-form
- react-map-gl
- sonner
- tailwind-merge
- use-debounce
- vaul
- zod
- tailwindcss
- @tailwindcss/postcss
- tw-animate-css
- @types/mapbox-gl
- @types/node
- @types/pg
- @types/react-dom
- typescript
- dom-to-image-more.d.ts
- { GET, POST }

## God Nodes (most connected - your core abstractions)
1. `successResponse` - 172 edges
2. `serverErrorResponse()` - 164 edges
3. `cn()` - 145 edges
4. `validationErrorResponse()` - 95 edges
5. `withAdminAuth()` - 77 edges
6. `Button()` - 72 edges
7. `notFoundResponse()` - 55 edges
8. `Logger` - 45 edges
9. `PageWrapper()` - 44 edges
10. `db` - 42 edges

## Surprising Connections (you probably didn't know these)
- `extractTextFromFile()` --references--> `pdf-parse`  [EXTRACTED]
  src/lib/utils/file-extractor.ts → package.json
- `PageHeader()` --references--> `react`  [EXTRACTED]
  src/components/layout/PageHeader.tsx → package.json
- `readPdfText()` --references--> `pdf-parse`  [EXTRACTED]
  scripts/seed.ts → package.json
- `DatePicker()` --references--> `react`  [EXTRACTED]
  src/components/ui/date-picker.tsx → package.json
- `SidebarMenuSkeleton()` --references--> `react`  [EXTRACTED]
  src/components/ui/sidebar.tsx → package.json

## Import Cycles
- 3-file cycle: `src/app/(dashboard)/contacts/[id]/ContactActions.tsx -> src/features/contacts/components/index.ts -> src/features/contacts/components/ContactDetailView.tsx -> src/app/(dashboard)/contacts/[id]/ContactActions.tsx`

## Communities (165 total, 60 thin omitted)

### Community 0 - "cn"
Cohesion: 0.05
Nodes (68): react, react, ChatMessage, MessageBubble(), MessageBubbleProps, SkeletonCard(), SkeletonGrid(), SkeletonLine() (+60 more)

### Community 1 - "successResponse"
Cohesion: 0.05
Nodes (64): GET(), POST(), DELETE(), GET(), PATCH(), PUT(), RouteContext, GET (+56 more)

### Community 2 - "button.tsx"
Cohesion: 0.07
Nodes (15): Booking, BookingDetailPageContentProps, SURFACE_SHADOWS, ErrorProps, ErrorProps, ErrorProps, SURFACE_SHADOWS, PageWrapper() (+7 more)

### Community 3 - "publications/index.ts"
Cohesion: 0.07
Nodes (36): metadata, PublicationsPageContent(), handleSubmit(), CreatePublicationModal(), CreatePublicationModalProps, DeleteConfirmModal(), DeleteConfirmModalProps, EditPublicationModal() (+28 more)

### Community 4 - "db/index.ts"
Cohesion: 0.06
Nodes (47): GET, handleGet(), handlePut(), PUT, GET, handleGet(), handlePost(), POST (+39 more)

### Community 5 - "messages/components/index.ts"
Cohesion: 0.08
Nodes (40): MessagesPanel(), EMPTY_STATE_CONFIG, EmptyState(), EmptyStateProps, FilterTabs(), FilterTabsProps, GlobalStyles(), LoadingState() (+32 more)

### Community 6 - ".error"
Cohesion: 0.14
Nodes (38): getEmailTransporter(), isEmailConfigured(), parseSmtpPort(), parseSmtpSecure(), adminBookingNotificationTemplate(), adminContactNotificationTemplate(), bookingConfirmationTemplate(), bookingConfirmedTemplate() (+30 more)

### Community 7 - "ExperienceModal.tsx"
Cohesion: 0.08
Nodes (41): FormData, initialFormData, ProjectModalProps, Input(), Label(), ResponsiveModal(), Select(), SelectContent() (+33 more)

### Community 8 - "analytics.service.ts"
Cohesion: 0.06
Nodes (40): GaDashboardSummary, GaOverview, GaPageViewPoint, getClient(), getCredentials(), getDateRange(), getGaDashboardSummary(), getGaOverview() (+32 more)

### Community 9 - "validationErrorResponse"
Cohesion: 0.08
Nodes (49): handlePost(), BookingStatusUpdate, PATCH, PUT(), readBookingMetadata(), RouteContext, updateBookingStatusSchema, handlePatch() (+41 more)

### Community 10 - "card.tsx"
Cohesion: 0.08
Nodes (27): ChatConversationProps, ChatMessage, ErrorStateProps, KnowledgeDoc, KnowledgeDocFormData, knowledgeDocSchema, KnowledgeFormProps, Badge() (+19 more)

### Community 11 - "withAdminAuth"
Cohesion: 0.09
Nodes (38): DELETE(), GET(), PUT(), RouteContext, DELETE(), GET(), PATCH(), RouteContext (+30 more)

### Community 12 - "contacts/components/index.ts"
Cohesion: 0.08
Nodes (35): ContactActions(), ContactActionsProps, ContactDetailPageContentProps, useBookingSettings(), ACTION_LABELS, BulkActionModal(), BulkActionModalProps, ContactDetailModal() (+27 more)

### Community 13 - "seed.ts"
Cohesion: 0.07
Nodes (44): pdf-parse, pdf-parse, AboutInsert, AchievementInsert, AdminRuntime, buildAboutRow(), buildAchievementRows(), buildKnowledgeDocs() (+36 more)

### Community 14 - "AboutPageContent.tsx"
Cohesion: 0.07
Nodes (30): AboutPageContent(), metadata, Achievement, AchievementFormData, AchievementsTab(), BioTab(), DraggableRoles(), DraggableRolesProps (+22 more)

### Community 15 - "AnalyticsDashboard.tsx"
Cohesion: 0.10
Nodes (31): AnalyticsDashboard(), AnalyticsDashboardProps, CountryDistribution(), CountryDistributionProps, getFlagEmoji(), InteractionBreakdown(), countryCoordinates, InteractionLocationMap() (+23 more)

### Community 16 - "responses/index.ts"
Cohesion: 0.08
Nodes (30): DELETE, GET, handleDelete(), handleGet(), RouteContext, POST, RouteContext, GET (+22 more)

### Community 17 - "KnowledgeTable.tsx"
Cohesion: 0.09
Nodes (28): EditKnowledgePageContent(), EditKnowledgePageContentProps, KnowledgeDoc, metadata, PageProps, ChatConversation(), ChatLog, ChatLogsTableProps (+20 more)

### Community 18 - "ProjectEditPageContent.tsx"
Cohesion: 0.09
Nodes (25): ProjectEditPageContent(), ProjectEditPageContentProps, PageProps, ProjectModal(), UploadFolder, ImageUploader(), ImageUploaderProps, UploadFolder (+17 more)

### Community 19 - "links/index.ts"
Cohesion: 0.11
Nodes (27): DeleteConfirmModal(), EmptyState(), EmptyStateProps, FilterButtons(), FilterButtonsProps, IconSelector(), LinkCard(), LinkCardProps (+19 more)

### Community 20 - "drizzle/schema.ts"
Cohesion: 0.07
Nodes (36): accountsRelations, bookingSlotsRelations, bookingsRelations, guestbookEntriesRelations, projectContextsRelations, projectImagesRelations, projectsRelations, sessionsRelations (+28 more)

### Community 21 - "ExperienceTab.tsx"
Cohesion: 0.08
Nodes (15): SURFACE_STYLES, ChatLog, KnowledgeDoc, PaginationInfo, SURFACE_STYLES, surfaceStyles, PageHeader(), PageHeaderBackNav (+7 more)

### Community 22 - "projects/components/index.ts"
Cohesion: 0.11
Nodes (21): ProjectsPageContent(), ProjectCard(), filterButtons, ProjectFilters(), ProjectFiltersProps, ProjectGrid(), ProjectGridProps, ProjectTable() (+13 more)

### Community 23 - "AvailabilityTab.tsx"
Cohesion: 0.15
Nodes (28): availableSlotsQuerySchema, calculateEndTime(), GET(), AddSlotModal(), AvailabilityTab(), BulkAddModal(), BulkAddModalProps, DayCard() (+20 more)

### Community 24 - "EntryCard.tsx"
Cohesion: 0.11
Nodes (20): DeleteConfirmModal(), DeleteConfirmModalProps, EmptyState(), EmptyStateProps, EntryCard(), EntryCardProps, BookOpenIcon(), EyeIcon() (+12 more)

### Community 25 - "ContactsService"
Cohesion: 0.11
Nodes (17): ContactDetailPageContent(), ContactDetailPage(), generateMetadata(), PageProps, getContactById(), markContactAsRead(), normalizeContact(), ContactsService (+9 more)

### Community 26 - "bookings.types.ts"
Cohesion: 0.11
Nodes (22): SettingsCardProps, useAvailability(), useBookings(), UseBookingSettingsResult, Booking, BookingAvailability, BookingSettings, BookingsPagination (+14 more)

### Community 27 - "compilerOptions"
Cohesion: 0.07
Nodes (29): DOM, DOM.Iterable, ES2020, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+21 more)

### Community 28 - "admin/knowledge/[id]/route.ts"
Cohesion: 0.10
Nodes (18): DELETE, GET, handleDelete(), handleGet(), handlePut(), PUT, RouteContext, GET (+10 more)

### Community 29 - "db/schema.ts"
Cohesion: 0.09
Nodes (27): GET, accountsRelations, bookingSlotsRelations, bookingsRelations, guestbookEntriesRelations, projectImagesRelations, projectsRelations, sessionsRelations (+19 more)

### Community 30 - "shared/utils/index.ts"
Cohesion: 0.10
Nodes (13): ExperienceModal(), filterExperienceByType(), formatMonthDate(), getOrganizationLabel(), getTitleLabel(), parseMonthDate(), formatDateISO(), formatMonthDate() (+5 more)

### Community 31 - "BookingsTab.tsx"
Cohesion: 0.13
Nodes (20): ActionButton(), ActionButtonProps, AddSlotModalProps, BookingsTab(), BookingsTabProps, DayCardProps, DetailField(), DetailFieldProps (+12 more)

### Community 32 - "admin/messages/route.ts"
Cohesion: 0.10
Nodes (15): PATCH(), RouteContext, AnonymousMessageCreateInput, GET, handleGet(), handlePost(), POST, AnonymousMessageCreateInput (+7 more)

### Community 33 - "skeleton.tsx"
Cohesion: 0.12
Nodes (10): AnalyticsSuspense(), AnalyticsSuspenseProps, DataListSuspense(), DataListSuspenseProps, ProjectGridSuspense(), ProjectGridSuspenseProps, StatCardsSuspenseProps, SuspenseWrapper() (+2 more)

### Community 34 - ".next"
Cohesion: 0.09
Nodes (9): .next, AnalyticsPageContent(), metadata, KnowledgePageContent(), NewKnowledgePageContent(), metadata, metadata, PageProps (+1 more)

### Community 35 - "DashboardPageContent.tsx"
Cohesion: 0.12
Nodes (13): DashboardPageContent(), DashboardStatsContent(), DashboardStatsGridProps, metadata, StatCardsSuspense(), AnalyticsSummaryCard(), EmptyState(), StatCard() (+5 more)

### Community 36 - "logs/route.ts"
Cohesion: 0.14
Nodes (14): GET, POST, DEFAULT_RETENTION_DAYS, LogSettingsService, toCaptureSettings(), logSettings, logLevelSchema, logServiceSchema (+6 more)

### Community 37 - "responsive-modal.tsx"
Cohesion: 0.13
Nodes (15): DeleteConfirmModal(), DeleteConfirmModalProps, DraggableImageGrid(), DraggableImageGridProps, ProjectImage, SortableImage(), Dialog(), DialogBody() (+7 more)

### Community 38 - "booking-slots.service.ts"
Cohesion: 0.16
Nodes (13): BookingSlotsService, diffInDaysBetweenKeys(), toDateKey(), BulkCreateSlotsInput, bulkCreateSlotsSchema, CopyFromWeekInput, copyFromWeekSchema, CreateBookingSlotInput (+5 more)

### Community 39 - "content-export.service.ts"
Cohesion: 0.11
Nodes (21): FreelanceProfileIntentContext, hasFreelanceProfileContent(), normalizeFreelanceProfile(), RagAboutContent, RagBlogContent, RagContentExport, RagKnowledgeDocument, RagProjectContent (+13 more)

### Community 40 - "storage.ts"
Cohesion: 0.16
Nodes (15): ALLOWED_DOCUMENT_TYPES, ALLOWED_IMAGE_TYPES, AssetValue, extractStorageKeyFromUrl(), getBucketName(), getCredentials(), getRequiredEnv(), getStorageClient() (+7 more)

### Community 41 - "models/route.ts"
Cohesion: 0.17
Nodes (19): extractGeminiDimension(), extractOpenAiDimension(), handlePost(), POST, probeSchema, extractGeminiModels(), extractOpenAiModels(), GeminiModel (+11 more)

### Community 42 - "getSubmissionContext"
Cohesion: 0.20
Nodes (18): getCityFromHeaders(), getClientIp(), getCountryCodeFromHeaders(), getLanguage(), getReferrerDomain(), getRegionFromHeaders(), getSubmissionContext(), inferCountryCodeFromTimezone() (+10 more)

### Community 43 - "bookings.service.ts"
Cohesion: 0.16
Nodes (16): GET, handleGet(), GET, handleGet(), handlePost(), POST, bookingsService, BookingQueryInput (+8 more)

### Community 44 - "googleCalendarService.ts"
Cohesion: 0.13
Nodes (16): BookingCalendarEventInput, BookingCalendarEventResult, buildCallbackUrl(), createOAuthClient(), decryptRefreshToken(), encryptRefreshToken(), getConfiguredRefreshToken(), getGoogleClientCredentials() (+8 more)

### Community 45 - "components.json"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 46 - "admin/links/route.ts"
Cohesion: 0.12
Nodes (15): handlePost(), POST, GET, handleGet(), handlePost(), POST, ProfileLinkCreateInput, ProfileLinkInsert (+7 more)

### Community 47 - "ContactsPageContent.tsx"
Cohesion: 0.13
Nodes (11): ContactsPageContent(), ContactTab, getContactTab(), TAB_VALUES, metadata, GuestbookPanel(), GuestbookPanelProps, MessagesPanelProps (+3 more)

### Community 48 - "projects.service.ts"
Cohesion: 0.14
Nodes (10): ProjectInsert, ProjectsService, ProjectUpdate, projectImages, CreateProjectInput, createProjectSchema, ProjectQueryInput, projectQuerySchema (+2 more)

### Community 49 - "[id]/content/route.ts"
Cohesion: 0.11
Nodes (11): POST, ProjectContentRepairUpdate, GET, PATCH, ProjectContentUpdate, RouteContext, PATCH, ProjectImageOrderUpdate (+3 more)

### Community 50 - "public/about/route.ts"
Cohesion: 0.20
Nodes (17): asString(), Experience, GET(), getUrlMetadata(), hasKeyword(), inferPlatform(), normalizeComparableUrl(), normalizeExperience() (+9 more)

### Community 51 - "date.ts"
Cohesion: 0.18
Nodes (12): WelcomeCard(), formatJakartaKey(), formatRelativeTime(), getJakartaHour(), getValidDate(), isFuture(), isToday(), isYesterday() (+4 more)

### Community 52 - "formatDate"
Cohesion: 0.17
Nodes (9): SettingsPageContent(), SettingsPageContentProps, surfaceStyles, SignOutButton(), surfaceStyles, Avatar(), AvatarFallback(), AvatarImage() (+1 more)

### Community 53 - "app/layout.tsx"
Cohesion: 0.18
Nodes (10): dmSans, metadata, plusJakarta, AnalyticsPageView(), GoogleAnalytics(), GoogleAnalyticsProps, isGAReady(), trackPageView() (+2 more)

### Community 54 - "booking-availability.service.ts"
Cohesion: 0.15
Nodes (8): AvailabilityQueryInput, BookingAvailabilityRecord, BookingAvailabilityService, BookingAvailabilityUpdate, BulkUpdateAvailabilityInput, CreateBookingAvailabilityInput, UpdateBookingAvailabilityInput, bookingAvailability

### Community 55 - "booking-settings.service.ts"
Cohesion: 0.20
Nodes (9): BookingSettingsRecord, BookingSettingsService, BookingSettingsUpdate, DEFAULT_SETTINGS, normalizeNullableText(), sanitizeBookingSettings(), bookingSettings, UpdateBookingSettingsInput (+1 more)

### Community 56 - "lib/auth.ts"
Cohesion: 0.16
Nodes (9): DashboardLayout(), { auth, signIn, signOut, handlers }, authCallbacks, AuthDbCallbacks, createAuthConfig(), isRecoverableSessionError(), getAllowedEmails(), isEmailAllowed() (+1 more)

### Community 57 - "LinksPageContent.tsx"
Cohesion: 0.16
Nodes (8): LinksPageContent(), metadata, FloatingActionButton(), FloatingActionButtonProps, DeleteConfirmModal(), DeleteConfirmModalProps, EmptyState(), EmptyStateProps

### Community 58 - "logIngest.service.ts"
Cohesion: 0.18
Nodes (6): appLogs, AppLogRecord, LogDatabase, LogIngestService, LogSettingsSource, AppLogRecord

### Community 59 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, clean, db:generate, db:migrate, db:push, db:reset, db:seed (+6 more)

### Community 60 - "safeAuth"
Cohesion: 0.24
Nodes (11): normalizeAdminCallbackUrl(), SignInPage(), SignInPageProps, normalizeCallbackUrl(), SignInForm(), SignInFormProps, normalizePublicCallbackUrl(), PublicGuestbookSignInPage() (+3 more)

### Community 61 - "ContactTable.tsx"
Cohesion: 0.35
Nodes (7): IngestButtonProps, Checkbox(), Switch(), Tooltip(), TooltipContent(), TooltipProvider(), TooltipTrigger()

### Community 62 - "dependencies"
Cohesion: 0.15
Nodes (13): ai, class-variance-authority, dom-to-image-more, @google-analytics/data, @naufalrf/design-tokens, @naufalrf/http, dependencies, ai (+5 more)

### Community 63 - "devDependencies"
Cohesion: 0.15
Nodes (13): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, @types/bun, @types/geoip-lite, @types/nodemailer (+5 more)

### Community 64 - "achievements/reorder/route.ts"
Cohesion: 0.17
Nodes (11): handlePost(), POST, AchievementQueryInput, achievementQuerySchema, assetValueSchema, CreateAchievementInput, createAchievementSchema, ReorderAchievementsInput (+3 more)

### Community 65 - "callback/route.ts"
Cohesion: 0.32
Nodes (10): GET(), GET(), createGoogleCalendarOAuthState(), encodeBase64Url(), getStateSecret(), GoogleCalendarOAuthStatePayload, normalizeGoogleCalendarReturnTo(), sign() (+2 more)

### Community 66 - "about-read.service.ts"
Cohesion: 0.26
Nodes (11): AboutSkill, asString(), normalizeAboutSkills(), normalizeSkillCategory(), AboutMeRecord, getAboutMeRecord(), isMissingFreelanceProfileColumnError(), normalizeAboutRecord() (+3 more)

### Community 67 - "shared/constants/index.ts"
Cohesion: 0.17
Nodes (10): BOOKING_STATUS_LABELS, COMMON_TIMES, COMMON_TIMEZONES, DAY_NAMES, PAGINATION_DEFAULT, REMINDER_DAYS, SHORT_DAY_NAMES, SLOT_DURATIONS (+2 more)

### Community 68 - "AGENTS.md"
Cohesion: 0.18
Nodes (9): 1. Project Context, 2. Technology Baseline, 3. Architecture and Structure Rules, 4. Operational Command Set, 5. Git Workflow Rules, 6. Agent Behavior, 7. Authority Order, 8. Self-Learn and Learned Rules (+1 more)

### Community 69 - "about.service.ts"
Cohesion: 0.33
Nodes (6): AboutInsert, AboutService, normalizeExperienceItems(), normalizeFreelanceProfile(), sanitizeAssetValue(), UpdateAboutInput

### Community 70 - "guestbook-token.ts"
Cohesion: 0.36
Nodes (8): buildSignInUrl(), GET(), createGuestbookToken(), encodeBase64Url(), getGuestbookSigningSecret(), GuestbookTokenPayload, sign(), verifyGuestbookToken()

### Community 71 - "start-standalone.mjs"
Cohesion: 0.22
Nodes (8): publicSourceDir, publicTargetDir, rootDir, serverEntry, standaloneDir, standaloneNextDir, staticSourceDir, staticTargetDir

### Community 72 - "ChatLogsPageContent.tsx"
Cohesion: 0.25
Nodes (6): ChatLog, ChatLogsPageContent(), ChatMessage, PaginationInfo, metadata, ChatLogsTable()

### Community 73 - "ChatLogDetailPageContent.tsx"
Cohesion: 0.25
Nodes (6): ChatLog, ChatLogDetailPageContent(), ChatLogDetailPageContentProps, ChatMessage, metadata, PageProps

### Community 74 - "gtag.ts"
Cohesion: 0.42
Nodes (7): event(), GA_MEASUREMENT_ID, GtagEvent, isProduction(), pageview(), shouldLoadAnalytics(), Window

### Community 76 - "ContentExportService"
Cohesion: 0.36
Nodes (3): ContentExportService, normalizeExperienceItems(), normalizeRagSkills()

### Community 78 - "booking-availability.schema.ts"
Cohesion: 0.22
Nodes (8): AvailabilityQueryInput, availabilityQuerySchema, BulkUpdateAvailabilityInput, bulkUpdateAvailabilitySchema, CreateBookingAvailabilityInput, createBookingAvailabilitySchema, UpdateBookingAvailabilityInput, updateBookingAvailabilitySchema

### Community 79 - "[imageId]/route.ts"
Cohesion: 0.25
Nodes (5): DELETE, PATCH, ProjectImageUpdate, ProjectThumbnailUpdate, RouteContext

### Community 80 - "images/route.ts"
Cohesion: 0.25
Nodes (5): GET, POST, ProjectImageInsert, ProjectUpdate, RouteContext

### Community 81 - "bookings/[id]/page.tsx"
Cohesion: 0.39
Nodes (5): BookingDetailPageContent(), BookingDetailPage(), generateMetadata(), PageProps, getBookingById()

### Community 82 - "contact-settings.service.ts"
Cohesion: 0.36
Nodes (4): ContactSettingsService, contactSettings, UpdateContactSettingsInput, updateContactSettingsSchema

### Community 84 - "bookings.ts"
Cohesion: 0.29
Nodes (6): BookingInput, bookingSchema, StatusUpdateInput, statusUpdateSchema, UpdateBookingInput, updateBookingSchema

### Community 85 - "contacts.ts"
Cohesion: 0.29
Nodes (6): BulkActionInput, bulkActionSchema, ContactFormInput, contactFormSchema, UpdateContactInput, updateContactSchema

### Community 86 - "proxy.ts"
Cohesion: 0.33
Nodes (6): applyPublicApiCors(), config, configuredPublicApiAllowedOrigins, defaultPublicApiAllowedOrigins, protectedRoutes, proxy()

### Community 87 - "unauthorized/page.tsx"
Cohesion: 0.40
Nodes (4): UnauthorizedPageContent(), UnauthorizedPageContentProps, metadata, UnauthorizedPage()

### Community 88 - "src/types.d.ts"
Cohesion: 0.33
Nodes (5): @auth/core/jwt, JWT, next-auth, Session, User

### Community 89 - "package.json"
Cohesion: 0.40
Nodes (4): name, private, type, version

### Community 90 - "reset-db.ts"
Cohesion: 0.50
Nodes (4): EXCLUDED_TABLES, main(), sql, TableRow

### Community 91 - "next.config.js"
Cohesion: 0.50
Nodes (3): __dirname, nextConfig, WORKSPACE_ROOT

### Community 92 - "page-utils.ts"
Cohesion: 0.50
Nodes (3): PAGE_ANIMATION, PAGE_CONTAINER_CLASSES, SECTION_GAP

## Knowledge Gaps
- **691 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+686 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **60 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `skeleton.tsx`, `button.tsx`, `responsive-modal.tsx`, `ExperienceModal.tsx`, `ChatLogsPageContent.tsx`, `card.tsx`, `contacts/components/index.ts`, `AboutPageContent.tsx`, `AnalyticsDashboard.tsx`, `KnowledgeTable.tsx`, `ProjectEditPageContent.tsx`, `formatDate`, `ExperienceTab.tsx`, `unauthorized/page.tsx`, `ContactTable.tsx`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `@radix-ui/react-select`, `@radix-ui/react-separator`, `@radix-ui/react-slot`, `@radix-ui/react-switch`, `@radix-ui/react-tabs`, `@radix-ui/react-tooltip`, `cn`, `react-day-picker`, `react-dom`, `react-dropzone`, `react-hook-form`, `react-map-gl`, `sonner`, `seed.ts`, `tailwind-merge`, `use-debounce`, `vaul`, `zod`, `package.json`, `clsx`, `date-fns`, `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `dotenv`, `drizzle-orm`, `@google-cloud/storage`, `googleapis`, `@hookform/resolvers`, `lucide-react`, `mammoth`, `mapbox-gl`, `@naufalrf/contracts`, `next`, `next-auth`, `nodemailer`, `@paralleldrive/cuid2`, `postgres`, `@radix-ui/react-alert-dialog`, `@radix-ui/react-avatar`, `@radix-ui/react-checkbox`, `@radix-ui/react-dialog`, `@radix-ui/react-label`, `@radix-ui/react-popover`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Why does `react` connect `cn` to `ExperienceTab.tsx`, `dependencies`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _691 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.05292702485966319 - nodes in this community are weakly interconnected._
- **Should `successResponse` be split into smaller, more focused modules?**
  _Cohesion score 0.048179271708683476 - nodes in this community are weakly interconnected._
- **Should `button.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06944444444444445 - nodes in this community are weakly interconnected._