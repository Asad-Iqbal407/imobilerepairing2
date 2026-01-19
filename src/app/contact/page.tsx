import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  description: 'Entre em contacto com a Tertulia Umpulsiva para reparações de telemóveis, dúvidas ou orçamentos. Estamos aqui para ajudar.',
};

export default function ContactPage() {
  return <ContactClient />;
}
