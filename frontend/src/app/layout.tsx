import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartSidebar from "@/components/CartSidebar";

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
  title: "Aiden Play | Videojuegos Digitales y Streaming",
  description:
    "Tu tienda digital de videojuegos PS4, PS5, suscripciones PS Plus y cuentas de streaming. Los mejores precios en Pesos Argentinos y Dominicanos. Servicio rápido y confiable.",
  keywords: [
    "videojuegos digitales",
    "PS4",
    "PS5",
    "PS Plus",
    "streaming",
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
      <body className="min-h-full flex flex-col">
        <CartProvider>
          {children}
          <CartSidebar />
        </CartProvider>
      </body>
    </html>
  );
}
