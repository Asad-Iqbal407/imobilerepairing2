import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Quote from '@/models/Quote';
import { requireAdmin } from '@/lib/adminGuard';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const guard = requireAdmin(request);
    if (guard) return guard;
    await dbConnect();
    
    // Check if collection exists
    try {
      if (mongoose.connection.db) {
        const collections = await mongoose.connection.db.listCollections({ name: 'quotes' }).toArray();
        if (collections.length === 0) {
          await Quote.createCollection();
        }
      }
    } catch (e) {
      console.error('Quote collection check error:', e);
    }

    const quotes = await Quote.find({}).sort({ createdAt: -1 });
    return NextResponse.json(quotes);
  } catch (error) {
    console.error('GET /api/quotes - FATAL ERROR:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch quotes', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const quote = await Quote.create(body);
    return NextResponse.json(quote, { status: 201 });
  } catch (error) {
    console.error('Quote submission error:', error);
    return NextResponse.json({ error: 'Failed to submit quote request' }, { status: 500 });
  }
}
