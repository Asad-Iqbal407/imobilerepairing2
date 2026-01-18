import { Metadata } from 'next';
import QuoteClient from './QuoteClient';
import { Suspense } from 'react';

export const metadata: Metadata = {
  description: 'Peça um orçamento gratuito para a reparação do seu telemóvel. Resposta rápida e preços competitivos.',
};

export default function GetQuotePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuoteClient />
    </Suspense>
  );
}
