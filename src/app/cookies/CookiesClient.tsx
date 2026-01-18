"use client";

import { useLanguage } from '@/context/LanguageContext';

export default function CookiesPage() {
  const { t, language } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <section className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            {t.legal.cookiesTitle}
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
                <h2 className="text-3xl font-bold text-slate-900 mb-4">What are Cookies?</h2>
                <p className="text-slate-600 leading-relaxed">
                  Cookies are small text files that are stored on your computer or mobile device when you visit a website. 
                  They are widely used to make websites work or work more efficiently, as well as to provide information to the owners of the site.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">How we use Cookies</h2>
                <p className="text-slate-600 leading-relaxed">
                  We use cookies for several reasons:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600">
                  <li><strong>Essential Cookies:</strong> Necessary for the website to function correctly (e.g., shopping cart, language preference).</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website.</li>
                  <li><strong>Functional Cookies:</strong> Remember choices you make to provide a more personalized experience.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Your Choices</h2>
                <p className="text-slate-600 leading-relaxed">
                  You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. 
                  Please note that declining cookies may prevent you from taking full advantage of the website.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Contact Us</h2>
                <p className="text-slate-600 leading-relaxed">
                  If you have any questions about our use of cookies, please contact us at <a href={`mailto:${t.common.email}`} className="text-blue-600 hover:underline">{t.common.email}</a>.
                </p>
              </section>
            </div>
          ) : (
            <div className="space-y-8">
              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">O que são Cookies?</h2>
                <p className="text-slate-600 leading-relaxed">
                  Cookies são pequenos ficheiros de texto que são armazenados no seu computador ou dispositivo móvel quando visita um website. 
                  São amplamente utilizados para fazer os websites funcionarem ou funcionarem de forma mais eficiente, bem como para fornecer informações aos proprietários do site.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Como usamos os Cookies</h2>
                <p className="text-slate-600 leading-relaxed">
                  Utilizamos cookies por vários motivos:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600">
                  <li><strong>Cookies Essenciais:</strong> Necessários para que o website funcione corretamente (ex: carrinho de compras, preferência de idioma).</li>
                  <li><strong>Cookies de Análise:</strong> Ajudam-nos a entender como os visitantes interagem com o nosso website.</li>
                  <li><strong>Cookies Funcionais:</strong> Lembram-se das escolhas que faz para proporcionar uma experiência mais personalizada.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">As Suas Escolhas</h2>
                <p className="text-slate-600 leading-relaxed">
                  Pode optar por aceitar ou recusar cookies. A maioria dos navegadores web aceita automaticamente cookies, mas normalmente pode modificar as definições do seu navegador para recusar cookies, se preferir. 
                  Note que a recusa de cookies pode impedi-lo de tirar o máximo partido do website.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Contacte-nos</h2>
                <p className="text-slate-600 leading-relaxed">
                  Se tiver alguma dúvida sobre a nossa utilização de cookies, contacte-nos através de <a href={`mailto:${t.common.email}`} className="text-blue-600 hover:underline">{t.common.email}</a>.
                </p>
              </section>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
