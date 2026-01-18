import { Metadata } from 'next';
import ShopClient from './ShopClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  description: "Explore a nossa vasta gama de telemóveis novos e recondicionados, acessórios e muito mais.",
  openGraph: {
    description: "Explore a nossa vasta gama de telemóveis novos e recondicionados, acessórios e muito mais.",
  },
};

export default function ShopPage() {
  return <ShopClient />;
}
