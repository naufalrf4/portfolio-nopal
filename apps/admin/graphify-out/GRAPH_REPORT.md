# Graph Report - admin  (2026-08-28)

## Corpus Check
- 543 files · ~203,305 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2483 nodes · 6255 edges · 175 communities (113 shown, 62 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 72 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6081ee08`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sidebar.tsx
- successResponse
- PageWrapper.tsx
- publications/index.ts
- admin/projects/route.ts
- messages/components/index.ts
- emailService.ts
- ExperienceModal.tsx
- analytics.service.ts
- public/bookings/route.ts
- card.tsx
- serverErrorResponse
- contacts/components/index.ts
- seed.ts
- AboutPageContent.tsx
- AnalyticsDashboard.tsx
- ragIngest.ts
- KnowledgeTable.tsx
- ProjectEditPageContent.tsx
- links/index.ts
- drizzle/schema.ts
- PageHeader.tsx
- ProjectsPageContent.tsx
- AvailabilityTab.tsx
- EntryCard.tsx
- contacts/route.ts
- bookings.types.ts
- compilerOptions
- admin/knowledge/[id]/route.ts
- db/schema.ts
- shared/utils/index.ts
- BookingsTab.tsx
- admin/messages/route.ts
- Card
- .next
- DashboardPageContent.tsx
- logs/route.ts
- cn
- booking-slots.service.ts
- content-export.service.ts
- storage.ts
- errorResponse
- getSubmissionContext
- bookings.service.ts
- googleCalendarService.ts
- components.json
- admin/links/route.ts
- ContactsPageContent.tsx
- projects.service.ts
- db/index.ts
- public/about/route.ts
- date.ts
- SettingsPageContent.tsx
- app/layout.tsx
- booking-availability.service.ts
- booking-settings.service.ts
- lib/auth.ts
- button.tsx
- validationErrorResponse
- scripts
- public-auth/signin/page.tsx
- badge.tsx
- dependencies
- devDependencies
- admin/achievements/route.ts
- callback/route.ts
- about-read.service.ts
- shared/constants/index.ts
- AGENTS.md
- about.service.ts
- guestbook-token.ts
- start-standalone.mjs
- ChatLogDetailPageContent.tsx
- ExperienceTab.tsx
- gtag.ts
- utils.ts
- ContentExportService
- GuestbookService
- booking-availability.schema.ts
- [imageId]/route.ts
- KnowledgePageContent.tsx
- FileUpload.tsx
- contact-settings.service.ts
- ProfileLinksService
- bookings.ts
- contacts.ts
- proxy.ts
- AiConfigTab.tsx
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
- anonymous-messages.service.ts
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
- about.types.ts
- sheet.tsx
- (dashboard)/layout.tsx
- cursor.ts
- sync/route.ts
- links/loading.tsx
- knowledge/[id]/edit/page.tsx
- NewKnowledgePageContent.tsx
- icons.ts
- ai

## God Nodes (most connected - your core abstractions)
1. `successResponse` - 172 edges
2. `serverErrorResponse()` - 164 edges
3. `cn()` - 145 edges
4. `validationErrorResponse()` - 95 edges
5. `withAdminAuth()` - 77 edges
6. `Button()` - 72 edges
7. `notFoundResponse()` - 55 edges
8. `PageWrapper()` - 44 edges
9. `db` - 43 edges
10. `Card()` - 38 edges

## Surprising Connections (you probably didn't know these)
- `extractTextFromFile()` --references--> `pdf-parse`  [EXTRACTED]
  src/lib/utils/file-extractor.ts → package.json
- `PageHeader()` --references--> `react`  [EXTRACTED]
  src/components/layout/PageHeader.tsx → package.json
- `useSidebar()` --references--> `react`  [EXTRACTED]
  src/components/ui/sidebar.tsx → package.json
- `readPdfText()` --references--> `pdf-parse`  [EXTRACTED]
  scripts/seed.ts → package.json
- `DatePicker()` --references--> `react`  [EXTRACTED]
  src/components/ui/date-picker.tsx → package.json

## Import Cycles
- 3-file cycle: `src/app/(dashboard)/contacts/[id]/ContactActions.tsx -> src/features/contacts/components/index.ts -> src/features/contacts/components/ContactDetailView.tsx -> src/app/(dashboard)/contacts/[id]/ContactActions.tsx`

## Communities (175 total, 62 thin omitted)

### Community 0 - "sidebar.tsx"
Cohesion: 0.09
Nodes (30): AppSidebar(), AppSidebarProps, CountBadge(), navigation, UserAvatar(), Separator(), Sidebar(), SidebarContent() (+22 more)

### Community 1 - "successResponse"
Cohesion: 0.05
Nodes (51): GET(), POST(), GET, handleGet(), GET, handleGet(), handlePost(), POST (+43 more)

### Community 2 - "PageWrapper.tsx"
Cohesion: 0.10
Nodes (11): ErrorProps, ErrorProps, ErrorProps, PageWrapper(), PageWrapperProps, getEmailTransporter(), isEmailConfigured(), parseSmtpPort() (+3 more)

### Community 3 - "publications/index.ts"
Cohesion: 0.12
Nodes (31): metadata, PublicationsPageContent(), handleSubmit(), CreatePublicationModal(), CreatePublicationModalProps, DeleteConfirmModal(), EditPublicationModal(), EditPublicationModalProps (+23 more)

### Community 4 - "admin/projects/route.ts"
Cohesion: 0.10
Nodes (32): GET, handleGet(), handlePut(), PUT, GET, handleGet(), handlePost(), POST (+24 more)

### Community 5 - "messages/components/index.ts"
Cohesion: 0.07
Nodes (38): DeleteConfirmModal(), EMPTY_STATE_CONFIG, EmptyState(), EmptyStateProps, FilterTabs(), FilterTabsProps, GlobalStyles(), LoadingState() (+30 more)

### Community 6 - "emailService.ts"
Cohesion: 0.16
Nodes (34): adminBookingNotificationTemplate(), adminContactNotificationTemplate(), bookingConfirmationTemplate(), bookingConfirmedTemplate(), bookingRejectedTemplate(), contactConfirmationTemplate(), contactReplyTemplate(), escapeHtml() (+26 more)

### Community 7 - "ExperienceModal.tsx"
Cohesion: 0.22
Nodes (16): Label(), Select(), SelectContent(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator() (+8 more)

### Community 8 - "analytics.service.ts"
Cohesion: 0.06
Nodes (40): GaDashboardSummary, GaOverview, GaPageViewPoint, getClient(), getCredentials(), getDateRange(), getGaDashboardSummary(), getGaOverview() (+32 more)

### Community 9 - "public/bookings/route.ts"
Cohesion: 0.10
Nodes (34): POST(), RATE_LIMIT_CONFIG, POST(), POST(), publicBookingSchema, RATE_LIMIT_CONFIG, createContactSchema, POST() (+26 more)

### Community 10 - "card.tsx"
Cohesion: 0.14
Nodes (13): ChatConversationProps, ChatMessage, ErrorStateProps, KnowledgeDoc, KnowledgeDocFormData, knowledgeDocSchema, KnowledgeForm(), KnowledgeFormProps (+5 more)

### Community 11 - "serverErrorResponse"
Cohesion: 0.11
Nodes (41): DELETE(), GET(), PATCH(), PUT(), RouteContext, DELETE(), GET(), PUT() (+33 more)

### Community 12 - "contacts/components/index.ts"
Cohesion: 0.09
Nodes (34): ContactActions(), ContactDetailPageContentProps, CardAction(), CardFooter(), ACTION_LABELS, BulkActionModal(), BulkActionModalProps, ContactDetailModal() (+26 more)

### Community 13 - "seed.ts"
Cohesion: 0.07
Nodes (44): pdf-parse, pdf-parse, AboutInsert, AchievementInsert, AdminRuntime, buildAboutRow(), buildAchievementRows(), buildKnowledgeDocs() (+36 more)

### Community 14 - "AboutPageContent.tsx"
Cohesion: 0.19
Nodes (10): AboutPageContent(), metadata, AchievementsTab(), BioTab(), DraggableRoles(), DraggableRolesProps, SortableRoleItemProps, PersonalInfoTab() (+2 more)

### Community 15 - "AnalyticsDashboard.tsx"
Cohesion: 0.10
Nodes (31): AnalyticsDashboard(), AnalyticsDashboardProps, CountryDistribution(), CountryDistributionProps, getFlagEmoji(), InteractionBreakdown(), countryCoordinates, InteractionLocationMap() (+23 more)

### Community 16 - "ragIngest.ts"
Cohesion: 0.24
Nodes (10): handlePost(), POST, RouteContext, dispatchRagIngest(), normalizeBaseUrl(), parseResponsePayload(), RagIngestRequest, RagIngestResult (+2 more)

### Community 17 - "KnowledgeTable.tsx"
Cohesion: 0.21
Nodes (15): ChatLog, ChatLogsTableProps, DeleteConfirmModal(), IngestButton(), KnowledgeDoc, KnowledgeTable(), KnowledgeTableProps, Table() (+7 more)

### Community 18 - "ProjectEditPageContent.tsx"
Cohesion: 0.12
Nodes (20): ProjectEditPageContent(), ProjectEditPageContentProps, PageProps, ContentTab(), ContentTabProps, ImageTab(), ImageTabProps, extractLeadingJsonDocument() (+12 more)

### Community 19 - "links/index.ts"
Cohesion: 0.11
Nodes (29): LinksPageContent(), metadata, DeleteConfirmModal(), EmptyState(), EmptyStateProps, FilterButtons(), FilterButtonsProps, IconSelector() (+21 more)

### Community 20 - "drizzle/schema.ts"
Cohesion: 0.07
Nodes (36): accountsRelations, bookingSlotsRelations, bookingsRelations, guestbookEntriesRelations, projectContextsRelations, projectImagesRelations, projectsRelations, sessionsRelations (+28 more)

### Community 21 - "PageHeader.tsx"
Cohesion: 0.10
Nodes (8): Booking, BookingDetailPageContentProps, SURFACE_STYLES, SURFACE_STYLES, surfaceStyles, PageHeader(), PageHeaderBackNav, PageHeaderProps

### Community 22 - "ProjectsPageContent.tsx"
Cohesion: 0.09
Nodes (27): ProjectsPageContent(), metadata, FloatingActionButton(), FloatingActionButtonProps, DeleteConfirmModal(), EmptyState(), EmptyStateProps, ProjectCard() (+19 more)

### Community 23 - "AvailabilityTab.tsx"
Cohesion: 0.15
Nodes (28): availableSlotsQuerySchema, calculateEndTime(), GET(), AddSlotModal(), AddSlotModalProps, ValidationErrors, AvailabilityTab(), BulkAddModal() (+20 more)

### Community 24 - "EntryCard.tsx"
Cohesion: 0.08
Nodes (19): DeleteConfirmModal(), EmptyState(), EmptyStateProps, EntryCard(), EntryCardProps, BookOpenIcon(), EyeIcon(), EyeOffIcon() (+11 more)

### Community 25 - "contacts/route.ts"
Cohesion: 0.10
Nodes (19): GET, POST, ContactDetailPageContent(), ContactDetailPage(), generateMetadata(), PageProps, getContactById(), markContactAsRead() (+11 more)

### Community 26 - "bookings.types.ts"
Cohesion: 0.09
Nodes (27): BookingDetailPageContent(), BookingDetailPage(), generateMetadata(), PageProps, SettingsCardProps, useAvailability(), useBookings(), UseBookingSettingsResult (+19 more)

### Community 27 - "compilerOptions"
Cohesion: 0.07
Nodes (29): DOM, DOM.Iterable, ES2020, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+21 more)

### Community 28 - "admin/knowledge/[id]/route.ts"
Cohesion: 0.07
Nodes (25): DELETE, GET, handleDelete(), handleGet(), handlePut(), PUT, RouteContext, GET (+17 more)

### Community 29 - "db/schema.ts"
Cohesion: 0.07
Nodes (28): AchievementCreateInput, AchievementInsert, AchievementUpdateInput, GuestbookEntryUpdate, GuestbookReaction, accountsRelations, bookingSlotsRelations, bookingsRelations (+20 more)

### Community 30 - "shared/utils/index.ts"
Cohesion: 0.12
Nodes (5): formatDateISO(), formatMonthDate(), isToday(), parseMonthDate(), JAKARTA_TIMEZONE

### Community 31 - "BookingsTab.tsx"
Cohesion: 0.14
Nodes (18): ActionButton(), ActionButtonProps, BookingsTab(), BookingsTabProps, DayCardProps, DetailField(), DetailFieldProps, SettingsCard() (+10 more)

### Community 32 - "admin/messages/route.ts"
Cohesion: 0.16
Nodes (11): PATCH(), RouteContext, AnonymousMessageCreateInput, GET, handleGet(), handlePost(), POST, CreateAnonymousMessageInput (+3 more)

### Community 33 - "Card"
Cohesion: 0.10
Nodes (14): EditKnowledgePageContentProps, KnowledgeDoc, AnalyticsSuspense(), AnalyticsSuspenseProps, DataListSuspense(), DataListSuspenseProps, ProjectGridSuspense(), ProjectGridSuspenseProps (+6 more)

### Community 34 - ".next"
Cohesion: 0.18
Nodes (4): .next, AnalyticsPageContent(), metadata, PageProps

### Community 35 - "DashboardPageContent.tsx"
Cohesion: 0.08
Nodes (24): DashboardPageContent(), DashboardStatsContent(), DashboardStatsGridProps, metadata, AnalyticsSummary, AnalyticsSummaryCard(), Tone, TONE_TINT_CLASS (+16 more)

### Community 36 - "logs/route.ts"
Cohesion: 0.08
Nodes (20): GET, POST, DEFAULT_RETENTION_DAYS, LogSettingsService, toCaptureSettings(), appLogs, logSettings, AppLogRecord (+12 more)

### Community 37 - "cn"
Cohesion: 0.14
Nodes (17): UnauthorizedPageContent(), UnauthorizedPageContentProps, SkeletonCard(), SkeletonGrid(), SkeletonLine(), SkeletonLineProps, SkeletonTable(), SkeletonTabs() (+9 more)

### Community 38 - "booking-slots.service.ts"
Cohesion: 0.16
Nodes (13): BookingSlotsService, diffInDaysBetweenKeys(), toDateKey(), BulkCreateSlotsInput, bulkCreateSlotsSchema, CopyFromWeekInput, copyFromWeekSchema, CreateBookingSlotInput (+5 more)

### Community 39 - "content-export.service.ts"
Cohesion: 0.12
Nodes (20): FreelanceProfileIntentContext, hasFreelanceProfileContent(), normalizeFreelanceProfile(), RagAboutContent, RagBlogContent, RagContentExport, RagKnowledgeDocument, RagProjectContent (+12 more)

### Community 40 - "storage.ts"
Cohesion: 0.08
Nodes (21): handlePost(), POST, AchievementsService, normalizeAchievementPhotos(), PublicationLinksService, ALLOWED_DOCUMENT_TYPES, ALLOWED_IMAGE_TYPES, AssetValue (+13 more)

### Community 41 - "errorResponse"
Cohesion: 0.09
Nodes (33): GET, handleGet(), BookingStatusUpdate, PATCH, PUT(), readBookingMetadata(), RouteContext, updateBookingStatusSchema (+25 more)

### Community 42 - "getSubmissionContext"
Cohesion: 0.20
Nodes (18): getCityFromHeaders(), getClientIp(), getCountryCodeFromHeaders(), getLanguage(), getReferrerDomain(), getRegionFromHeaders(), getSubmissionContext(), inferCountryCodeFromTimezone() (+10 more)

### Community 43 - "bookings.service.ts"
Cohesion: 0.16
Nodes (16): GET, handleGet(), GET, handleGet(), handlePost(), POST, bookingsService, BookingQueryInput (+8 more)

### Community 44 - "googleCalendarService.ts"
Cohesion: 0.15
Nodes (15): BookingCalendarEventInput, BookingCalendarEventResult, buildCallbackUrl(), createOAuthClient(), decryptRefreshToken(), encryptRefreshToken(), getConfiguredRefreshToken(), getGoogleClientCredentials() (+7 more)

### Community 45 - "components.json"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 46 - "admin/links/route.ts"
Cohesion: 0.15
Nodes (12): handlePost(), POST, GET, handleGet(), handlePost(), POST, CreateProfileLinkInput, createProfileLinkSchema (+4 more)

### Community 47 - "ContactsPageContent.tsx"
Cohesion: 0.15
Nodes (12): ContactsPageContent(), ContactTab, getContactTab(), TAB_VALUES, metadata, GuestbookPanel(), GuestbookPanelProps, MessagesPanel() (+4 more)

### Community 48 - "projects.service.ts"
Cohesion: 0.14
Nodes (10): ProjectInsert, ProjectsService, ProjectUpdate, projectImages, CreateProjectInput, createProjectSchema, ProjectQueryInput, projectQuerySchema (+2 more)

### Community 49 - "db/index.ts"
Cohesion: 0.07
Nodes (26): POST, ProjectContentRepairUpdate, GET, PATCH, ProjectContentUpdate, RouteContext, PATCH, ProjectImageOrderUpdate (+18 more)

### Community 50 - "public/about/route.ts"
Cohesion: 0.20
Nodes (17): asString(), Experience, GET(), getUrlMetadata(), hasKeyword(), inferPlatform(), normalizeComparableUrl(), normalizeExperience() (+9 more)

### Community 51 - "date.ts"
Cohesion: 0.16
Nodes (19): ChatMessage, MessageBubble(), MessageBubbleProps, ContactInfoSection(), ContactInfoSectionProps, formatDateTime(), formatJakartaKey(), formatJakartaTime() (+11 more)

### Community 52 - "SettingsPageContent.tsx"
Cohesion: 0.17
Nodes (8): SettingsPageContent(), SettingsPageContentProps, surfaceStyles, SignOutButton(), surfaceStyles, Avatar(), AvatarFallback(), AvatarImage()

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
Nodes (11): DashboardLayout(), metadata, UnauthorizedPage(), { auth, signIn, signOut, handlers }, authCallbacks, AuthDbCallbacks, createAuthConfig(), isRecoverableSessionError() (+3 more)

### Community 57 - "button.tsx"
Cohesion: 0.08
Nodes (32): ContactActionsProps, DeleteConfirmModalProps, DeleteConfirmModal(), DeleteConfirmModalProps, DraggableImageGrid(), DraggableImageGridProps, ProjectImage, SortableImage() (+24 more)

### Community 58 - "validationErrorResponse"
Cohesion: 0.12
Nodes (17): handlePost(), POST, handlePost(), POST, handlePost(), POST, GET, handleGet() (+9 more)

### Community 59 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, clean, db:generate, db:migrate, db:push, db:reset, db:seed (+6 more)

### Community 60 - "public-auth/signin/page.tsx"
Cohesion: 0.26
Nodes (10): normalizeAdminCallbackUrl(), SignInPage(), SignInPageProps, normalizeCallbackUrl(), SignInForm(), SignInFormProps, normalizePublicCallbackUrl(), PublicGuestbookSignInPage() (+2 more)

### Community 61 - "badge.tsx"
Cohesion: 0.27
Nodes (9): IngestButtonProps, Badge(), badgeVariants, Checkbox(), Switch(), Tooltip(), TooltipContent(), TooltipProvider() (+1 more)

### Community 62 - "dependencies"
Cohesion: 0.15
Nodes (13): class-variance-authority, dom-to-image-more, @google-analytics/data, @hookform/resolvers, @naufalrf/design-tokens, @naufalrf/http, dependencies, class-variance-authority (+5 more)

### Community 63 - "devDependencies"
Cohesion: 0.15
Nodes (13): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, @types/bun, @types/geoip-lite, @types/nodemailer (+5 more)

### Community 64 - "admin/achievements/route.ts"
Cohesion: 0.12
Nodes (17): handlePost(), POST, GET, handleGet(), handlePost(), POST, GET(), signStringArray() (+9 more)

### Community 65 - "callback/route.ts"
Cohesion: 0.29
Nodes (13): GET(), GET(), withAdminAuthContext(), forbiddenResponse(), unauthorizedResponse(), createGoogleCalendarOAuthState(), encodeBase64Url(), getStateSecret() (+5 more)

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

### Community 72 - "ChatLogDetailPageContent.tsx"
Cohesion: 0.12
Nodes (14): ChatLog, ChatLogsPageContent(), ChatMessage, PaginationInfo, ChatLog, ChatLogDetailPageContent(), ChatLogDetailPageContentProps, ChatMessage (+6 more)

### Community 73 - "ExperienceTab.tsx"
Cohesion: 0.16
Nodes (17): ExperienceCard(), ExperienceCardProps, ExperienceModal(), ExperienceModalProps, ExperienceSubTab, ExperienceTab(), tabConfig, tabToType (+9 more)

### Community 74 - "gtag.ts"
Cohesion: 0.42
Nodes (7): event(), GA_MEASUREMENT_ID, GtagEvent, isProduction(), pageview(), shouldLoadAnalytics(), Window

### Community 75 - "utils.ts"
Cohesion: 0.17
Nodes (13): react, react, buttonVariants, Calendar(), CalendarProps, DatePicker(), DatePickerProps, Popover() (+5 more)

### Community 76 - "ContentExportService"
Cohesion: 0.36
Nodes (3): ContentExportService, normalizeExperienceItems(), normalizeRagSkills()

### Community 78 - "booking-availability.schema.ts"
Cohesion: 0.22
Nodes (8): AvailabilityQueryInput, availabilityQuerySchema, BulkUpdateAvailabilityInput, bulkUpdateAvailabilitySchema, CreateBookingAvailabilityInput, createBookingAvailabilitySchema, UpdateBookingAvailabilityInput, updateBookingAvailabilitySchema

### Community 79 - "[imageId]/route.ts"
Cohesion: 0.25
Nodes (5): DELETE, PATCH, ProjectImageUpdate, ProjectThumbnailUpdate, RouteContext

### Community 80 - "KnowledgePageContent.tsx"
Cohesion: 0.21
Nodes (8): ChatLog, KnowledgeDoc, KnowledgePageContent(), PaginationInfo, metadata, TabsContent, TabsList, TabsTrigger

### Community 81 - "FileUpload.tsx"
Cohesion: 0.19
Nodes (11): FileUpload(), FileUploadProps, formatFileSize(), isDirectUrl(), isSignedStorageUrl(), ProgressBar(), UploadFolder, UploadState (+3 more)

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

### Community 87 - "AiConfigTab.tsx"
Cohesion: 0.24
Nodes (10): AiConfigTab(), emptySlot(), LlmConfigResponse, LlmSlotCard(), LlmSlotCardProps, LlmSlotValue, CHUNK_VECTOR_DIMENSION, DEFAULT_BASE_URL (+2 more)

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

### Community 111 - "anonymous-messages.service.ts"
Cohesion: 0.17
Nodes (5): AnonymousMessageCreateInput, anonymousMessageSelect, AnonymousMessagesService, isMissingMetadataColumnError(), anonymousMessages

### Community 165 - "about.types.ts"
Cohesion: 0.24
Nodes (10): buildUpdatePayload(), stringifyBio(), AboutMeData, AboutSkill, FreelanceFeaturePrice, FreelanceProfile, FreelanceProjectReference, UpdateAboutInput (+2 more)

### Community 166 - "sheet.tsx"
Cohesion: 0.18
Nodes (7): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 167 - "(dashboard)/layout.tsx"
Cohesion: 0.27
Nodes (6): BottomNav(), NavItem, Theme, ThemeToggler(), WibClock(), SidebarInset()

### Community 168 - "cursor.ts"
Cohesion: 0.43
Nodes (5): CursorPosition, cursorPositionSchema, decodeCursor(), encodeCursor(), getCursorPredicate()

### Community 169 - "sync/route.ts"
Cohesion: 0.33
Nodes (5): RATE_LIMIT_CONFIG, syncUserSchema, UserConflictUpdate, UserInsert, users

### Community 171 - "knowledge/[id]/edit/page.tsx"
Cohesion: 0.40
Nodes (3): EditKnowledgePageContent(), metadata, PageProps

## Knowledge Gaps
- **692 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+687 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **62 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `sidebar.tsx`, `PageWrapper.tsx`, `ExperienceModal.tsx`, `card.tsx`, `contacts/components/index.ts`, `AboutPageContent.tsx`, `AnalyticsDashboard.tsx`, `KnowledgeTable.tsx`, `PageHeader.tsx`, `Card`, `sheet.tsx`, `(dashboard)/layout.tsx`, `date.ts`, `SettingsPageContent.tsx`, `button.tsx`, `badge.tsx`, `ChatLogDetailPageContent.tsx`, `utils.ts`, `KnowledgePageContent.tsx`, `FileUpload.tsx`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `@radix-ui/react-select`, `@radix-ui/react-separator`, `@radix-ui/react-slot`, `@radix-ui/react-switch`, `@radix-ui/react-tabs`, `@radix-ui/react-tooltip`, `react-day-picker`, `react-dom`, `react-dropzone`, `react-hook-form`, `react-map-gl`, `sonner`, `tailwind-merge`, `seed.ts`, `use-debounce`, `vaul`, `zod`, `ai`, `utils.ts`, `package.json`, `clsx`, `date-fns`, `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `dotenv`, `drizzle-orm`, `@google-cloud/storage`, `googleapis`, `lucide-react`, `mammoth`, `mapbox-gl`, `@naufalrf/contracts`, `next`, `next-auth`, `nodemailer`, `@paralleldrive/cuid2`, `postgres`, `@radix-ui/react-alert-dialog`, `@radix-ui/react-avatar`, `@radix-ui/react-checkbox`, `@radix-ui/react-dialog`, `@radix-ui/react-label`, `@radix-ui/react-popover`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Why does `react` connect `utils.ts` to `sidebar.tsx`, `PageHeader.tsx`, `dependencies`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _692 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0928030303030303 - nodes in this community are weakly interconnected._
- **Should `successResponse` be split into smaller, more focused modules?**
  _Cohesion score 0.05432595573440644 - nodes in this community are weakly interconnected._
- **Should `PageWrapper.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._