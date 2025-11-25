import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '@/app/lib/prisma';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/oauth/google/callback`
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const mode = searchParams.get('state') || 'signup'; // 'login' or 'signup'

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login?error=no_code`
      );
    }

    // Exchange code for tokens
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Get user info from Google
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login?error=invalid_token`
      );
    }

    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name || null;
    const emailVerified = payload.email_verified || false;

    if (!email) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login?error=no_email`
      );
    }

    // Find or create user
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { provider: 'google', providerId: googleId },
        ],
      },
    });

    if (mode === 'login') {
      // Login mode: user must exist
      if (!user) {
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login?error=user_not_found`
        );
      }

      // Update user if needed (in case they logged in with email before)
      if (user.provider !== 'google' || user.providerId !== googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            provider: 'google',
            providerId: googleId,
            emailVerified: emailVerified || user.emailVerified,
            name: name || user.name,
          },
        });
      }
    } else {
      // Signup mode: create user if doesn't exist
      if (!user) {
        // Check if email is already taken by a non-OAuth user
        const existingEmailUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingEmailUser) {
          return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/signup?error=email_exists`
          );
        }

        // Generate a random password for OAuth users (they won't use it)
        const randomPassword = crypto.randomBytes(32).toString('hex');
        const hashedPassword = await bcrypt.hash(randomPassword, 12);

        user = await prisma.user.create({
          data: {
            email,
            name,
            password: hashedPassword,
            provider: 'google',
            providerId: googleId,
            emailVerified,
          },
        });
      } else {
        // User exists, update if needed
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            provider: 'google',
            providerId: googleId,
            emailVerified: emailVerified || user.emailVerified,
            name: name || user.name,
          },
        });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Redirect with token in cookie
    const redirectUrl = new URL(
      mode === 'login' ? '/dashboard' : '/dashboard',
      process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    );

    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login?error=oauth_error`
    );
  }
}

