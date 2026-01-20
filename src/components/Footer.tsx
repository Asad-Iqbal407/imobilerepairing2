"use client";

import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { 
  Smartphone, 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Youtube,
  ExternalLink,
  ArrowRight
} from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();
  const [logoDataUri, setLogoDataUri] = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch('/api/site-settings', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as { logoDataUri?: string };
        const next = typeof data.logoDataUri === 'string' ? data.logoDataUri : '';
        if (!cancelled) setLogoDataUri(next);
      } catch {
        return;
      }
    };

    const onUpdated = () => load();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'site-logo-updated-at') load();
    };

    load();
    window.addEventListener('site-logo-updated', onUpdated as EventListener);
    window.addEventListener('storage', onStorage);
    return () => {
      cancelled = true;
      window.removeEventListener('site-logo-updated', onUpdated as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const socialLinks = [
    { 
      icon: <Facebook className="w-5 h-5" />, 
      href: "https://www.facebook.com/share/1AQkaD6UNM/", 
      label: "Facebook" 
    },
    { 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.6-4.12-1.31a6.342 6.342 0 01-1.89-1.62v6.41c.01 2.53-.8 5.16-2.78 6.74-2.01 1.62-4.88 1.95-7.25 1.11-2.45-.88-4.41-3.26-4.66-5.88-.34-3.12 1.52-6.31 4.49-7.3 1.07-.37 2.21-.49 3.34-.35v4.03c-1.17-.18-2.43-.02-3.41.67-.93.65-1.36 1.83-1.18 2.94.12 1.14.97 2.14 2.04 2.53 1.1.4 2.41.22 3.3-.53.77-.63 1.15-1.66 1.13-2.67V.02z"/>
        </svg>
      ), 
      href: "https://www.tiktok.com/@imobiletertulia?_r=1&_t=ZG-939VWMvX1zE", 
      label: "TikTok" 
    },
    { 
      icon: <Youtube className="w-5 h-5" />, 
      href: "https://consent.youtube.com/m?continue=https%3A%2F%2Fwww.youtube.com%2F%40tertuliaumpulsiva%3Fsi%3DAX76rgo1O6zj_FwS%26cbrd%3D1&gl=PT&m=0&pc=yt&cm=2&hl=en&src=1", 
      label: "YouTube" 
    },
    { 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      ), 
      href: "https://wa.me/qr/5EEVLL7H46YGE1", 
      label: "WhatsApp" 
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"></div>
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]"></div>
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px]"></div>

      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-12"
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="space-y-6 md:col-span-2 flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <motion.div 
                whileHover={{ rotate: 6, scale: 1.05 }}
                className="w-11 h-11 flex items-center justify-center overflow-hidden transition-all duration-300 bg-white rounded-xl shadow-lg shadow-slate-300/40 border border-slate-200 text-blue-600"
              >
                {logoDataUri && logoDataUri.startsWith('data:image/') ? (
                  <Image
                    src={logoDataUri}
                    alt={`${t.common.shopName} logo`}
                    width={36}
                    height={36}
                    className="w-full h-full object-contain"
                    unoptimized
                  />
                ) : (
                  <Smartphone className="h-6 w-6" />
                )}
              </motion.div>
              <span className="text-3xl font-black text-white tracking-tighter">
                {t.common.shopName}
              </span>
            </div>
            <p className="text-slate-400 text-lg max-w-sm leading-relaxed text-center md:text-left">
              {t.common.footerDesc}
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5, backgroundColor: "#2563eb", color: "#ffffff" }}
                  className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 transition-colors shadow-lg"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="flex flex-col items-center md:items-start">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-500 mb-8 flex items-center gap-2 justify-center md:justify-start w-full">
              <span className="w-8 h-px bg-blue-500/30 hidden md:block"></span>
              {t.common.contact}
              <span className="w-8 h-px bg-blue-500/30 md:hidden"></span>
            </h3>
            <ul className="space-y-5 w-full">
              <motion.li 
                whileHover={{ x: 5 }}
                className="group"
              >
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t.common.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col md:flex-row items-center md:items-start gap-4 text-slate-400 cursor-pointer text-center md:text-left w-full"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all shadow-md shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{t.common.visitUs}</span>
                    <span className="text-white font-bold text-base group-hover:text-blue-400 transition-colors">{t.common.address}</span>
                  </div>
                  <ExternalLink className="hidden md:block w-8 h-8 text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 self-center" />
                </a>
              </motion.li>
              <motion.li 
                whileHover={{ x: 5 }}
                className="group"
              >
                <a 
                  href={`tel:${t.common.phone.replace(/\s/g, '')}`}
                  className="flex flex-col md:flex-row items-center md:items-start gap-4 text-slate-400 cursor-pointer text-center md:text-left w-full"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all shadow-md shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{t.common.callUs}</span>
                    <span className="text-white font-bold text-base group-hover:text-blue-400 transition-colors">{t.common.phone}</span>
                    <span className="text-white font-bold text-base group-hover:text-blue-400 transition-colors">{t.common.phone2}</span>
                  </div>
                  <ExternalLink className="hidden md:block w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 self-center" />
                </a>
              </motion.li>
              <motion.li 
                whileHover={{ x: 5 }}
                className="group"
              >
                <a 
                  href={`mailto:${t.common.email}`}
                  className="flex flex-col md:flex-row items-center md:items-start gap-4 text-slate-400 cursor-pointer text-center md:text-left w-full"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all shadow-md shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{t.common.emailUs}</span>
                    <span className="text-white font-bold text-base group-hover:text-blue-400 transition-colors">{t.common.email}</span>
                  </div>
                  <ExternalLink className="hidden md:block w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 self-center" />
                </a>
              </motion.li>
            </ul>
          </motion.div>

          {/* Business Hours */}
          <motion.div variants={itemVariants} className="flex flex-col items-center md:items-start">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-500 mb-8 flex items-center gap-2 justify-center md:justify-start w-full">
              <span className="w-8 h-px bg-blue-500/30 hidden md:block"></span>
              {t.common.hours}
              <span className="w-8 h-px bg-blue-500/30 md:hidden"></span>
            </h3>
            <div className="flex flex-col space-y-2 text-center md:text-left w-full">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                {t.common.everyDay.split(':')[0]}
              </span>
              <span className="text-white font-bold text-base">
                {t.common.everyDay.split(':')[1]}
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-slate-500 text-sm font-medium">
              &copy; {new Date().getFullYear()} <span className="text-white font-bold">{t.common.shopName}</span>. {t.common.rights}
            </p>
            <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">
              NIF: {t.common.nif}
            </p>
            <p className="text-xs text-slate-600 flex items-center gap-1">
              {t.common.craftedWithLove}
            </p>
          </div>
          
          <div className="flex gap-8 text-sm font-black text-slate-500 uppercase tracking-widest">
            <Link href="/terms" className="hover:text-blue-500 cursor-pointer transition-colors flex items-center gap-2 group">
              {t.common.terms}
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <Link href="/cookies" className="hover:text-blue-500 cursor-pointer transition-colors flex items-center gap-2 group">
              {t.common.cookies}
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <Link href="/privacy" className="hover:text-blue-500 cursor-pointer transition-colors flex items-center gap-2 group">
              {t.common.privacy}
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
