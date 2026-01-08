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
    default: "IMOBILE - Expert Mobile Phone Repair",
    template: "%s | IMOBILE"
  },
  description: "Fast, reliable, and affordable mobile phone repair services for all major brands. Screen replacement, battery repair, and more.",
  keywords: ["mobile repair", "phone repair", "screen replacement", "battery replacement", "iPhone repair", "Samsung repair"],
  authors: [{ name: "IMOBILE Team" }],
  creator: "IMOBILE",
  publisher: "IMOBILE",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://imobile.com",
    siteName: "IMOBILE",
    title: "IMOBILE - Expert Mobile Phone Repair",
    description: "Fast, reliable, and affordable mobile phone repair services.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "IMOBILE Repair Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IMOBILE - Expert Mobile Phone Repair",
    description: "Fast, reliable, and affordable mobile phone repair services.",
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
    "name": "IMOBILE",
    "image": "https://imobile.com/og-image.jpg",
    "@id": "https://imobile.com",
    "url": "https://imobile.com",
    "telephone": "+351913709717",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Avenida Almirante Reies 102",
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
        "Friday"
      ],
      "opens": "09:00",
      "closes": "19:00"
    },
    "sameAs": [
      "https://facebook.com/imobile",
      "https://instagram.com/imobile"
    ]
  };

  return (
    <html lang="en">
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
