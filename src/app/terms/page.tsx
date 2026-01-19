import { Metadata } from 'next';
import TermsClient from './TermsClient';

export const metadata: Metadata = {
  description: 'Leia os nossos termos e condições de serviço na Tertulia Umpulsiva.',
};

export default function TermsPage() {
  return <TermsClient />;
}
