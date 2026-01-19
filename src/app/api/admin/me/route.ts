import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSessionToken } from '@/lib/adminSession';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value;
  const session = verifyAdminSessionToken(token);
  return NextResponse.json({ authenticated: !!session, email: session?.email || null });
}

