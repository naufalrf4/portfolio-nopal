import { NextRequest } from 'next/server';
import { successResponse, serverErrorResponse } from '@/lib/api/responses';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const range = searchParams.get('range') || '7d';

    // Mock analytics data - In production, this would fetch from Google Analytics API
    const mockStats = {
      totalPageViews: Math.floor(Math.random() * 10000) + 5000,
      totalUsers: Math.floor(Math.random() * 2000) + 1000,
      totalSessions: Math.floor(Math.random() * 3000) + 1500,
      avgSessionDuration: `${Math.floor(Math.random() * 5) + 2}m ${Math.floor(Math.random() * 60)}s`,
      topPages: [
        { page: '/', views: Math.floor(Math.random() * 1000) + 500 },
        { page: '/projects', views: Math.floor(Math.random() * 800) + 400 },
        { page: '/blogs', views: Math.floor(Math.random() * 600) + 300 },
        { page: '/about', views: Math.floor(Math.random() * 500) + 250 },
        { page: '/contact', views: Math.floor(Math.random() * 400) + 200 },
      ],
      apps: {
        public: {
          pageViews: Math.floor(Math.random() * 5000) + 2500,
          users: Math.floor(Math.random() * 1000) + 500,
        },
        ngl: {
          pageViews: Math.floor(Math.random() * 2000) + 1000,
          users: Math.floor(Math.random() * 500) + 250,
        },
        links: {
          pageViews: Math.floor(Math.random() * 3000) + 1500,
          users: Math.floor(Math.random() * 600) + 300,
        },
      },
    };

    return successResponse(mockStats);
  } catch (error) {
    return serverErrorResponse();
  }
}
