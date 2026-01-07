import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';

export async function GET() {
  try {
    await dbConnect();
    const reviews = await Review.find({}).sort({ date: -1 });
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    if (!body.user || !body.rating || !body.comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newReview = await Review.create({
      user: body.user,
      rating: body.rating,
      comment: body.comment,
      date: new Date()
    });
    
    return NextResponse.json(newReview);
  } catch (error) {
    console.error('Failed to create review:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
