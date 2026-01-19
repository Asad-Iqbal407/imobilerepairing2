import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSessionToken } from '@/lib/adminSession';

export const getAdminSession = (request: NextRequest) => {
  const token = request.cookies.get('admin_session')?.value;
  return verifyAdminSessionToken(token);
};

export const requireAdmin = (request: NextRequest) => {
  const session = getAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
};

