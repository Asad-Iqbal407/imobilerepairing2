import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { sendOrderEmails } from '@/lib/email';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16' as any,
    })
  : null;

export async function GET(request: NextRequest) {
  try {
    if (!stripe || !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('YOUR_SECRET_KEY')) {
      return NextResponse.json({ error: 'Stripe Secret Key is not configured.' }, { status: 500 });
    }

    const url = new URL(request.url);
    const sessionId = url.searchParams.get('session_id') || '';
    const orderId = url.searchParams.get('order_id') || '';
    if (!sessionId || !orderId) {
      return NextResponse.json({ error: 'Missing session_id or order_id' }, { status: 400 });
    }

    await dbConnect();

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const sessionOrderId = session.metadata?.orderId || '';
    if (sessionOrderId !== orderId) {
      return NextResponse.json({ error: 'Session does not match order' }, { status: 400 });
    }

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ ok: true, paid: false, paymentStatus: session.payment_status });
    }

    const oldOrder = await Order.findById(orderId);
    if (!oldOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (oldOrder.status !== 'paid') {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { status: 'paid' },
        { new: true, runValidators: true }
      );
      if (order) {
        await sendOrderEmails(order as any);
      }
    }

    return NextResponse.json({ ok: true, paid: true });
  } catch (error: any) {
    console.error('Checkout confirmation error:', error);
    return NextResponse.json({ error: 'Failed to confirm checkout' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!stripe || !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('YOUR_SECRET_KEY')) {
      return NextResponse.json({ error: 'Stripe Secret Key is not configured. Please add it to your .env.local file.' }, { status: 500 });
    }

    const { items, customer, total, currency } = await request.json();
    const normalizedCurrency = currency === 'eur' ? 'eur' : 'usd';

    await dbConnect();

    // Create a temporary order in the database
    const order = await Order.create({
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      customerAddress: customer.address,
      items: items.map((item: any) => ({
        productId: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
      total,
      currency: normalizedCurrency,
      status: 'pending',
    });

    // Create Stripe checkout session
    const session = await stripe!.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: normalizedCurrency,
          product_data: {
            name: item.title,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
      cancel_url: `${request.headers.get('origin')}/cart`,
      metadata: {
        orderId: (order._id as any).toString(),
      },
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
