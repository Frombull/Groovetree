import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { requireAuth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_KEY);

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json({ error: 'Email already verified' }, { status: 400 });
    }

    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Save token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: token,
        emailVerificationExpiry: expiry,
      },
    });

    // Create verification URL
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

    // Send verification email
    const { data, error } = await resend.emails.send({
      from: 'Groovetree <noreply@groovetr.ee>',
      to: [user.email],
      subject: 'Verify your email - Groovetree',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #7c3aed; margin-bottom: 20px;">Verify Your Email</h1>
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            Hi ${user.name || 'there'}!
          </p>
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            Please verify your email address by clicking the button below:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: linear-gradient(to right, #7c3aed, #ec4899); 
                      color: white; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      display: inline-block;
                      font-weight: bold;">
              Verify Email
            </a>
          </div>
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Or copy and paste this link in your browser:
          </p>
          <p style="font-size: 14px; color: #7c3aed; word-break: break-all;">
            ${verificationUrl}
          </p>
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            This link will expire in 24 hours.
          </p>
          <p style="font-size: 14px; color: #666; margin-top: 20px;">
            If you didn't request this email, you can safely ignore it.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Verification email sent successfully!',
    });

  } catch (error) {
    console.error('Send verification error:', error);

    if (error instanceof Error && error.message === 'Unauthenticated user') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
