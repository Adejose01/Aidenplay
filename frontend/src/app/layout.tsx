import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { SettingsProvider } from "@/context/SettingsContext";
import CartSidebar from "@/components/CartSidebar";
import WhatsAppFloating from "@/components/WhatsAppFloating";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Aiden Play | Catálogo de Juegos PS4, PS5 y Streaming",
    template: "%s | Aiden Play"
  },
  description: "La tienda líder en juegos digitales para PS4, PS5 y cuentas de streaming. Precios imbatibles en Argentina y República Dominicana. Entrega inmediata.",
  keywords: ["juegos ps4", "juegos ps5", "cuentas streaming", "ps plus barato", "juegos digitales", "aiden play", "netflix", "spotify"],
  authors: [{ name: "Aiden Play" }],
  metadataBase: new URL('https://aidenplay.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Aiden Play | Tu catálogo de juegos favoritos',
    description: 'Encuentra los mejores títulos de PlayStation y servicios de streaming al mejor precio.',
    url: 'https://aidenplay.com',
    siteName: 'Aiden Play',
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aiden Play | Juegos y Streaming',
    description: 'Precios increíbles en juegos digitales y cuentas.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${montserrat.variable} h-full antialiased`}
    >
      <head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-black text-white">
        <SettingsProvider>
          <CartProvider>
            {children}
            <CartSidebar />
            <WhatsAppFloating />
            <Toaster position="top-center" richColors />
          </CartProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
