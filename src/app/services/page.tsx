import { Metadata } from 'next';
import ServicesClient from './ServicesClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Serviços de Reparação",
  description: "Serviços especializados de reparação de telemóveis, incluindo substituição de ecrã, reparação de bateria, danos por água e muito mais para todas as principais marcas.",
  openGraph: {
    title: "Serviços de Reparação | Tertulia Impulsiva",
    description: "Serviços especializados de reparação de telemóveis para iPhone, Samsung e muito mais.",
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
