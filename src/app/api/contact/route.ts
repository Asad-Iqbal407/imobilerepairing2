import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Contact from '@/models/Contact';
import { requireAdmin } from '@/lib/adminGuard';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const guard = requireAdmin(request);
    if (guard) return guard;
    await dbConnect();
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    return NextResponse.json(contacts);
  } catch (error: any) {
    console.error('Error in GET /api/contact:', error);
    return NextResponse.json({ error: 'Failed to fetch messages', details: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const phone = typeof body?.phone === 'string' ? body.phone.trim() : '';
    const device = typeof body?.device === 'string' ? body.device.trim() : '';
    const message = typeof body?.message === 'string' ? body.message.trim() : '';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || name.length > 100) {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    }
    if (!email || email.length > 200 || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    if (phone.length > 50) {
      return NextResponse.json({ error: 'Invalid phone' }, { status: 400 });
    }
    if (device.length > 120) {
      return NextResponse.json({ error: 'Invalid device' }, { status: 400 });
    }
    if (!message || message.length > 2000) {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    const contact = await Contact.create({ name, email, phone, device, message });
    return NextResponse.json(contact, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/contact:', error);
    return NextResponse.json({ error: 'Failed to send message', details: error.message }, { status: 500 });
  }
}
