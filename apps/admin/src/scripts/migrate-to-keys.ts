import { prisma } from '@/lib/db/prisma';

const URL_PATTERNS = [
  /^https:\/\/naufalrf-portfolio\.s3\.ap-southeast-1\.amazonaws\.com\/(.+)$/,
  /^https:\/\/naufalrf-portfolio\.s3\.amazonaws\.com\/(.+)$/,
  /^https:\/\/pub-[^/]+\.r2\.dev\/(.+)$/,
  /^https:\/\/[^/]+\.r2\.dev\/(.+)$/,
];

function extractKeyFromUrl(url: string | null): string | null {
  if (!url) return null;

  for (const pattern of URL_PATTERNS) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return url;
}

async function migrateProjects(dryRun: boolean) {
  console.log('\n[Projects] Starting migration...');

  const projects = await prisma.project.findMany({
    select: { id: true, imageUrl: true },
  });

  let updated = 0;
  const changes: Array<{ id: string; old: string | null; new: string | null }> = [];

  for (const project of projects) {
    if (!project.imageUrl) continue;

    const newKey = extractKeyFromUrl(project.imageUrl);

    if (newKey !== project.imageUrl) {
      changes.push({ id: project.id, old: project.imageUrl, new: newKey });

      if (!dryRun) {
        await prisma.project.update({
          where: { id: project.id },
          data: { imageUrl: newKey },
        });
      }

      updated++;
    }
  }

  if (changes.length > 0) {
    console.log(`  Found ${changes.length} projects to update:`);
    changes.slice(0, 5).forEach((change) => {
      console.log(`    ${change.id}: ${change.old} → ${change.new}`);
    });
    if (changes.length > 5) {
      console.log(`    ... and ${changes.length - 5} more`);
    }
  }

  console.log(`[Projects] ${dryRun ? 'Would update' : 'Updated'} ${updated} records`);
}

async function migrateProjectImages(dryRun: boolean) {
  console.log('\n[ProjectImages] Starting migration...');

  const images = await prisma.projectImage.findMany({
    select: { id: true, url: true, key: true },
  });

  let updated = 0;
  const changes: Array<{ id: string; old: string; new: string }> = [];

  for (const image of images) {
    const newKey = extractKeyFromUrl(image.url);

    if (newKey && newKey !== image.url) {
      changes.push({ id: image.id, old: image.url, new: newKey });

      if (!dryRun) {
        await prisma.projectImage.update({
          where: { id: image.id },
          data: {
            url: newKey,
            key: newKey,
          },
        });
      }

      updated++;
    }
  }

  if (changes.length > 0) {
    console.log(`  Found ${changes.length} project images to update:`);
    changes.slice(0, 5).forEach((change) => {
      console.log(`    ${change.id}: ${change.old} → ${change.new}`);
    });
    if (changes.length > 5) {
      console.log(`    ... and ${changes.length - 5} more`);
    }
  }

  console.log(`[ProjectImages] ${dryRun ? 'Would update' : 'Updated'} ${updated} records`);
}

async function migrateBlogLinks(dryRun: boolean) {
  console.log('\n[BlogLinks] Starting migration...');

  const blogs = await prisma.blogLink.findMany({
    select: { id: true, imageUrl: true },
  });

  let updated = 0;
  const changes: Array<{ id: string; old: string | null; new: string | null }> = [];

  for (const blog of blogs) {
    if (!blog.imageUrl) continue;

    const newKey = extractKeyFromUrl(blog.imageUrl);

    if (newKey !== blog.imageUrl) {
      changes.push({ id: blog.id, old: blog.imageUrl, new: newKey });

      if (!dryRun) {
        await prisma.blogLink.update({
          where: { id: blog.id },
          data: { imageUrl: newKey },
        });
      }

      updated++;
    }
  }

  if (changes.length > 0) {
    console.log(`  Found ${changes.length} blog links to update:`);
    changes.slice(0, 5).forEach((change) => {
      console.log(`    ${change.id}: ${change.old} → ${change.new}`);
    });
    if (changes.length > 5) {
      console.log(`    ... and ${changes.length - 5} more`);
    }
  }

  console.log(`[BlogLinks] ${dryRun ? 'Would update' : 'Updated'} ${updated} records`);
}

async function migrateAboutMe(dryRun: boolean) {
  console.log('\n[AboutMe] Starting migration...');

  const aboutMe = await prisma.aboutMe.findFirst({
    select: { id: true, avatarUrl: true, resumeUrl: true },
  });

  if (!aboutMe) {
    console.log('[AboutMe] No record found');
    return;
  }

  let updated = false;
  const updates: { avatarUrl?: string | null; resumeUrl?: string | null } = {};

  if (aboutMe.avatarUrl) {
    const newKey = extractKeyFromUrl(aboutMe.avatarUrl);
    if (newKey !== aboutMe.avatarUrl) {
      updates.avatarUrl = newKey;
      console.log(`  avatarUrl: ${aboutMe.avatarUrl} → ${newKey}`);
      updated = true;
    }
  }

  if (aboutMe.resumeUrl) {
    const newKey = extractKeyFromUrl(aboutMe.resumeUrl);
    if (newKey !== aboutMe.resumeUrl) {
      updates.resumeUrl = newKey;
      console.log(`  resumeUrl: ${aboutMe.resumeUrl} → ${newKey}`);
      updated = true;
    }
  }

  if (updated && !dryRun) {
    await prisma.aboutMe.update({
      where: { id: aboutMe.id },
      data: updates,
    });
  }

  console.log(`[AboutMe] ${updated ? (dryRun ? 'Would update' : 'Updated') : 'No changes needed'}`);
}

async function migrateAchievements(dryRun: boolean) {
  console.log('\n[Achievements] Starting migration...');

  const achievements = await prisma.achievement.findMany({
    select: { id: true, photos: true },
  });

  let updated = 0;
  const changes: Array<{ id: string; oldCount: number; newCount: number }> = [];

  for (const achievement of achievements) {
    const newPhotos = achievement.photos.map((photo: string) => extractKeyFromUrl(photo) || photo);
    const hasChanges = newPhotos.some(
      (newPhoto: string, idx: number) => newPhoto !== achievement.photos[idx]
    );

    if (hasChanges) {
      changes.push({
        id: achievement.id,
        oldCount: achievement.photos.length,
        newCount: newPhotos.length,
      });

      if (!dryRun) {
        await prisma.achievement.update({
          where: { id: achievement.id },
          data: { photos: newPhotos },
        });
      }

      updated++;
    }
  }

  if (changes.length > 0) {
    console.log(`  Found ${changes.length} achievements with photo URLs to update`);
  }

  console.log(`[Achievements] ${dryRun ? 'Would update' : 'Updated'} ${updated} records`);
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = !args.includes('--execute');

  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  S3 URL to Key Migration Script                           ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  if (dryRun) {
    console.log('\n⚠️  DRY RUN MODE - No changes will be made');
    console.log('   Run with --execute flag to apply changes\n');
  } else {
    console.log('\n⚠️  EXECUTE MODE - Changes will be applied to database');
    console.log('   Make sure you have backed up your database!\n');

    console.log('Starting in 5 seconds... Press Ctrl+C to cancel');
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  try {
    await migrateProjects(dryRun);
    await migrateProjectImages(dryRun);
    await migrateBlogLinks(dryRun);
    await migrateAboutMe(dryRun);
    await migrateAchievements(dryRun);

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║  Migration Complete                                        ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    if (dryRun) {
      console.log('To apply these changes, run:');
      console.log('  pnpm --filter admin tsx src/scripts/migrate-to-keys.ts --execute\n');
    }
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
