"use client";

import { useLanguage } from '@/context/LanguageContext';

export default function TermsPage() {
  const { t, language } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <section className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            {t.legal.termsTitle}
          </h1>
          <p className="text-slate-400">
            {t.legal.lastUpdated}: {new Date().toLocaleDateString(language === 'pt' ? 'pt-PT' : 'en-US')}
          </p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-slate prose-lg">
          {language === 'en' ? (
            <div className="space-y-8">
              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">1. Introduction</h2>
                <p className="text-slate-600 leading-relaxed">
                  Welcome to {t.common.shopName}. By accessing our website and using our services, you agree to comply with and be bound by the following terms and conditions.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">2. Services</h2>
                <p className="text-slate-600 leading-relaxed">
                  We provide mobile phone repair services and sell related accessories and devices. All repairs are subject to our warranty policy, which will be provided at the time of service.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">3. Privacy Policy</h2>
                <p className="text-slate-600 leading-relaxed">
                  Your use of our website is also governed by our Privacy Policy. Please review our Policy to understand how we collect and use your information in compliance with GDPR.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">4. Limitation of Liability</h2>
                <p className="text-slate-600 leading-relaxed">
                  {t.common.shopName} shall not be liable for any indirect, incidental, or consequential damages arising out of the use of our services or website.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">5. Governing Law</h2>
                <p className="text-slate-600 leading-relaxed">
                  These terms are governed by the laws of Portugal and the European Union.
                </p>
              </section>
            </div>
          ) : (
            <div className="space-y-8">
              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">1. Introdução</h2>
                <p className="text-slate-600 leading-relaxed">
                  Bem-vindo à {t.common.shopName}. Ao aceder ao nosso website e utilizar os nossos serviços, concorda em cumprir e ficar vinculado aos seguintes termos e condições.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">2. Serviços</h2>
                <p className="text-slate-600 leading-relaxed">
                  Fornecemos serviços de reparação de telemóveis e vendemos acessórios e dispositivos relacionados. Todas as reparações estão sujeitas à nossa política de garantia, que será fornecida no momento do serviço.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">3. Política de Privacidade</h2>
                <p className="text-slate-600 leading-relaxed">
                  A sua utilização do nosso website é também regida pela nossa Política de Privacidade. Por favor, reveja a nossa Política para compreender como recolhemos e utilizamos a sua informação em conformidade com o RGPD.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">4. Limitação de Responsabilidade</h2>
                <p className="text-slate-600 leading-relaxed">
                  A {t.common.shopName} não será responsável por quaisquer danos indiretos, incidentais ou consequentes resultantes da utilização dos nossos serviços ou website.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">5. Lei Aplicável</h2>
                <p className="text-slate-600 leading-relaxed">
                  Estes termos são regidos pelas leis de Portugal e da União Europeia.
                </p>
              </section>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
