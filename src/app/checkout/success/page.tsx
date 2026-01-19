import { Metadata } from 'next';
import SuccessClient from './SuccessClient';
import { Suspense } from 'react';

export const metadata: Metadata = {
  description: 'O seu pagamento foi processado com sucesso. Obrigado por escolher a Tertulia Umpulsiva.',
};

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SuccessClient />
    </Suspense>
  );
}
