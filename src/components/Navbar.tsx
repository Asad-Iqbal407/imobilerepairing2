"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Smartphone, 
  Wrench, 
  Store, 
  PhoneCall, 
  ClipboardList,
  ChevronRight,
  Globe
} from 'lucide-react';

export default function Navbar() {
  const { items } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setIsOpen(false), [pathname]);

  const navLinks = [
    { href: "/", label: t.common.home, icon: Smartphone },
    { href: "/services", label: t.common.services, icon: Wrench },
    { href: "/shop", label: t.common.shop, icon: Store },
    { href: "/contact", label: t.common.contact, icon: PhoneCall },
  ];

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-slate-200/50 py-2' 
          : 'bg-white/80 backdrop-blur-md border-b border-slate-100 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center gap-3">
              <motion.div 
                whileHover={{ rotate: 12, scale: 1.1 }}
                className="w-11 h-11 bg-gradient-to-tr from-blue-600 to-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30"
              >
                <Smartphone className="h-6 w-6" />
              </motion.div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                {t.common.shopName}
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                    isActive 
                      ? 'text-blue-600' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 bg-blue-50 rounded-xl -z-10"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="flex p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setLanguage('en')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  language === 'en'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('pt')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  language === 'pt'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                PT
              </button>
            </div>

            <Link href="/cart" className="group relative p-3 text-slate-500 hover:text-blue-600 bg-slate-50 rounded-xl transition-all hover:bg-blue-50">
              <ShoppingBag className="h-6 w-6 transition-transform group-hover:scale-110" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-black text-white bg-blue-600 rounded-full border-2 border-white shadow-sm"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            
            <Link 
              href="/get-quote"
              className="bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-600/20 active:scale-95 flex items-center gap-2"
            >
              <ClipboardList className="w-4 h-4" />
              {t.common.getQuote}
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center space-x-4">
            <Link href="/cart" className="group relative p-2 text-slate-500">
              <ShoppingBag className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-black text-white bg-blue-600 rounded-full border-2 border-white">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[-1] lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden bg-white border-b border-slate-100 overflow-hidden"
            >
              <div className="px-4 pt-4 pb-8 space-y-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center justify-between p-4 rounded-2xl text-base font-bold transition-all ${
                        isActive 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                        {link.label}
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'opacity-100' : 'opacity-30'}`} />
                    </Link>
                  );
                })}
                
                <div className="pt-4 mt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                  <div className="col-span-2 p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                      <Globe className="w-4 h-4" />
                      Language
                    </div>
                    <div className="flex p-1 bg-white rounded-xl shadow-sm border border-slate-100">
                      <button
                        onClick={() => setLanguage('en')}
                        className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                          language === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400'
                        }`}
                      >
                        EN
                      </button>
                      <button
                        onClick={() => setLanguage('pt')}
                        className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                          language === 'pt' ? 'bg-blue-600 text-white' : 'text-slate-400'
                        }`}
                      >
                        PT
                      </button>
                    </div>
                  </div>
                  
                  <Link 
                    href="/get-quote"
                    className="col-span-2 bg-blue-600 text-white p-4 rounded-2xl text-center font-bold shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <ClipboardList className="w-5 h-5" />
                    {t.common.getQuote}
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
