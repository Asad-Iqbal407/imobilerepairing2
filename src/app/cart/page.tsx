import { Metadata } from 'next';
import CartClient from './CartClient';

export const metadata: Metadata = {
  description: 'Reveja os seus itens e finalize a sua compra na Tertulia Impulsiva.',
};

export default function CartPage() {
  return <CartClient />;
}
