"use client";

import { useLanguage } from '@/context/LanguageContext';

export default function PrivacyPage() {
  const { t, language } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <section className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            {t.legal.privacyTitle}
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
                <h2 className="text-3xl font-bold text-slate-900 mb-4">1. Who we are</h2>
                <p className="text-slate-600 leading-relaxed">
                  This website is operated by {t.common.shopName}. This Privacy Policy explains how we collect, use, and protect your personal data.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">2. Data we collect</h2>
                <ul className="list-disc pl-6 space-y-2 text-slate-600">
                  <li>Contact details you submit (name, email, phone, address).</li>
                  <li>Device and service information you provide (model, issue description, quote request details).</li>
                  <li>Order information (items, totals, status) for purchases you make.</li>
                  <li>Basic technical data (e.g., cookies and local storage preferences such as language and cart).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">3. How we use your data</h2>
                <ul className="list-disc pl-6 space-y-2 text-slate-600">
                  <li>To respond to messages and provide quotes.</li>
                  <li>To process orders and communicate about your purchase.</li>
                  <li>To provide and improve our services and website functionality.</li>
                  <li>To comply with legal obligations.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">4. Sharing your data</h2>
                <p className="text-slate-600 leading-relaxed">
                  We only share personal data when necessary to operate the website and deliver services, such as payment processing or email delivery, or when required by law.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">5. Data retention</h2>
                <p className="text-slate-600 leading-relaxed">
                  We retain personal data only as long as needed for the purposes described above, or as required by applicable law.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">6. Your rights</h2>
                <p className="text-slate-600 leading-relaxed">
                  Depending on your location, you may have rights to access, correct, delete, or restrict the processing of your personal data.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">7. Contact</h2>
                <p className="text-slate-600 leading-relaxed">
                  For privacy-related questions or requests, contact us at{' '}
                  <a href={`mailto:${t.common.email}`} className="text-blue-600 hover:underline">{t.common.email}</a>.
                </p>
              </section>
            </div>
          ) : (
            <div className="space-y-8">
              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">1. Quem somos</h2>
                <p className="text-slate-600 leading-relaxed">
                  Este website é operado pela {t.common.shopName}. Esta Política de Privacidade explica como recolhemos, utilizamos e protegemos os seus dados pessoais.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">2. Dados que recolhemos</h2>
                <ul className="list-disc pl-6 space-y-2 text-slate-600">
                  <li>Dados de contacto que submete (nome, email, telemóvel, morada).</li>
                  <li>Informação do dispositivo e serviço (modelo, descrição do problema, detalhes do pedido de orçamento).</li>
                  <li>Informação de encomenda (itens, total, estado) para compras efetuadas.</li>
                  <li>Dados técnicos básicos (ex: cookies e preferências em armazenamento local como idioma e carrinho).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">3. Como usamos os seus dados</h2>
                <ul className="list-disc pl-6 space-y-2 text-slate-600">
                  <li>Para responder a mensagens e fornecer orçamentos.</li>
                  <li>Para processar encomendas e comunicar sobre a sua compra.</li>
                  <li>Para disponibilizar e melhorar os nossos serviços e funcionalidades do website.</li>
                  <li>Para cumprir obrigações legais.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">4. Partilha de dados</h2>
                <p className="text-slate-600 leading-relaxed">
                  Apenas partilhamos dados pessoais quando necessário para operar o website e prestar serviços, como processamento de pagamentos ou envio de email, ou quando exigido por lei.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">5. Retenção de dados</h2>
                <p className="text-slate-600 leading-relaxed">
                  Conservamos os dados pessoais apenas pelo tempo necessário para os fins descritos acima, ou conforme exigido pela legislação aplicável.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">6. Os seus direitos</h2>
                <p className="text-slate-600 leading-relaxed">
                  Dependendo da sua localização, poderá ter direitos de acesso, retificação, eliminação ou limitação do tratamento dos seus dados pessoais.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">7. Contacto</h2>
                <p className="text-slate-600 leading-relaxed">
                  Para questões ou pedidos relacionados com privacidade, contacte-nos através de{' '}
                  <a href={`mailto:${t.common.email}`} className="text-blue-600 hover:underline">{t.common.email}</a>.
                </p>
              </section>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

