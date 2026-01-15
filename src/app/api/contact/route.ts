import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Contact from '@/models/Contact';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
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
    const contact = await Contact.create(body);
    return NextResponse.json(contact, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/contact:', error);
    return NextResponse.json({ error: 'Failed to send message', details: error.message }, { status: 500 });
  }
}
