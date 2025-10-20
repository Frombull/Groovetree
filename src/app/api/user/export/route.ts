import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const user = await requireAuth();
    
    // Search user data
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        page: {
          include: {
            links: {
              orderBy: { order: 'asc' }
            },
            events: {
              orderBy: { date: 'asc' }
            }
          }
        }
      }
    });

    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Remove sensitive infos
    const { password, ...userDataWithoutPassword } = userData;

    // Structure data to export
    const exportData = {
      exportInfo: {
        exportDate: new Date().toISOString(),
        platform: 'Groovetree'
      },
      profile: {
        email: userDataWithoutPassword.email,
        name: userDataWithoutPassword.name,
        createdAt: userDataWithoutPassword.createdAt,
        updatedAt: userDataWithoutPassword.updatedAt
      },
      page: userData.page ? {
        id: userData.page.id,
        slug: userData.page.slug,
        title: userData.page.title,
        bio: userData.page.bio,
        avatarUrl: userData.page.avatarUrl,
        backgroundColor: userData.page.backgroundColor,
        textColor: userData.page.textColor,
        backgroundImageUrl: userData.page.backgroundImageUrl,
        createdAt: userData.page.createdAt,
        updatedAt: userData.page.updatedAt
      } : null,
      links: userData.page?.links || [],
      events: userData.page?.events || [],
      statistics: {
        totalLinks: userData.page?.links.length || 0,
        activeLinks: userData.page?.links.filter(link => link.isActive).length || 0,
        totalEvents: userData.page?.events.length || 0,
        activeEvents: userData.page?.events.filter(event => event.isActive).length || 0,
      }
    };

    return NextResponse.json(exportData);
  } catch (error) {
    console.error('Error exporting user data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}