import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

const initialProducts = [
  // New Phones
  {
    id: 'p1',
    name: 'Samsung Galaxy A14 4G',
    category: 'New Phones',
    price: 189.90,
    image: 'https://www.tudo4mobile.pt/image/cache/catalog/Produtos/Telemoveis/Samsung/A14/samsung-galaxy-a14-4g-silver-600x600.jpg',
    description: '64GB, 4GB RAM, Silver, Brand New'
  },
  {
    id: 'p2',
    name: 'Xiaomi Redmi Note 12',
    category: 'New Phones',
    price: 219.00,
    image: 'https://www.tudo4mobile.pt/image/cache/catalog/Produtos/Telemoveis/Xiaomi/Redmi%20Note%2012/xiaomi-redmi-note-12-4g-onyx-gray-600x600.jpg',
    description: '128GB, 4GB RAM, Onyx Gray, Brand New'
  },
  // Refurbished Phones
  {
    id: 'p3',
    name: 'iPhone 13 Pro Max Refurbished',
    category: 'Refurbished Phones',
    price: 825.00,
    image: 'https://www.tudo4mobile.pt/image/cache/catalog/Produtos/Telemoveis/Apple/iPhone%2013%20Pro%20Max/apple-iphone-13-pro-max-graphite-600x600.jpg',
    description: '128GB, Graphite, Grade A Refurbished'
  },
  {
    id: 'p4',
    name: 'iPhone 11 Refurbished',
    category: 'Refurbished Phones',
    price: 349.00,
    image: 'https://www.tudo4mobile.pt/image/cache/catalog/Produtos/Telemoveis/Apple/iPhone%2011/apple-iphone-11-black-600x600.jpg',
    description: '64GB, Black, Grade A Refurbished'
  },
  // 2nd Hand Phones
  {
    id: 'p5',
    name: 'Nokia 3310 (Classic)',
    category: '2nd Hand Phones',
    price: 49.00,
    image: 'https://www.tudo4mobile.pt/image/cache/catalog/Produtos/Telemoveis/Nokia/3310/nokia-3310-dark-blue-600x600.jpg',
    description: 'Dark Blue, Classic Feature Phone, Tested and Working'
  },
  {
    id: 'p6',
    name: 'Alcatel 2003G',
    category: '2nd Hand Phones',
    price: 29.90,
    image: 'https://www.tudo4mobile.pt/image/cache/catalog/Produtos/Telemoveis/Alcatel/2003G/alcatel-2003g-dark-gray-600x600.jpg',
    description: 'Dark Gray, Compact Feature Phone'
  },
  // Tablets
  {
    id: 'p7',
    name: 'iPad Air 2 Refurbished',
    category: 'Tablets',
    price: 199.00,
    image: 'https://www.tudo4mobile.pt/image/cache/catalog/Produtos/Tablets/Apple/iPad%20Air%202/apple-ipad-air-2-silver-600x600.jpg',
    description: '16GB, Silver, Wi-Fi, Grade A'
  },
  {
    id: 'p8',
    name: 'Samsung Galaxy Tab A8',
    category: 'Tablets',
    price: 229.00,
    image: 'https://www.tudo4mobile.pt/image/cache/catalog/Produtos/Tablets/Samsung/Tab%20A8/samsung-galaxy-tab-a8-gray-600x600.jpg',
    description: '32GB, Gray, Wi-Fi'
  },
  // Cables
  {
    id: 'p9',
    name: 'Hoco X14 Type-C Cable',
    category: 'Cables',
    price: 4.50,
    image: 'https://www.tudo4mobile.pt/image/cache/catalog/Produtos/Acessorios/Cabos/Hoco/X14/hoco-x14-type-c-black-600x600.jpg',
    description: '1m, Nylon Braided, Fast Charging'
  },
  {
    id: 'p10',
    name: 'Lightning to USB Cable 1m',
    category: 'Cables',
    price: 5.90,
    image: 'https://www.tudo4mobile.pt/image/cache/catalog/Produtos/Acessorios/Cabos/Apple/lightning-to-usb-cable-1m-600x600.jpg',
    description: 'Compatible with iPhone/iPad'
  },
  // Chargers
  {
    id: 'p11',
    name: 'Hoco C76A 20W PD Charger',
    category: 'Chargers',
    price: 12.50,
    image: 'https://www.tudo4mobile.pt/image/cache/catalog/Produtos/Acessorios/Carregadores/Hoco/C76A/hoco-c76a-20w-pd-charger-white-600x600.jpg',
    description: 'Fast Charge USB-C Power Adapter'
  },
  {
    id: 'p12',
    name: 'Samsung 25W Fast Charger',
    category: 'Chargers',
    price: 19.90,
    image: 'https://www.tudo4mobile.pt/image/cache/catalog/Produtos/Acessorios/Carregadores/Samsung/25w-fast-charger-black-600x600.jpg',
    description: 'Original Samsung Super Fast Charging'
  },
  // Powerbanks
  {
    id: 'p13',
    name: 'Hoco J87 10000mAh Power Bank',
    category: 'Powerbanks',
    price: 18.90,
    image: 'https://www.tudo4mobile.pt/image/cache/catalog/Produtos/Acessorios/Power%20Bank/Hoco/J87/hoco-j87-10000mah-power-bank-black-600x600.jpg',
    description: 'PD 20W + QC 3.0 Fast Charging'
  },
  // Earbuds
  {
    id: 'p14',
    name: 'Hoco EW04 Plus TWS Earbuds',
    category: 'Earbuds',
    price: 24.50,
    image: 'https://www.tudo4mobile.pt/image/cache/catalog/Produtos/Som%20e%20Audio/Earbuds/Hoco/EW04%20Plus/hoco-ew04-plus-white-600x600.jpg',
    description: 'True Wireless Stereo, Bluetooth 5.1'
  },
  {
    id: 'p15',
    name: 'AirPods Pro 2nd Gen (Compatible)',
    category: 'Earbuds',
    price: 39.90,
    image: 'https://www.tudo4mobile.pt/image/cache/catalog/Produtos/Som%20e%20Audio/Earbuds/Apple/airpods-pro-2-600x600.jpg',
    description: 'Premium Sound Quality, Wireless Charging'
  },
  // Adapters
  {
    id: 'p16',
    name: 'OTG USB to Type-C Adapter',
    category: 'Adapters',
    price: 3.50,
    image: 'https://www.tudo4mobile.pt/image/cache/catalog/Produtos/Acessorios/Adaptadores/otg-usb-to-type-c-adapter-600x600.jpg',
    description: 'Connect USB Flash Drives to your Phone'
  },
  // Speakers
  {
    id: 'p17',
    name: 'Hoco BS30 Wireless Speaker',
    category: 'Speakers',
    price: 14.90,
    image: 'https://www.tudo4mobile.pt/image/cache/catalog/Produtos/Som%20e%20Audio/Speakers/Hoco/BS30/hoco-bs30-black-600x600.jpg',
    description: 'Portable Bluetooth Speaker, 10h Playback'
  },
  // Cases
  {
    id: 'p18',
    name: 'Silicone Case for iPhone 14',
    category: 'Cases',
    price: 9.90,
    image: 'https://www.tudo4mobile.pt/image/cache/catalog/Produtos/Capas/Apple/iPhone%2014/silicone-case-black-600x600.jpg',
    description: 'Soft-touch Silicone, Multiple Colors'
  }
];

export async function GET() {
  try {
    await dbConnect();
    const validCategories = [
      'New Phones', 'Refurbished Phones', '2nd Hand Phones', 'Tablets', 
      'Cables', 'Chargers', 'Powerbanks', 'Earbuds', 'Adapters', 'Speakers', 'Cases'
    ];

    const invalidProduct = await Product.findOne({ category: { $nin: validCategories } });
    const count = await Product.countDocuments();
    
    if (invalidProduct || count === 0) {
      await Product.deleteMany({});
      await Product.insertMany(initialProducts);
    }

    const products = await Product.find({});
    return NextResponse.json(products);
  } catch (error) {
    console.error('API Error: Failed to fetch products:', error);
    // Return initialProducts as fallback directly from API if DB fails
    return NextResponse.json(initialProducts);
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('API Error: Failed to create product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
