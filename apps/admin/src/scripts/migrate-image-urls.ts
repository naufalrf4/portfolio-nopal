import { prisma } from '@/lib/db/prisma';

const OLD_R2_DOMAIN = 'pub-bddf3c7a03ef4238a49feac98d3cf217.r2.dev';
const OLD_S3_DOMAIN = 'naufalrf-portfolio.s3.ap-southeast-1.amazonaws.com';

function extractRelativePath(url: string | null): string | null {
  if (!url) return null;

  const urlWithoutProtocol = url.replace(/^https?:\/\//, '');

  if (urlWithoutProtocol.startsWith(OLD_R2_DOMAIN)) {
    return urlWithoutProtocol.replace(`${OLD_R2_DOMAIN}/`, '');
  }

  if (urlWithoutProtocol.startsWith(OLD_S3_DOMAIN)) {
    return urlWithoutProtocol.replace(`${OLD_S3_DOMAIN}/`, '');
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  return url;
}

async function migrateImageUrlsToRelativePaths() {
  console.log('🚀 Starting migration: Convert full URLs to relative paths\n');

  try {
    const projects = await prisma.project.findMany({
      include: {
        images: true,
      },
    });
    let projectsUpdated = 0;

    for (const project of projects) {
      const updates: Record<string, unknown> = {};
      let hasChanges = false;

      if (project.imageUrl) {
        const relativePath = extractRelativePath(project.imageUrl);
        if (relativePath !== project.imageUrl) {
          updates.imageUrl = relativePath;
          hasChanges = true;
          console.log(`  Project "${project.title}": ${project.imageUrl} → ${relativePath}`);
        }
      }

      if (hasChanges) {
        await prisma.project.update({
          where: { id: project.id },
          data: updates,
        });
        projectsUpdated++;
      }

      for (const image of project.images) {
        const relativePath = extractRelativePath(image.url);
        if (relativePath && relativePath !== image.url) {
          await prisma.projectImage.update({
            where: { id: image.id },
            data: { url: relativePath },
          });
          console.log(`  Project Image "${project.title}": ${image.url} → ${relativePath}`);
        }
      }
    }

    const blogLinks = await prisma.blogLink.findMany();
    let blogLinksUpdated = 0;

    for (const blog of blogLinks) {
      if (blog.imageUrl) {
        const relativePath = extractRelativePath(blog.imageUrl);
        if (relativePath !== blog.imageUrl) {
          await prisma.blogLink.update({
            where: { id: blog.id },
            data: { imageUrl: relativePath },
          });
          blogLinksUpdated++;
          console.log(`  Blog "${blog.title}": ${blog.imageUrl} → ${relativePath}`);
        }
      }
    }

    console.log('\n✅ Migration completed successfully!');
    console.log(`   - Projects updated: ${projectsUpdated}`);
    console.log(`   - Blog links updated: ${blogLinksUpdated}`);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  }
}

migrateImageUrlsToRelativePaths();
