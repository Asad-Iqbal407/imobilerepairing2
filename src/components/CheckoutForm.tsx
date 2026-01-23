"use client";

import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { useLanguage } from '@/context/LanguageContext';
import { formatPriceByLanguage } from '@/lib/utils';
import { CreditCard, Loader2 } from 'lucide-react';

interface CheckoutFormProps {
  orderId: string;
  total: number;
}

export default function CheckoutForm({ orderId, total }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { t, language } = useLanguage();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success?order_id=${orderId}`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || t.cart.errorOccurred);
    } else {
      setMessage(t.cart.unexpectedError);
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500">
      <div className="p-4 bg-white rounded-2xl border-2 border-slate-100 shadow-sm">
        <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />
      </div>

      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="w-full py-5 px-6 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 active:scale-[0.98] group"
      >
        <span id="button-text" className="flex items-center justify-center gap-3">
          {isLoading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              {t.cart.processing}
            </>
          ) : (
            <>
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <CreditCard className="w-5 h-5" />
              </div>
              {t.cart.pay} {formatPriceByLanguage(total, language)}
            </>
          )}
        </span>
      </button>

      {message && (
        <div id="payment-message" className="text-red-500 text-sm font-bold text-center bg-red-50 p-4 rounded-xl border-2 border-red-100 animate-in shake duration-500">
          {message}
        </div>
      )}
    </form>
  );
}
