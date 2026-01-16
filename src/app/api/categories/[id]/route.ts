import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  try {
    const { id } = await params;
    const body = await request.json();
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const icon = typeof body?.icon === 'string' ? body.icon.trim() : '';

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const existing = await Category.findById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const duplicate = await Category.findOne({
      _id: { $ne: id },
      name: new RegExp(`^${escapeRegExp(name)}$`, 'i'),
    });
    if (duplicate) {
      return NextResponse.json({ error: 'Category already exists' }, { status: 409 });
    }

    const oldName = existing.name;
    existing.name = name;
    existing.icon = icon || undefined;
    const saved = await existing.save();

    if (oldName !== name) {
      await Product.updateMany({ category: oldName }, { $set: { category: name } });
    }

    return NextResponse.json(saved);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  try {
    const { id } = await params;
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const deletedName = category.name;
    await Category.findByIdAndDelete(id);

    await Category.updateOne(
      { name: 'Other' },
      { $setOnInsert: { name: 'Other', icon: '📦' } },
      { upsert: true }
    );

    if (deletedName && deletedName !== 'Other') {
      await Product.updateMany({ category: deletedName }, { $set: { category: 'Other' } });
    }

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}

