import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import SiteSetting from '@/models/SiteSetting';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const SITE_KEY = 'site';

export async function GET() {
  try {
    await dbConnect();
    const existing = await SiteSetting.findOne({ key: SITE_KEY }).lean();
    if (!existing) {
      await SiteSetting.create({ key: SITE_KEY, logoDataUri: '' });
      return NextResponse.json({ logoDataUri: '' });
    }
    return NextResponse.json({ logoDataUri: existing.logoDataUri || '' });
  } catch (error) {
    console.error('API Error: Failed to fetch site settings:', error);
    return NextResponse.json({ error: 'Failed to fetch site settings from database' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const body = (await request.json()) as { logoDataUri?: unknown };
    const logoDataUri = typeof body?.logoDataUri === 'string' ? body.logoDataUri.trim() : '';

    if (logoDataUri && !logoDataUri.startsWith('data:image/')) {
      return NextResponse.json({ error: 'Invalid logo format' }, { status: 400 });
    }

    const updated = await SiteSetting.findOneAndUpdate(
      { key: SITE_KEY },
      { $set: { logoDataUri } },
      { upsert: true, new: true }
    ).lean();

    return NextResponse.json({ logoDataUri: updated?.logoDataUri || '' });
  } catch (error) {
    console.error('Error in PUT /api/site-settings:', error);
    return NextResponse.json({ error: 'Failed to save logo' }, { status: 500 });
  }
}
