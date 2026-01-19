"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');
  const { items, clearCart } = useCart();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  const confirmCheckout = async (session: string, order: string) => {
    try {
      const url = `/api/checkout?session_id=${encodeURIComponent(session)}&order_id=${encodeURIComponent(order)}`;
      const res = await fetch(url, { method: 'GET' });
      if (res.ok) {
        setStatus('success');
      } else {
        console.error('Failed to confirm checkout');
        setStatus('success'); // Still show success to user
      }
    } catch (error) {
      console.error('Error confirming checkout:', error);
      setStatus('success'); // Still show success to user
    }
  };

  useEffect(() => {
    // Only clear if there are items to clear
    if (items.length > 0) {
      clearCart();
    }

    if (sessionId && orderId) {
      confirmCheckout(sessionId, orderId);
    } else {
      setStatus('success');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, orderId, items.length]);

  if (status === 'loading') return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-[120px]"></div>

      <div className="max-w-lg w-full bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 text-center relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Payment Successful!</h1>
        <p className="text-slate-500 text-lg leading-relaxed mb-10">
          Thank you for your trust. We&apos;ve received your payment and our team is already preparing to get your device back in perfect condition.
        </p>
        <div className="grid grid-cols-1 gap-4">
          <Link
            href="/"
            className="w-full py-4 px-6 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 hover:-translate-y-1"
          >
            Return Home
          </Link>
          <Link
            href="/services"
            className="w-full py-4 px-6 bg-slate-50 text-slate-600 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all"
          >
            Explore Services
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
