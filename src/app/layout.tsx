import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import ScrollToTop from "@/components/ScrollToTop";
import { CartProvider } from "@/context/CartContext";
import { DataProvider } from "@/context/DataContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://imobilept.com'),
  title: "Tertulia Umpulsiva",
  description: "Serviços rápidos, fiáveis e acessíveis de reparação de telemóveis para todas as principais marcas. Substituição de ecrã, reparação de bateria e muito mais.",
  keywords: [
    "reparação de telemóveis",
    "reparação de telemóvel Lisboa",
    "substituição de ecrã",
    "troca de bateria",
    "reparação iPhone",
    "reparação Samsung",
    "Tertulia Umpulsiva"
  ],
  authors: [{ name: "Tertulia Umpulsiva Team" }],
  creator: "Tertulia Umpulsiva",
  publisher: "Tertulia Umpulsiva",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-icon', type: 'image/png', sizes: '180x180' },
    ],
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: "https://imobilept.com",
    siteName: "Tertulia Umpulsiva",
    title: "Tertulia Umpulsiva - Reparação Profissional de Telemóveis",
    description: "Serviços rápidos, fiáveis e acessíveis de reparação de telemóveis.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tertulia Umpulsiva Repair Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tertulia Umpulsiva - Reparação Profissional de Telemóveis",
    description: "Serviços rápidos, fiáveis e acessíveis de reparação de telemóveis.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Tertulia Umpulsiva",
    "image": "https://imobilept.com/og-image.jpg",
    "@id": "https://imobilept.com",
    "url": "https://imobilept.com",
    "telephone": ["+351 913 709 717", "+351 935 911 908"],
    "taxID": "317822453",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Avenida Almirante Reies 102C",
      "addressLocality": "lisboa",
      "postalCode": "1150 022",
      "addressCountry": "PT"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 38.7223,
      "longitude": -9.1393
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "09:00",
      "closes": "21:00"
    },
    "sameAs": [
      "https://www.facebook.com/share/1AQkaD6UNM/",
      "https://www.tiktok.com/@imobiletertulia",
      "https://www.youtube.com/@tertuliaumpulsiva",
      "https://wa.me/qr/5EEVLL7H46YGE1"
    ]
  };

  return (
    <html lang="pt">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          <DataProvider>
            <CartProvider>
              <Navbar />
              <main className="min-h-screen">
                {children}
              </main>
              <Footer />
              <CookieConsent />
              <ScrollToTop />
              <Toaster position="top-center" richColors />
            </CartProvider>
          </DataProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
