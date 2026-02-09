import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import { verifyAdminSessionToken } from '@/lib/adminSession';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Basic security check
    const cookieHeader = request.headers.get('cookie') || '';
    const adminSession = cookieHeader.split('; ').find(row => row.startsWith('admin_session='))?.split('=')[1];
    const isAdmin = !!verifyAdminSessionToken(adminSession);

    const start = Date.now();
    await dbConnect();
    const end = Date.now();
    
    const dbStatus = mongoose.connection.readyState;
    const statusMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    const response: any = {
      status: 'success',
      connectionTime: `${end - start}ms`,
      readyState: dbStatus,
      stateName: statusMap[dbStatus as keyof typeof statusMap] || 'unknown',
    };

    if (isAdmin) {
      response.databaseName = mongoose.connection.db?.databaseName;
      response.host = mongoose.connection.host;
    }

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    }, { status: 500 });
  }
}
