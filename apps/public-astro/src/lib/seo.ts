import type { AboutData, Blog, Project } from '../types';
import { getSiteUrl } from './site';

/**
 * Canonical `@id` fragments. Schema graphs only resolve into a single entity
 * when every page references the *same* identifier, so these are centralized
 * here rather than re-spelled per page.
 */
export const PERSON_ID = '#person';
export const WEBSITE_ID = '#website';

export function personId(siteUrl = getSiteUrl()): string {
  return `${siteUrl}/${PERSON_ID}`;
}

type JsonLd = Record<string, unknown>;

/**
 * Drops empty values so a page never emits `"image": null` or `"sameAs": []`.
 * Schema consumers treat a present-but-empty property as an assertion that the
 * value is genuinely absent, which is worse than omitting it.
 */
function compact(input: JsonLd): JsonLd {
  const output: JsonLd = {};
  for (const [key, value] of Object.entries(input)) {
    if (value === null || value === undefined) continue;
    if (typeof value === 'string' && value.trim() === '') continue;
    if (Array.isArray(value) && value.length === 0) continue;
    output[key] = value;
  }
  return output;
}

function absoluteUrl(path: string | null | undefined, siteUrl: string): string | undefined {
  if (!path) return undefined;
  try {
    return new URL(path, siteUrl).href;
  } catch {
    return undefined;
  }
}

function isoDate(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

export interface BreadcrumbCrumb {
  name: string;
  path: string;
}

/**
 * BreadcrumbList is one of the few structured-data types Google still renders
 * as a Search feature, so every page below the root should emit one.
 */
export function buildBreadcrumbSchema(crumbs: readonly BreadcrumbCrumb[], siteUrl = getSiteUrl()): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path, siteUrl),
    })),
  };
}

/**
 * `ProfilePage` is Google's documented type for a page about a single person,
 * and it is the strongest available signal tying this site to the Person
 * entity. `mainEntity` points at the same `@id` the global Person schema
 * declares so the two merge instead of competing.
 */
export function buildProfilePageSchema(
  about: AboutData,
  options: { canonicalPath: string; description: string },
  siteUrl = getSiteUrl()
): JsonLd {
  const jobTitle = about.roles?.find((role) => role.trim().length > 0) ?? undefined;
  const skillNames = (about.skills ?? [])
    .map((skill) => skill.name)
    .filter((name): name is string => Boolean(name && name.trim()));

  const worksFor = (about.experience ?? [])
    .filter((item) => item.endDate === null && Boolean(item.organization?.trim()))
    .map((item) =>
      compact({
        '@type': 'Organization',
        name: item.organization,
      })
    );

  const person = compact({
    '@type': 'Person',
    '@id': personId(siteUrl),
    name: about.fullName,
    description: about.shortBio || about.tagline || options.description,
    jobTitle,
    email: about.email ? `mailto:${about.email}` : undefined,
    image: absoluteUrl(about.avatarUrl, siteUrl),
    url: absoluteUrl(options.canonicalPath, siteUrl),
    knowsAbout: skillNames,
    sameAs: (about.socialLinks ?? []).map((link) => link.url).filter(Boolean),
    worksFor: worksFor.length > 0 ? worksFor : undefined,
    homeLocation: about.location
      ? compact({ '@type': 'Place', name: about.location })
      : undefined,
  });

  return compact({
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': absoluteUrl(options.canonicalPath, siteUrl),
    url: absoluteUrl(options.canonicalPath, siteUrl),
    name: `${about.fullName} - About`,
    description: options.description,
    dateModified: isoDate(about.updatedAt),
    isPartOf: { '@id': `${siteUrl}/${WEBSITE_ID}` },
    mainEntity: person,
  });
}

/**
 * A portfolio index is a `CollectionPage` whose `mainEntity` is an ordered
 * `ItemList`. This is semantic organization rather than a rich-result play:
 * it tells a crawler the page is a curated set and names each member, which is
 * what lets an answer engine enumerate the work without guessing from markup.
 */
export function buildProjectCollectionSchema(
  projects: readonly Project[],
  options: { canonicalPath: string; name: string; description: string },
  siteUrl = getSiteUrl()
): JsonLd {
  const pageUrl = absoluteUrl(options.canonicalPath, siteUrl);

  return compact({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': pageUrl,
    url: pageUrl,
    name: options.name,
    description: options.description,
    isPartOf: { '@id': `${siteUrl}/${WEBSITE_ID}` },
    about: { '@id': personId(siteUrl) },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: projects.length,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      itemListElement: projects.map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: compact({
          '@type': 'CreativeWork',
          '@id': `${siteUrl}/projects/${project.slug}`,
          url: `${siteUrl}/projects/${project.slug}`,
          name: project.title,
          description: project.summary,
          image: absoluteUrl(project.imageUrl, siteUrl),
          genre: project.category,
          keywords: project.techStack?.length ? project.techStack.join(', ') : undefined,
          dateModified: isoDate(project.updatedAt),
          author: { '@id': personId(siteUrl) },
        }),
      })),
    },
  });
}

/**
 * The publications list deliberately mixes self-authored writing with
 * third-party coverage *about* the work, so authorship cannot be asserted for
 * every entry. Only these sources are first-party; anything else gets a
 * `publisher` but no `author`, because claiming authorship of someone else's
 * article would be a false statement in the markup.
 */
const FIRST_PARTY_SOURCES = new Set(['blog', 'personal', 'self', 'naufalrf', 'portfolio']);

function isFirstPartySource(source: string | null | undefined): boolean {
  if (!source) return false;
  return FIRST_PARTY_SOURCES.has(source.trim().toLowerCase());
}

/**
 * Publications are a mix of self-authored posts and third-party coverage, and
 * the two must not be conflated: `author` is only claimed when the item is not
 * externally sourced. Every entry links out, so each is modelled as an
 * `Article` at its real off-site `url`.
 */
export function buildPublicationCollectionSchema(
  blogs: readonly Blog[],
  options: { canonicalPath: string; name: string; description: string },
  siteUrl = getSiteUrl()
): JsonLd {
  const pageUrl = absoluteUrl(options.canonicalPath, siteUrl);

  return compact({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': pageUrl,
    url: pageUrl,
    name: options.name,
    description: options.description,
    isPartOf: { '@id': `${siteUrl}/${WEBSITE_ID}` },
    about: { '@id': personId(siteUrl) },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: blogs.length,
      itemListElement: blogs.map((blog, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: compact({
          '@type': 'Article',
          '@id': blog.url,
          url: blog.url,
          headline: blog.title,
          description: blog.description,
          image: blog.imageUrl,
          datePublished: isoDate(blog.publishedAt),
          articleSection: blog.category,
          publisher: blog.source ? compact({ '@type': 'Organization', name: blog.source }) : undefined,
          author: isFirstPartySource(blog.source) ? { '@id': personId(siteUrl) } : undefined,
        }),
      })),
    },
  });
}

export interface ServiceOffering {
  name: string;
  description: string;
}

/**
 * `Service` + `hasOfferCatalog` describes what is actually on offer without
 * inventing prices or ratings. No `Offer.price` is emitted because none is
 * published on the page, and fabricating one to chase a rich result would be
 * both wrong and a policy violation.
 */
export function buildServiceSchema(
  offerings: readonly ServiceOffering[],
  options: { canonicalPath: string; name: string; description: string; areaServed?: string },
  siteUrl = getSiteUrl()
): JsonLd {
  const pageUrl = absoluteUrl(options.canonicalPath, siteUrl);

  return compact({
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': pageUrl,
    url: pageUrl,
    name: options.name,
    description: options.description,
    serviceType: options.name,
    provider: { '@id': personId(siteUrl) },
    areaServed: options.areaServed
      ? compact({ '@type': 'Place', name: options.areaServed })
      : undefined,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: options.name,
      itemListElement: offerings.map((offering) => ({
        '@type': 'Offer',
        itemOffered: compact({
          '@type': 'Service',
          name: offering.name,
          description: offering.description,
        }),
      })),
    },
  });
}
