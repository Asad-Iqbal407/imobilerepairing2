import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16' as any,
    })
  : null;

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 });
    }

    const { items, customer, total, currency, shippingMethod, shippingFee } = await request.json();
    const amount = Math.round(total * 100); // Amount in cents

    await dbConnect();

    // Create a temporary order
    const order = await Order.create({
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      customerAddress: shippingMethod === 'pickup' ? 'STORE PICKUP' : customer.address,
      items: items.map((item: any) => ({
        productId: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
      total,
      currency: currency || 'eur',
      status: 'pending',
      paymentMethod: 'card',
    });

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency || 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: (order._id as any).toString(),
      },
    });

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      orderId: order._id 
    });
  } catch (error: any) {
    console.error('Payment intent error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
