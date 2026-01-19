"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function CookieConsent() {
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
    // If user is on a legal page, stay there or refresh to reflect consent if needed
    if (pathname === '/cookies' || pathname === '/terms') {
      router.refresh();
    }
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
    
    // If user is on a legal page and declines, refer them back to where they were surfing
    if (pathname === '/cookies' || pathname === '/terms') {
      router.back();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-[2rem] p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
              <span className="text-2xl">🍪</span> {t.legal.cookiesTitle}
            </h3>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              {t.legal.cookieConsent}{' '}
              <Link href="/cookies" className="text-blue-400 hover:text-blue-300 font-medium underline underline-offset-4">
                {t.legal.readMore}
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0 w-full md:w-auto">
            <button
              onClick={handleDecline}
              className="flex-1 md:flex-none px-6 py-3 rounded-xl text-slate-400 font-bold hover:text-white hover:bg-slate-800 transition-all text-sm"
            >
              {t.legal.decline}
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 md:flex-none px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all text-sm active:scale-95"
            >
              {t.legal.accept}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
