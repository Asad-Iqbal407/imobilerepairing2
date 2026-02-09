import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const initialCategories = [
  { name: 'New Phones', icon: '📱' },
  { name: 'Refurbished Phones', icon: '🔄' },
  { name: '2nd Hand Phones', icon: '🤝' },
  { name: 'Tablets', icon: '📟' },
  { name: 'Cables', icon: '🔌' },
  { name: 'Chargers', icon: '⚡' },
  { name: 'Powerbanks', icon: '🔋' },
  { name: 'Earbuds', icon: '🎧' },
  { name: 'Adapters', icon: '🔌' },
  { name: 'Speakers', icon: '🔊' },
  { name: 'Cases', icon: '📱' },
  { name: 'Other', icon: '📦' },
];

export async function GET() {
  try {
    await dbConnect();
    const count = await Category.countDocuments();
    if (count === 0) {
      await Category.insertMany(initialCategories);
    }
    const categories = await Category.find({}).sort({ name: 1 });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('API Error: Failed to fetch categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories from database' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const icon = typeof body?.icon === 'string' ? body.icon.trim() : '';

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const existing = await Category.findOne({ name: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') });
    if (existing) {
      return NextResponse.json({ error: 'Category already exists' }, { status: 409 });
    }

    const category = await Category.create({ name, icon: icon || undefined });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
