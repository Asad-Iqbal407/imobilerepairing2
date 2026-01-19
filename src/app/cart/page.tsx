import { Metadata } from 'next';
import CartClient from './CartClient';

export const metadata: Metadata = {
  description: 'Reveja os seus itens e finalize a sua compra na Tertulia Umpulsiva.',
};

export default function CartPage() {
  return <CartClient />;
}
