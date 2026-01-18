import { Metadata } from 'next';
import CancelClient from './CancelClient';

export const metadata: Metadata = {
  description: 'O seu pagamento foi cancelado. Se tiver alguma dúvida, entre em contacto connosco.',
};

export default function CancelPage() {
  return <CancelClient />;
}
