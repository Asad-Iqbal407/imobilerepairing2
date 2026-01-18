import { Metadata } from 'next';
import CookiesClient from './CookiesClient';

export const metadata: Metadata = {
  description: 'Saiba como utilizamos cookies no nosso website para melhorar a sua experiência.',
};

export default function CookiesPage() {
  return <CookiesClient />;
}
