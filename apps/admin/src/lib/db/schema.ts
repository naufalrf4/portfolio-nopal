import { createId } from '@paralleldrive/cuid2';
import { sql } from 'drizzle-orm';
import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('UserRole', ['ADMIN', 'USER']);

export const projectContextTypeEnum = pgEnum('ProjectContextType', [
  'CONTEXT',
  'ROLE',
  'DECISIONS',
  'TRADEOFFS',
  'RESULT',
  'ARCHITECTURE',
  'OPERATIONS',
  'METRICS',
]);

export const bookingStatusEnum = pgEnum('BookingStatus', [
  'PENDING',
  'CONFIRMED',
  'CANCELLED',
  'COMPLETED',
]);

export const slotStatusEnum = pgEnum('SlotStatus', ['AVAILABLE', 'BOOKED', 'BLOCKED']);

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  email: text('email').notNull().unique(),
  name: text('name'),
  image: text('image'),
  role: userRoleEnum('role').default('USER').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt')
    .notNull()
    .$onUpdate(() => new Date()),
});

export const accounts = pgTable(
  'accounts',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (table) => [
    unique('accounts_provider_providerAccountId_key').on(table.provider, table.providerAccountId),
  ]
);

export const sessions = pgTable('sessions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  sessionToken: text('sessionToken').notNull().unique(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires').notNull(),
});

export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull().unique(),
    expires: timestamp('expires').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.identifier, table.token] }),
    unique('verification_tokens_identifier_token_key').on(table.identifier, table.token),
  ]
);

export const projects = pgTable(
  'projects',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    summary: text('summary').notNull(),
    description: text('description').notNull(),
    category: text('category').notNull(),
    techStack: text('techStack')
      .array()
      .notNull()
      .default(sql`'{}'`),
    tags: text('tags')
      .array()
      .notNull()
      .default(sql`'{}'`),
    liveUrl: text('liveUrl'),
    repoUrl: text('repoUrl'),
    imageUrl: text('imageUrl'),
    featured: boolean('featured').default(false).notNull(),
    visible: boolean('visible').default(true).notNull(),
    order: integer('order').default(0).notNull(),
    startDate: timestamp('startDate'),
    endDate: timestamp('endDate'),
    projectDate: text('projectDate'),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt')
      .notNull()
      .$onUpdate(() => new Date()),
    content: text('content'),
    thumbnailId: text('thumbnailId'),
  },
  (table) => [
    index('projects_slug_idx').on(table.slug),
    index('projects_category_idx').on(table.category),
    index('projects_featured_idx').on(table.featured),
    index('projects_visible_idx').on(table.visible),
    index('projects_order_idx').on(table.order),
  ]
);

export const projectContexts = pgTable(
  'project_contexts',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    projectId: text('projectId')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    type: projectContextTypeEnum('type').notNull(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    order: integer('order').default(0).notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt')
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('project_contexts_projectId_idx').on(table.projectId),
    index('project_contexts_type_idx').on(table.type),
    index('project_contexts_order_idx').on(table.order),
  ]
);

export const projectImages = pgTable(
  'project_images',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    projectId: text('projectId')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    key: text('key').notNull(),
    order: integer('order').default(0).notNull(),
    caption: text('caption'),
    alt: text('alt'),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
  },
  (table) => [
    index('project_images_projectId_idx').on(table.projectId),
    index('project_images_order_idx').on(table.order),
  ]
);

export const blogLinks = pgTable('BlogLink', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  url: text('url').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  imageUrl: text('imageUrl'),
  source: text('source').notNull(),
  category: text('category'),
  tags: text('tags')
    .array()
    .notNull()
    .default(sql`'{}'`),
  publishedAt: timestamp('publishedAt').notNull(),
  visible: boolean('visible').default(true).notNull(),
  order: integer('order').default(0).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt')
    .notNull()
    .$onUpdate(() => new Date()),
});

export const guestbookEntries = pgTable(
  'guestbook_entries',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    message: text('message').notNull(),
    reactions: jsonb('reactions').default('[]').notNull(),
    visible: boolean('visible').default(true).notNull(),
    ipAddress: text('ipAddress'),
    countryCode: text('countryCode'),
    country: text('country'),
    city: text('city'),
    region: text('region'),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt')
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('guestbook_entries_userId_idx').on(table.userId),
    index('guestbook_entries_visible_idx').on(table.visible),
    index('guestbook_entries_createdAt_idx').on(table.createdAt),
    index('guestbook_entries_countryCode_idx').on(table.countryCode),
  ]
);

export const analyticsEvents = pgTable(
  'analytics_events',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    page: varchar('page', { length: 100 }).notNull(),
    entityType: varchar('entityType', { length: 50 }).notNull(),
    entityId: text('entityId'),
    eventType: varchar('eventType', { length: 20 }).notNull(),
    data: jsonb('data'),
    userSession: text('userSession'),
    ipAddress: varchar('ipAddress', { length: 45 }),
    countryCode: varchar('countryCode', { length: 2 }),
    city: varchar('city', { length: 100 }),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
  },
  (table) => [
    index('analytics_events_page_idx').on(table.page),
    index('analytics_events_eventType_idx').on(table.eventType),
    index('analytics_events_entityType_entityId_idx').on(table.entityType, table.entityId),
    index('analytics_events_createdAt_idx').on(table.createdAt),
  ]
);

export const anonymousMessages = pgTable(
  'anonymous_messages',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    content: text('content').notNull(),
    ipHash: text('ipHash').notNull(),
    read: boolean('read').default(false).notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt')
      .notNull()
      .$onUpdate(() => new Date()),
    city: text('city'),
    country: text('country'),
    countryCode: text('countryCode'),
    ipAddress: text('ipAddress'),
    region: text('region'),
  },
  (table) => [
    index('anonymous_messages_read_idx').on(table.read),
    index('anonymous_messages_createdAt_idx').on(table.createdAt),
    index('anonymous_messages_countryCode_idx').on(table.countryCode),
    index('anonymous_messages_city_idx').on(table.city),
  ]
);

export const chatLogs = pgTable(
  'chat_logs',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    sessionId: text('sessionId').notNull().unique(),
    messages: jsonb('messages').default('[]').notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt')
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('chat_logs_sessionId_idx').on(table.sessionId),
    index('chat_logs_createdAt_idx').on(table.createdAt),
  ]
);

export const profileLinks = pgTable(
  'profile_links',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    label: text('label').notNull(),
    url: text('url').notNull(),
    icon: text('icon'),
    visible: boolean('visible').default(true).notNull(),
    order: integer('order').default(0).notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt')
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('profile_links_visible_idx').on(table.visible),
    index('profile_links_order_idx').on(table.order),
  ]
);

// TODO: Add vector column for embeddings (Plan Task 4 — pgvector)
export const knowledgeDocs = pgTable(
  'knowledge_docs',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    filename: text('filename').notNull().unique(),
    content: text('content').notNull(),
    indexed: boolean('indexed').default(false).notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt')
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('knowledge_docs_filename_idx').on(table.filename),
    index('knowledge_docs_indexed_idx').on(table.indexed),
  ]
);

export const contactForms = pgTable(
  'contact_forms',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text('name').notNull(),
    email: text('email').notNull(),
    subject: text('subject'),
    message: text('message').notNull(),
    ipHash: text('ipHash').notNull(),
    ipAddress: text('ipAddress'),
    countryCode: text('countryCode'),
    country: text('country'),
    city: text('city'),
    region: text('region'),
    read: boolean('read').default(false).notNull(),
    replied: boolean('replied').default(false).notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt')
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('contact_forms_read_idx').on(table.read),
    index('contact_forms_createdAt_idx').on(table.createdAt),
    index('contact_forms_countryCode_idx').on(table.countryCode),
  ]
);

export const contactSettings = pgTable('contact_settings', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  notificationEmail: text('notificationEmail'),
  blockedKeywords: text('blockedKeywords')
    .array()
    .notNull()
    .default(sql`'{}'`),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt')
    .notNull()
    .$onUpdate(() => new Date()),
});

export const bookingSlots = pgTable(
  'booking_slots',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    date: date('date').notNull(),
    time: text('time').notNull(),
    duration: integer('duration').default(60).notNull(),
    status: slotStatusEnum('status').default('AVAILABLE').notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt')
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    unique('booking_slots_date_time_key').on(table.date, table.time),
    index('booking_slots_date_status_idx').on(table.date, table.status),
  ]
);

export const bookings = pgTable(
  'bookings',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text('name').notNull(),
    email: text('email').notNull(),
    phone: text('phone'),
    notes: text('notes'),
    status: bookingStatusEnum('status').default('PENDING').notNull(),
    slotId: text('slotId')
      .unique()
      .references(() => bookingSlots.id),
    ipHash: text('ipHash').notNull(),
    ipAddress: text('ipAddress'),
    countryCode: text('countryCode'),
    country: text('country'),
    city: text('city'),
    region: text('region'),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt')
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('bookings_status_idx').on(table.status),
    index('bookings_createdAt_idx').on(table.createdAt),
    index('bookings_countryCode_idx').on(table.countryCode),
  ]
);

export const bookingSettings = pgTable('booking_settings', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  notificationEmail: text('notificationEmail'),
  reminderEnabled: boolean('reminderEnabled').default(true).notNull(),
  reminderDay: integer('reminderDay').default(6).notNull(),
  reminderTime: text('reminderTime').default('09:00').notNull(),
  timezone: text('timezone').default('Asia/Jakarta').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt')
    .notNull()
    .$onUpdate(() => new Date()),
});

export const bookingAvailability = pgTable(
  'booking_availability',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    dayOfWeek: integer('dayOfWeek').notNull(),
    startTime: text('startTime').notNull(),
    endTime: text('endTime').notNull(),
    enabled: boolean('enabled').default(true).notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt')
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    unique('booking_availability_dayOfWeek_startTime_endTime_key').on(
      table.dayOfWeek,
      table.startTime,
      table.endTime
    ),
    index('booking_availability_dayOfWeek_idx').on(table.dayOfWeek),
    index('booking_availability_enabled_idx').on(table.enabled),
  ]
);

export const aboutMe = pgTable('AboutMe', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  fullName: text('fullName').notNull(),
  tagline: text('tagline').notNull(),
  roles: text('roles')
    .array()
    .notNull()
    .default(sql`'{}'`),
  bio: text('bio').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  location: text('location'),
  avatarUrl: text('avatarUrl'),
  resumeUrl: text('resumeUrl'),
  availabilityStatus: text('availabilityStatus'),
  skills: text('skills')
    .array()
    .notNull()
    .default(sql`'{}'`),
  experience: jsonb('experience'),
  socialLinks: jsonb('socialLinks'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt')
    .notNull()
    .$onUpdate(() => new Date()),
});

export const achievements = pgTable(
  'achievements',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text('name').notNull(),
    location: text('location').notNull(),
    monthYear: text('monthYear').notNull(),
    photos: text('photos')
      .array()
      .notNull()
      .default(sql`'{}'`),
    description: text('description').notNull(),
    externalUrl: text('externalUrl'),
    order: integer('order').default(0).notNull(),
    visible: boolean('visible').default(true).notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt')
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('achievements_order_idx').on(table.order),
    index('achievements_visible_idx').on(table.visible),
  ]
);
