import { NextResponse } from 'next/server';
import { getAuthUser } from '@/app/lib/auth';

export async function GET() {
  try {
    const user = await getAuthUser();
    
    if (!user) {
      // Retorna 200 com null ao invés de 401 para evitar erros no console
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error searching for user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}