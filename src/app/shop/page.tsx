import { Metadata } from 'next';
import ShopClient from './ShopClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Loja",
  description: "Explore a nossa vasta gama de telemóveis novos e recondicionados, acessórios e muito mais.",
  openGraph: {
    title: "Loja | Tertulia Impulsiva",
    description: "Explore a nossa vasta gama de telemóveis novos e recondicionados, acessórios e muito mais.",
  },
};

export default function ShopPage() {
  return <ShopClient />;
}
