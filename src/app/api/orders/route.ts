import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function GET() {
  await dbConnect();
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders', details: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body = await request.json();
    const order = await Order.create(body);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

