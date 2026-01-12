import { prisma } from '@/lib/db/prisma';
import { withAdminAuth } from '@/lib/api/middleware/auth';
import { NextResponse } from 'next/server';

export const GET = withAdminAuth(async () => {
  try {
    const [
      totalProjects,
      visibleProjects,
      totalBlogLinks,
      visibleBlogLinks,
      totalGuestbookEntries,
      visibleGuestbookEntries,
      totalMessages,
      unreadMessages,
      totalProfileLinks,
      visibleProfileLinks,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { visible: true } }),
      prisma.blogLink.count(),
      prisma.blogLink.count({ where: { visible: true } }),
      prisma.guestbookEntry.count(),
      prisma.guestbookEntry.count({ where: { visible: true } }),
      prisma.anonymousMessage.count(),
      prisma.anonymousMessage.count({ where: { read: false } }),
      prisma.profileLink.count(),
      prisma.profileLink.count({ where: { visible: true } }),
    ]);

    const stats = {
      projects: {
        total: totalProjects,
        visible: visibleProjects,
        hidden: totalProjects - visibleProjects,
      },
      blogLinks: {
        total: totalBlogLinks,
        visible: visibleBlogLinks,
        hidden: totalBlogLinks - visibleBlogLinks,
      },
      guestbook: {
        total: totalGuestbookEntries,
        visible: visibleGuestbookEntries,
        hidden: totalGuestbookEntries - visibleGuestbookEntries,
      },
      messages: {
        total: totalMessages,
        unread: unreadMessages,
        read: totalMessages - unreadMessages,
      },
      profileLinks: {
        total: totalProfileLinks,
        visible: visibleProfileLinks,
        hidden: totalProfileLinks - visibleProfileLinks,
      },
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
});
