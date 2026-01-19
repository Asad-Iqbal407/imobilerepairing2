import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { sendOrderEmails } from '@/lib/email';
import { requireAdmin } from '@/lib/adminGuard';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = requireAdmin(request);
    if (guard) return guard;
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const oldOrder = await Order.findById(id);
    const order = await Order.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // If status changed to 'paid', send emails
    if (body.status === 'paid' && oldOrder?.status !== 'paid') {
      await sendOrderEmails(order as any);
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = requireAdmin(request);
    if (guard) return guard;
    await dbConnect();
    const { id } = await params;
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = requireAdmin(request);
    if (guard) return guard;
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const oldOrder = await Order.findById(id);
    const order = await Order.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    if (body.status === 'paid' && oldOrder?.status !== 'paid') {
      await sendOrderEmails(order as any);
    }
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = requireAdmin(request);
    if (guard) return guard;
    await dbConnect();
    const { id } = await params;
    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
