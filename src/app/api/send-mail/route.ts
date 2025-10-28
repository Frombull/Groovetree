import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { requireAuth } from '@/app/lib/auth';

const resend = new Resend(process.env.RESEND_KEY);

export async function POST(request: NextRequest) {
  try {
    // Auth
    const user = await requireAuth(request);

    // Send test e-mail
    const { data, error } = await resend.emails.send({
      from: 'Groovetree <onboarding@resend.dev>', // Use o domínio padrão do Resend para testes
      to: [user.email],
      subject: 'Groovetree - Test Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #7c3aed;">Hello World!</h1>
          <p>Test e-mail - Groovetree.</p>
          <p>:)</p>
          <br>
          <p style="color: #666;">Sent at: ${new Date().toLocaleString('pt-BR')}</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully!',
      emailId: data?.id
    });

  } catch (error) {
    console.error('Send mail error:', error);

    // 401
    if (error instanceof Error && error.message === 'Unauthenticated user') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 500
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}