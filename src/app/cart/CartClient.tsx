"use client";

import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { formatPriceByLanguage } from '@/lib/utils';
import CheckoutForm from '@/components/CheckoutForm';
import { User, Mail, Phone, MapPin, Truck, CreditCard, ShieldCheck } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CartPage() {
  const { items, removeFromCart, total, clearCart } = useCart();
  const { t, language } = useLanguage();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<'pickup' | 'lisbon' | 'outside'>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'klarna'>('card');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: '',
    phone: ''
  });

  const shippingFees = {
    pickup: 0,
    lisbon: 4,
    outside: 6
  };

  const shippingFee = shippingFees[shippingMethod];
  const grandTotal = total + shippingFee;

  const handleCheckout = async () => {
    // Manual validation since we're not using form submit
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert(t.cart.validationError);
      return;
    }
    if (shippingMethod !== 'pickup' && !customerInfo.address) {
      alert(t.cart.addressRequired);
      return;
    }

    setIsCheckingOut(true);

    try {
      if (paymentMethod === 'card') {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currency: 'eur',
            items,
            customer: customerInfo,
            total: grandTotal,
            shippingMethod,
            shippingFee,
          }),
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error);
        
        setClientSecret(data.clientSecret);
        setActiveOrderId(data.orderId);
        return; // UI will switch to showing the card panel
      }

      const stripe = await stripePromise;
      if (!stripe) {
        if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.includes('YOUR_PUBLISHABLE_KEY')) {
          throw new Error('Please set your valid Stripe Publishable Key in .env.local');
        }
        throw new Error('Stripe failed to load. Check your internet connection or API key.');
      }

      const currency = 'eur';
      const checkoutItems = items;
      
      // Include shipping as an item or handle separately in API
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currency,
          items: checkoutItems,
          customer: customerInfo,
          total: grandTotal,
          shippingMethod,
          shippingFee,
          paymentMethod,
        }),
      });

      const session = await response.json();

      if (session.error) {
        throw new Error(session.error);
      }

      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error('No checkout URL received from Stripe');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(`${t.cart.checkoutFailed}: ${error.message}`);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white px-4">
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">{t.cart.emptyTitle}</h2>
            <p className="text-slate-500 text-lg leading-relaxed">{t.cart.emptyDesc}</p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 hover:-translate-y-1 w-full"
          >
            {t.cart.browseServices}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 skew-x-12 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-purple-600/10 -skew-x-12 -translate-x-1/4 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <Link 
              href="/shop" 
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold mb-8 transition-colors group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t.cart.browseServices}
            </Link>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
              {t.cart.title}
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              {t.cart.completeOrder}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{t.cart.yourItems}</h2>
                <button
                  onClick={clearCart}
                  className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors"
                >
                  {t.cart.clearCart}
                </button>
              </div>
              <ul className="divide-y divide-slate-50">
                {items.map((item) => (
                  <li key={item.id} className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                        {item.title.includes('Phone') ? '📱' : item.title.includes('Tablet') ? '📟' : '🛠️'}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                        <p className="text-slate-500 font-medium">{t.cart.quantity}: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-8">
                      <span className="text-2xl font-black text-slate-900 tracking-tight">{formatPriceByLanguage(item.price * item.quantity, language)}</span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-200"
                        title={t.cart.remove}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="p-8 bg-slate-900 text-white space-y-4">
                <div className="flex justify-between items-center text-sm font-bold opacity-70">
                  <span>{t.cart.subtotal}</span>
                  <span>{formatPriceByLanguage(total, language)}</span>
                </div>
                {shippingFee > 0 && (
                  <div className="flex justify-between items-center text-sm font-bold opacity-70">
                    <span>{t.cart.shippingFee}</span>
                    <span>{formatPriceByLanguage(shippingFee, language)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <span className="text-xl font-bold opacity-70">{t.cart.total}</span>
                  <span className="text-4xl font-black tracking-tighter">{formatPriceByLanguage(grandTotal, language)}</span>
                </div>
              </div>
            </div>

            <div className="p-8 bg-blue-50 rounded-[2rem] border border-blue-100 flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-blue-900">{t.cart.secureCheckout}</h4>
                <p className="text-blue-700/70 text-sm leading-relaxed">{t.cart.secureCheckoutDesc}</p>
              </div>
            </div>

            <div className="p-8 bg-green-50 rounded-[2rem] border border-green-100 flex items-start gap-4">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-green-900">{t.shop.refundPolicy}</h4>
                <p className="text-green-700/70 text-sm leading-relaxed">{t.shop.refundPolicyDesc}</p>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 sticky top-24 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50"></div>
              
              <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight relative flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                {t.cart.checkoutDetails}
              </h2>

              <div className="space-y-6 relative">
                <div className="space-y-6">
                  {/* Shipping Method Section */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">
                      <Truck className="w-4 h-4 text-blue-600" />
                      {t.cart.shippingMethod}
                    </label>
                    <div className="space-y-3">
                      <label className={`group flex items-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${shippingMethod === 'pickup' ? 'border-blue-600 bg-blue-50 shadow-md shadow-blue-600/5' : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'}`}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${shippingMethod === 'pickup' ? 'border-blue-600' : 'border-slate-300'}`}>
                          {shippingMethod === 'pickup' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                        </div>
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="pickup"
                          checked={shippingMethod === 'pickup'}
                          onChange={() => setShippingMethod('pickup')}
                          className="sr-only"
                        />
                        <span className={`ml-3 font-bold transition-colors ${shippingMethod === 'pickup' ? 'text-blue-900' : 'text-slate-600 group-hover:text-slate-900'}`}>{t.cart.storePickup}</span>
                      </label>
                      <label className={`group flex items-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${shippingMethod === 'lisbon' ? 'border-blue-600 bg-blue-50 shadow-md shadow-blue-600/5' : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'}`}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${shippingMethod === 'lisbon' ? 'border-blue-600' : 'border-slate-300'}`}>
                          {shippingMethod === 'lisbon' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                        </div>
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="lisbon"
                          checked={shippingMethod === 'lisbon'}
                          onChange={() => setShippingMethod('lisbon')}
                          className="sr-only"
                        />
                        <span className={`ml-3 font-bold transition-colors ${shippingMethod === 'lisbon' ? 'text-blue-900' : 'text-slate-600 group-hover:text-slate-900'}`}>{t.cart.deliveryLisbon}</span>
                      </label>
                      <label className={`group flex items-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${shippingMethod === 'outside' ? 'border-blue-600 bg-blue-50 shadow-md shadow-blue-600/5' : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'}`}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${shippingMethod === 'outside' ? 'border-blue-600' : 'border-slate-300'}`}>
                          {shippingMethod === 'outside' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                        </div>
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="outside"
                          checked={shippingMethod === 'outside'}
                          onChange={() => setShippingMethod('outside')}
                          className="sr-only"
                        />
                        <span className={`ml-3 font-bold transition-colors ${shippingMethod === 'outside' ? 'text-blue-900' : 'text-slate-600 group-hover:text-slate-900'}`}>{t.cart.deliveryOutsideLisbon}</span>
                      </label>
                    </div>
                  </div>

                  {/* Payment Method Section */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      {t.cart.paymentMethodLabel}
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label 
                        className={`group relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50 shadow-lg shadow-blue-600/5' : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'}`}
                        onClick={() => setPaymentMethod('card')}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="sr-only"
                        />
                        <div className={`h-8 mb-3 flex items-center justify-center transition-transform group-hover:scale-110 ${paymentMethod === 'card' ? 'scale-110' : ''}`}>
                          <svg viewBox="0 0 48 48" className="h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 10C4 8.89543 4.89543 8 6 8H42C43.1046 8 44 8.89543 44 10V38C44 39.1046 43.1046 40 42 40H6C4.89543 40 4 39.1046 4 38V10Z" fill="#1A1F71"/>
                            <path d="M4 14H44V18H4V14Z" fill="white" fillOpacity="0.2"/>
                            <path d="M8 30H16V34H8V30Z" fill="white" fillOpacity="0.2"/>
                          </svg>
                        </div>
                        <span className={`font-black text-sm transition-colors ${paymentMethod === 'card' ? 'text-blue-900' : 'text-slate-500 group-hover:text-slate-900'}`}>{t.cart.creditCard}</span>
                        {paymentMethod === 'card' && <div className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full"></div>}
                      </label>

                      <label 
                        className={`group relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === 'klarna' ? 'border-blue-600 bg-blue-50 shadow-lg shadow-blue-600/5' : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'}`}
                        onClick={() => setPaymentMethod('klarna')}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="klarna"
                          checked={paymentMethod === 'klarna'}
                          onChange={() => setPaymentMethod('klarna')}
                          className="sr-only"
                        />
                        <div className={`h-8 mb-3 flex items-center justify-center transition-transform group-hover:scale-110 ${paymentMethod === 'klarna' ? 'scale-110' : ''}`}>
                          <svg viewBox="0 0 100 24" className="h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.8 0h3.6v24h-3.6V0zm6.8 0h3.6v13.6L29.6 0h4.2l-10 14.2L34.4 24h-4.2l-9.2-13V24h-3.6V0zM4.4 24c-2.4 0-4.4-2-4.4-4.4s2-4.4 4.4-4.4 4.4 2 4.4 4.4-2 4.4-4.4 4.4z" fill="#FFB3C7"/>
                            <path d="M50.4 8.8c-1.4 0-2.6.6-3.4 1.6V9h-3.4v15h3.4v-8.4c0-2.2 1.4-3.6 3.4-3.6s3.4 1.4 3.4 3.6V24h3.4V15.6c0-4.4-2.8-6.8-6.8-6.8zM71.2 8.8c-1.4 0-2.6.6-3.4 1.6V9h-3.4v15h3.4v-8.4c0-2.2 1.4-3.6 3.4-3.6s3.4 1.4 3.4 3.6V24h3.4V15.6c0-4.4-2.8-6.8-6.8-6.8zM91.4 8.8c-4.4 0-7.8 3.4-7.8 7.8s3.4 7.8 7.8 7.8 7.8-3.4 7.8-7.8-3.4-7.8-7.8-7.8zm0 12.2c-2.6 0-4.4-1.8-4.4-4.4s1.8-4.4 4.4-4.4 4.4 1.8 4.4 4.4-1.8 4.4-4.4 4.4z" fill="#000"/>
                          </svg>
                        </div>
                        <span className={`font-black text-sm transition-colors ${paymentMethod === 'klarna' ? 'text-blue-900' : 'text-slate-500 group-hover:text-slate-900'}`}>{t.cart.klarna}</span>
                        {paymentMethod === 'klarna' && <div className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full"></div>}
                      </label>
                    </div>
                  </div>

                  {/* Customer Info Section */}
                  <div className="space-y-4">
                    <div className="relative group">
                      <label className="block text-xs font-black text-slate-400 mb-1 uppercase tracking-widest ml-1">{t.cart.fullName}</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                          type="text"
                          name="name"
                          placeholder={t.cart.placeholderName}
                          value={customerInfo.name}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-600 transition-all outline-none bg-slate-50/50 font-bold text-slate-900 placeholder:text-slate-300"
                        />
                      </div>
                    </div>

                    <div className="relative group">
                      <label className="block text-xs font-black text-slate-400 mb-1 uppercase tracking-widest ml-1">{t.cart.emailAddress}</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                          type="email"
                          name="email"
                          placeholder={t.cart.placeholderEmail}
                          value={customerInfo.email}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-600 transition-all outline-none bg-slate-50/50 font-bold text-slate-900 placeholder:text-slate-300"
                        />
                      </div>
                    </div>

                    <div className="relative group">
                      <label className="block text-xs font-black text-slate-400 mb-1 uppercase tracking-widest ml-1">{t.cart.phoneNumber}</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                          type="tel"
                          name="phone"
                          placeholder={t.cart.placeholderPhone}
                          value={customerInfo.phone}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-600 transition-all outline-none bg-slate-50/50 font-bold text-slate-900 placeholder:text-slate-300"
                        />
                      </div>
                    </div>

                    {shippingMethod !== 'pickup' && (
                      <div className="relative group animate-in fade-in slide-in-from-top-2">
                        <label className="block text-xs font-black text-slate-400 mb-1 uppercase tracking-widest ml-1">{t.cart.shippingAddress}</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                          <textarea
                            name="address"
                            rows={3}
                            placeholder={t.cart.placeholderAddress}
                            value={customerInfo.address}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-600 transition-all outline-none bg-slate-50/50 font-bold text-slate-900 placeholder:text-slate-300 resize-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {clientSecret && activeOrderId ? (
                  <div className="mt-8 p-6 bg-slate-50 rounded-2xl border-2 border-blue-100 animate-in fade-in slide-in-from-top-4 duration-500">
                    <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      {t.cart.creditCard}
                    </h3>
                    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                      <CheckoutForm orderId={activeOrderId} total={grandTotal} />
                    </Elements>
                    <button 
                      type="button"
                      onClick={() => setClientSecret(null)}
                      className="mt-4 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors w-full text-center"
                    >
                      {t.admin.cancel}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className={`w-full py-5 px-6 rounded-2xl text-white font-black text-lg shadow-xl transition-all duration-300 relative overflow-hidden group ${
                      isCheckingOut 
                        ? 'bg-blue-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-600/40 hover:-translate-y-1 active:scale-[0.98]'
                    }`}
                  >
                    <span className={`flex items-center justify-center transition-all duration-300 ${isCheckingOut ? 'opacity-0' : 'opacity-100'}`}>
                      {isCheckingOut ? t.cart.processing : `${t.cart.pay} ${formatPriceByLanguage(grandTotal, language)}`}
                      <div className="ml-2 w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <Truck className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </span>
                    {isCheckingOut && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    )}
                  </button>
                )}
                
                <div className="pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-center gap-2 text-slate-400 mb-4">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {t.cart.securePayment}
                    </span>
                  </div>
                  <div className="flex justify-center gap-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Klarna_Logo.svg" alt="Klarna" className="h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
