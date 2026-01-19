import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Quote from '@/models/Quote';
import { requireAdmin } from '@/lib/adminGuard';

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = requireAdmin(request);
    if (guard) return guard;
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const quote = await Quote.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }
    return NextResponse.json(quote);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = requireAdmin(request);
    if (guard) return guard;
    await dbConnect();
    const { id } = await params;
    const deleted = await Quote.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Quote deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete quote' }, { status: 500 });
  }
}
