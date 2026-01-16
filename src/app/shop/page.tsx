import { Metadata } from 'next';
import ShopClient from './ShopClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse our wide range of new and refurbished mobile phones, accessories, and more.",
  openGraph: {
    title: "Shop | Tertulia Impulsiva",
    description: "Browse our wide range of new and refurbished mobile phones, accessories, and more.",
  },
};

export default function ShopPage() {
  return <ShopClient />;
}
