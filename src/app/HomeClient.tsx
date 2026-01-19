"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { ArrowRight, Zap, ShieldCheck, Banknote, Facebook, Youtube, Phone } from "lucide-react";

export default function HomeClient() {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: t.home.fastTurnaround,
      desc: t.home.fastTurnaroundDesc,
      color: "blue"
    },
    {
      icon: <ShieldCheck className="h-8 w-8" />,
      title: t.home.qualityParts,
      desc: t.home.qualityPartsDesc,
      color: "emerald"
    },
    {
      icon: <Banknote className="h-8 w-8" />,
      title: t.home.bestPrices,
      desc: t.home.bestPricesDesc,
      color: "amber"
    }
  ];


  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <section className="relative min-h-[80vh] sm:min-h-[90vh] flex items-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/25 rounded-full blur-[120px]"
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, delay: 4 }}
            className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/25 rounded-full blur-[120px]"
          />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left space-y-8"
            >
              <div className="flex items-center gap-4">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white leading-tight">
                  {t.home.heroTitle.split(' ').slice(0, -1).join(' ')}{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                    {t.home.heroTitle.split(' ').pop()}
                  </span>
                </h1>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl text-slate-300 max-w-xl leading-relaxed">
                {t.home.heroSubtitle}
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="/get-quote"
                  className="px-6 py-3 sm:px-8 sm:py-4 bg-emerald-500 text-white rounded-2xl font-bold text-base sm:text-lg hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/30 hover:-translate-y-1 flex items-center gap-2 group"
                >
                  {t.common.getQuote}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/services"
                  className="px-6 py-3 sm:px-8 sm:py-4 bg-white/10 text-white border border-white/20 rounded-2xl font-bold text-base sm:text-lg hover:bg-white/20 transition-all backdrop-blur-sm"
                >
                  {t.home.ourServices}
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-6">
                <span className="text-sm font-semibold text-slate-300">
                  Follow us:
                </span>
                <div className="flex gap-3">
                  <a
                    href="https://www.facebook.com/share/1AQkaD6UNM/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-slate-200 hover:bg-blue-600 hover:border-blue-500 hover:text-white transition-all"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href="https://www.tiktok.com/@imobiletertulia?_r=1&_t=ZG-939VWMvX1zE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-slate-200 hover:bg-blue-600 hover:border-blue-500 hover:text-white transition-all text-xs font-bold"
                    aria-label="TikTok"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.6-4.12-1.31a6.342 6.342 0 01-1.89-1.62v6.41c.01 2.53-.8 5.16-2.78 6.74-2.01 1.62-4.88 1.95-7.25 1.11-2.45-.88-4.41-3.26-4.66-5.88-.34-3.12 1.52-6.31 4.49-7.3 1.07-.37 2.21-.49 3.34-.35v4.03c-1.17-.18-2.43-.02-3.41.67-.93.65-1.36 1.83-1.18 2.94.12 1.14.97 2.14 2.04 2.53 1.1.4 2.41.22 3.3-.53.77-.63 1.15-1.66 1.13-2.67V.02z"/>
                    </svg>
                  </a>
                  <a
                    href="https://consent.youtube.com/m?continue=https%3A%2F%2Fwww.youtube.com%2F%40tertuliaumpulsiva%3Fsi%3DAX76rgo1O6zj_FwS%26cbrd%3D1&gl=PT&m=0&pc=yt&cm=2&hl=en&src=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-slate-200 hover:bg-blue-600 hover:border-blue-500 hover:text-white transition-all"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                  <a
                    href="https://wa.me/qr/5EEVLL7H46YGE1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-slate-200 hover:bg-blue-600 hover:border-blue-500 hover:text-white transition-all"
                    aria-label="WhatsApp"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: 3 }}
              transition={{ duration: 0.8 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 bg-gradient-to-tr from-slate-800 to-slate-700 p-2 rounded-[3rem] shadow-2xl border border-emerald-400/20 hover:rotate-0 transition-transform duration-500 overflow-hidden max-w-[420px] mx-auto">
                <Image
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6kZ6P-mf5e-FrkXf0ziW6U4uffKgKJfRyPQ&s"
                  alt="Professional Mobile Repair"
                  width={420}
                  height={400}
                  className="rounded-[2.5rem] w-full h-[400px] object-cover shadow-inner hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none"></div>
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-100"
                >
                  <div className="w-14 h-14 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/40">
                    <ShieldCheck className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">{t.common.status}</p>
                    <p className="text-slate-900 font-extrabold text-lg">{t.home.repairSuccess}</p>
                  </div>
                </motion.div>
              </div>
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-[120px] z-0 animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-[120px] z-0 animate-pulse delay-1000"></div>
            </motion.div>
          </div>
        </div>
      </section>



      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-4">
            <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-[0.3em]">{t.home.whyChooseUs}</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900">{t.home.experienceExcellence}</h3>
            <p className="text-lg sm:text-xl text-slate-500 leading-relaxed">{t.home.experienceExcellenceDesc}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 bg-white/80 backdrop-blur-sm rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h4>
                <p className="text-slate-500 leading-relaxed text-lg">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-[0.3em]">{t.home.whatWeRepair}</h2>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900">{t.home.comprehensiveSolutions}</h3>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:gap-3 transition-all text-lg"
            >
              {t.home.viewAllServices}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: t.home.screenRepair, icon: "📱", color: "blue" },
              { name: t.home.batteryReplacement, icon: "🔋", color: "emerald" },
              { name: t.home.waterDamage, icon: "💧", color: "cyan" },
              { name: t.home.chargingPort, icon: "🔌", color: "amber" }
            ].map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative group overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm border border-slate-100 p-8 hover:bg-white hover:shadow-xl transition-all duration-300"
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300 grayscale group-hover:grayscale-0">
                  {service.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">{service.name}</h4>
                <p className="text-slate-500 text-sm">{t.home.professionalRepair}</p>
                <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 w-0 group-hover:w-full transition-all duration-500"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-white px-4">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto relative rounded-[3rem] bg-gradient-to-r from-blue-700 via-slate-900 to-emerald-600 overflow-hidden p-8 sm:p-12 md:p-24"
        >
          <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-500/15 skew-x-12 translate-x-1/4"></div>
          <div className="relative z-10 text-center max-w-3xl mx-auto space-y-8">
            <h3 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white leading-tight">{t.home.readyToGetFixed}</h3>
            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed">
              {t.home.readyToGetFixedDesc}
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link
                href="/get-quote"
                className="px-8 py-4 sm:px-10 sm:py-5 bg-emerald-500 text-white rounded-2xl font-bold text-lg sm:text-xl hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/30 hover:-translate-y-1"
              >
                {t.home.getFreeQuoteNow}
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 sm:px-10 sm:py-5 bg-white/10 text-white border border-white/20 rounded-2xl font-bold text-lg sm:text-xl hover:bg-white/20 transition-all hover:-translate-y-1"
              >
                {t.home.contactUs}
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
