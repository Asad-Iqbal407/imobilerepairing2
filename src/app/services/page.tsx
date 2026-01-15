import { Metadata } from 'next';
import ServicesClient from './ServicesClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Repair Services",
  description: "Expert mobile phone repair services including screen replacement, battery repair, water damage, and more for all major brands.",
  openGraph: {
    title: "Repair Services | IMOBILE",
    description: "Expert mobile phone repair services for iPhone, Samsung, and more.",
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
