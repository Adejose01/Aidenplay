import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
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
    "Netflix",
    "Spotify",
    "cuentas digitales",
    "Aiden Play",
  ],
  openGraph: {
    title: "Aiden Play | Videojuegos Digitales y Streaming",
    description:
      "El mejor catálogo digital PS4 & PS5. Cuentas de streaming al mejor precio.",
    type: "website",
    locale: "es_AR",
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
        <CartProvider>
          {children}
          <CartSidebar />
          <WhatsAppFloating />
          <Toaster position="top-center" richColors />
        </CartProvider>
      </body>
    </html>
  );
}
