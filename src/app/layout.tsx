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
  metadataBase: new URL('https://imobile.com'),
  title: {
    default: "Tertulia Impulsiva - Reparação Profissional de Telemóveis",
    template: "%s | Tertulia Impulsiva"
  },
  description: "Serviços rápidos, fiáveis e acessíveis de reparação de telemóveis para todas as principais marcas. Substituição de ecrã, reparação de bateria e muito mais.",
  keywords: [
    "reparação de telemóveis",
    "reparação de telemóvel Lisboa",
    "substituição de ecrã",
    "troca de bateria",
    "reparação iPhone",
    "reparação Samsung"
  ],
  authors: [{ name: "Tertulia Impulsiva Team" }],
  creator: "Tertulia Impulsiva",
  publisher: "Tertulia Impulsiva",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: "https://imobile.com",
    siteName: "Tertulia Impulsiva",
    title: "Tertulia Impulsiva - Reparação Profissional de Telemóveis",
    description: "Serviços rápidos, fiáveis e acessíveis de reparação de telemóveis.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tertulia Impulsiva Repair Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tertulia Impulsiva - Reparação Profissional de Telemóveis",
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
    "name": "Tertulia Impulsiva",
    "image": "https://imobile.com/og-image.jpg",
    "@id": "https://imobile.com",
    "url": "https://imobile.com",
    "telephone": ["+351 913 709 717", "+351 938 210 334"],
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
      "https://facebook.com/imobile",
      "https://instagram.com/imobile"
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
