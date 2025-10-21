import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    
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
            },
            embeds: {
              orderBy: { order: 'asc' }
            },
            photos: {
              orderBy: { order: 'asc' }
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
      embeds: userData.page?.embeds || [],
      photos: userData.page?.photos || [],
      statistics: {
        totalLinks: userData.page?.links.length || 0,
        activeLinks: userData.page?.links.filter(link => link.isActive).length || 0,
        totalEvents: userData.page?.events.length || 0,
        activeEvents: userData.page?.events.filter(event => event.isActive).length || 0,
        totalEmbeds: userData.page?.embeds.length || 0,
        activeEmbeds: userData.page?.embeds.filter(embed => embed.isActive).length || 0,
        totalPhotos: userData.page?.photos.length || 0,
        activePhotos: userData.page?.photos.filter(photo => photo.isActive).length || 0,
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