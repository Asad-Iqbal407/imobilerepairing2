import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Service from '@/models/Service';

export const dynamic = 'force-dynamic';

const initialServices = [
  {
    id: 's1',
    title: "Screen Replacement",
    description: "Cracked or shattered screen? We can replace it with a high-quality display.",
    price: 80,
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 's2',
    title: "Battery Replacement",
    description: "Battery draining fast or not holding charge? Get a fresh battery installed.",
    price: 60,
    image: "https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 's3',
    title: "Water Damage Repair",
    description: "Dropped your phone in water? We'll clean and repair internal components.",
    price: 100,
    image: "https://images.unsplash.com/photo-1512054193303-9107adb5e8c6?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 's4',
    title: "Charging Port Repair",
    description: "Phone not charging or cable loose? We can fix or replace the charging port.",
    price: 50,
    image: "https://images.unsplash.com/photo-1588508065123-287b28e013da?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 's5',
    title: "Camera Repair",
    description: "Blurry photos or cracked camera lens? We restore your camera's clarity.",
    price: 70,
    image: "https://images.unsplash.com/photo-1584438832697-b930ca223c8b?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 's6',
    title: "Software Issues",
    description: "Stuck on logo, boot loop, or slow performance? We can fix software glitches.",
    price: 40,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
  },
];

export async function GET() {
  try {
    await dbConnect();
    const count = await Service.countDocuments();
    if (count === 0) {
      await Service.insertMany(initialServices);
    }
    const services = await Service.find({});
    return NextResponse.json(services);
  } catch (error) {
    console.error('API Error: Failed to fetch services:', error);
    // Return initialServices as fallback directly from API if DB fails
    return NextResponse.json(initialServices);
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const service = await Service.create(body);
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('API Error: Failed to create service:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
