import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Palermo Café | Más de 50 años de tradición y sabor",
    template: "%s | Palermo Café",
  },
  description:
    "Descubre los mejores sándwiches artesanales del Perú. Más de 50 años uniendo amigos con tradición y sabor. Visítanos en Balconcillo, Benavides, San Borja o El Polo.",
  keywords: [
    "sándwich peruano",
    "cafetería Lima",
    "Palermo Café",
    "sándwich de chicharrón",
    "sándwich de jamón",
    "comida peruana",
    "sándwiches artesanales",
    "La Victoria",
    "Miraflores",
    "San Borja",
    "Santiago de Surco",
  ],
  authors: [{ name: "Palermo Café" }],
  creator: "Palermo Café",
  publisher: "Palermo Café",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://palermocafe.pe"),
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "https://palermocafe.pe",
    siteName: "Palermo Café",
    title: "Palermo Café | Más de 50 años de tradición y sabor",
    description:
      "Los mejores sándwiches artesanales del Perú. Tradición desde 1974.",
    images: [
      {
        url: "/logo-palermo.webp",
        width: 1200,
        height: 630,
        alt: "Palermo Café - Sándwiches artesanales peruanos desde 1974",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Palermo Café | Más de 50 años de tradición y sabor",
    description:
      "Los mejores sándwiches artesanales del Perú. Tradición desde 1974.",
    images: ["/logo-palermo.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://palermocafe.pe",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon-64x64.png" type="image/png" sizes="64x64" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/favicon-96x96.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
