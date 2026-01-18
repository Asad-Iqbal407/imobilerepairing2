import { Metadata } from 'next';
import PrivacyClient from './PrivacyClient';

export const metadata: Metadata = {
  description: 'Leia a nossa política de privacidade para saber como tratamos os seus dados pessoais na Tertulia Impulsiva.',
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
