import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required to delete account' },
        { status: 400 }
      );
    }

    // Verify current password
    const userWithPassword = await prisma.user.findUnique({
      where: { id: user.id },
      select: { password: true }
    });

    if (!userWithPassword) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, userWithPassword.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Delete user and all related data manually in the correct order
    // First, delete all related data from the user's page
    const userPage = await prisma.page.findUnique({
      where: { userId: user.id }
    });

    if (userPage) {
      // Delete all embeds, events, and links related to the page
      await prisma.embed.deleteMany({
        where: { pageId: userPage.id }
      });

      await prisma.event.deleteMany({
        where: { pageId: userPage.id }
      });

      await prisma.link.deleteMany({
        where: { pageId: userPage.id }
      });

      // Delete the page
      await prisma.page.delete({
        where: { id: userPage.id }
      });
    }

    // Finally, delete the user
    await prisma.user.delete({
      where: { id: user.id }
    });

    // Clear auth cookie
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');

    return NextResponse.json({
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}