"use client";

import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  ExternalLink
} from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: "#", label: "Facebook" },
    { icon: <Instagram className="w-5 h-5" />, href: "#", label: "Instagram" },
    { icon: <Twitter className="w-5 h-5" />, href: "#", label: "Twitter" },
    { icon: <Youtube className="w-5 h-5" />, href: "#", label: "Youtube" },
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
          <motion.div variants={itemVariants} className="space-y-6 md:col-span-2">
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ rotate: 12, scale: 1.1 }}
                className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20"
              >
                <Smartphone className="h-7 w-7" />
              </motion.div>
              <span className="text-3xl font-black text-white tracking-tighter">
                {t.common.shopName}
              </span>
            </div>
            <p className="text-slate-400 text-lg max-w-sm leading-relaxed">
              {t.common.footerDesc}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
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
          <motion.div variants={itemVariants}>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-500 mb-8 flex items-center gap-2">
              <span className="w-8 h-px bg-blue-500/30"></span>
              {t.common.contact}
            </h3>
            <ul className="space-y-5">
              <motion.li 
                whileHover={{ x: 5 }}
                className="flex items-start gap-4 text-slate-400 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-md">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Visit Us</span>
                  <span className="group-hover:text-white transition-colors">{t.common.address}</span>
                </div>
              </motion.li>
              <motion.li 
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 text-slate-400 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-md">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Call Us</span>
                  <span className="group-hover:text-white transition-colors">{t.common.phone}</span>
                  <span className="group-hover:text-white transition-colors">{t.common.phone2}</span>
                </div>
              </motion.li>
              <motion.li 
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 text-slate-400 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-md">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Email Us</span>
                  <span className="group-hover:text-white transition-colors">{t.common.email}</span>
                </div>
              </motion.li>
            </ul>
          </motion.div>

          {/* Business Hours */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-500 mb-8 flex items-center gap-2">
              <span className="w-8 h-px bg-blue-500/30"></span>
              {t.common.hours}
            </h3>
            <div className="bg-slate-800/30 rounded-[2rem] p-6 border border-slate-700/50">
              <div className="flex flex-col items-center text-center space-y-2">
                <span className="text-white font-black bg-blue-600/20 px-4 py-2 rounded-xl text-lg border border-blue-500/20">
                  {t.common.everyDay}
                </span>
              </div>
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
              Crafted with <span className="text-rose-500 animate-pulse">❤️</span> for better mobile experiences.
            </p>
          </div>
          
          <div className="flex gap-8 text-sm font-black text-slate-500 uppercase tracking-widest">
            <Link href="/terms" className="hover:text-blue-500 cursor-pointer transition-colors flex items-center gap-2 group">
              {t.common.terms}
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link href="/cookies" className="hover:text-blue-500 cursor-pointer transition-colors flex items-center gap-2 group">
              {t.common.cookies}
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link href="/privacy" className="hover:text-blue-500 cursor-pointer transition-colors flex items-center gap-2 group">
              {t.common.privacy}
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
