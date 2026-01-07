import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id: productId } = await params;
  try {
    const body = await request.json();
    console.log(`API: Updating product ${productId}`, body);
    
    // Remove id from body to avoid Mongoose/MongoDB issues
    const { id, _id, ...updateData } = body;
    
    const product = await Product.findByIdAndUpdate(
      productId, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!product) {
      console.log(`API: Product ${productId} not found`);
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    console.log(`API: Product ${productId} updated successfully`);
    return NextResponse.json(product);
  } catch (error) {
    console.error(`API Error updating product ${productId}:`, error);
    return NextResponse.json({ error: 'Failed to update product', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id: productId } = await params;
  try {
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
