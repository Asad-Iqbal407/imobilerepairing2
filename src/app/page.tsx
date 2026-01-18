import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  description: "Professional mobile phone repair services. We fix screens, batteries, water damage, and more for all major brands including iPhone and Samsung.",
  openGraph: {
    description: "Professional mobile phone repair services. Fast, reliable, and affordable.",
  },
};

export default function HomePage() {
  return <HomeClient />;
}
