import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { sendOrderEmails } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  try {
    await dbConnect();

    if (event.type === 'checkout.session.completed' || event.type === 'payment_intent.succeeded') {
      const data = event.data.object as any;
      const orderId = data.metadata?.orderId;

      if (orderId) {
        const order = await Order.findById(orderId);
        if (order && order.status !== 'paid') {
          order.status = 'paid';
          await order.save();
          await sendOrderEmails(order as any);
          console.log(`Order ${orderId} marked as paid and emails sent via webhook`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
