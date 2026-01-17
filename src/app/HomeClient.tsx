"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { ArrowRight, Zap, ShieldCheck, Banknote } from "lucide-react";

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
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white leading-tight">
                {t.home.heroTitle.split(' ').slice(0, -1).join(' ')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">{t.home.heroTitle.split(' ').pop()}</span>
              </h1>
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
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: 3 }}
              transition={{ duration: 0.8 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 bg-gradient-to-tr from-slate-800 to-slate-700 p-2 rounded-[3rem] shadow-2xl border border-emerald-400/20 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT8fHdyWPAM1Ars1snZHE01-KEERrmI6OgiQ&s" 
                  alt="Repair Technician" 
                  className="rounded-[2.5rem] w-full h-auto shadow-inner"
                />
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-500/40">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">{t.common.status}</p>
                    <p className="text-slate-900 font-bold">{t.home.repairSuccess}</p>
                  </div>
                </motion.div>
              </div>
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-500/40 rounded-full blur-[100px] z-0"></div>
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
