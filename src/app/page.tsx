import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Home | Tertulia Impulsiva - Expert Mobile Phone Repair",
  description: "Professional mobile phone repair services. We fix screens, batteries, water damage, and more for all major brands including iPhone and Samsung.",
  openGraph: {
    title: "Tertulia Impulsiva - Expert Mobile Phone Repair",
    description: "Professional mobile phone repair services. Fast, reliable, and affordable.",
  },
};

export default function HomePage() {
  return <HomeClient />;
}
