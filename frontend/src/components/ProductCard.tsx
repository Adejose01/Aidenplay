"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, Eye } from "lucide-react";
import type { Product } from "@/types";
import { getFileUrl, formatPrice, buildWhatsAppLink } from "@/lib/pocketbase";
import AddToCartButton from "./AddToCartButton";

/**
 * Mapeo de categorías a colores de badge.
 */
const CATEGORY_COLORS: Record<Product["category"], string> = {
  PS4: "bg-[#003791]",
  PS5: "bg-[#0072CE]",
  PS_PLUS: "bg-yellow-600",
  STREAMING: "bg-pink-600",
};

interface ProductCardProps {
  product: Product;
  rates?: { ars: number; rd: number };
}

export default function ProductCard({ product, rates }: ProductCardProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<'ARS' | 'RD' | null>(null);
  
  const currentRates = rates || { ars: 1415, rd: 58 };
  const imageUrl = getFileUrl(product, "cover_image", { thumb: "400x300" });
  
  // Cálculo dinámico basado en precio USD y tasas
  const usdPrice = product.price_usd || 0;
  const priceARS = Math.round(usdPrice * currentRates.ars);
  const priceRD = Math.round(usdPrice * currentRates.rd);

  const currentPrice = selectedCurrency === 'ARS' ? priceARS : selectedCurrency === 'RD' ? priceRD : 0;
  const currentSymbol = selectedCurrency === 'ARS' ? 'AR$' : 'RD$';

  const whatsAppUrl = buildWhatsAppLink(
    product.title,
    currentPrice,
    selectedCurrency || 'ARS'
  );

  return (
    <article className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 flex flex-col h-full shadow-lg group/card transition-all hover:border-white/20">
      {/* Badge de categoría */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
        <span
          className={`${CATEGORY_COLORS[product.category]} text-white text-[10px] font-black px-2.5 py-1 rounded shadow-sm uppercase tracking-wider`}
        >
          {product.category.replace("_", " ")}
        </span>
      </div>

      {/* Imagen de portada */}
      <Link href={`/producto/${product.id}`} className="aspect-square bg-white/5 relative overflow-hidden block">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            priority
            unoptimized={true}
            className="object-cover group-hover/card:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl opacity-20">🎮</span>
          </div>
        )}

        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

        {/* Preview Indicator */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-30">
          <div className="bg-neon-blue text-black p-3 rounded-full shadow-[0_0_20px_rgba(0,242,255,0.5)]">
            <Eye className="w-6 h-6" />
          </div>
        </div>

        {/* Badge de tipo de cuenta */}
        <div className="absolute bottom-3 left-3 z-20">
          <span className="bg-white/90 backdrop-blur-sm text-black text-[10px] font-black uppercase px-2 py-1 rounded">
            {product.account_type}
          </span>
        </div>
      </Link>

      {/* Contenido */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Título */}
        <Link href={`/producto/${product.id}`}>
          <h3 className="font-display font-bold text-lg leading-tight mb-1 text-white group-hover/card:text-neon-blue transition-colors uppercase italic cursor-pointer">
            {product.title}
          </h3>
        </Link>

        {/* Descripción corta */}
        <p className="text-gray-400 text-xs mb-4 line-clamp-1 font-medium">
          {product.description}
        </p>

        {/* Bloque de precios */}
        <div className="mb-4 min-h-[90px] flex flex-col justify-center">
          {selectedCurrency === null ? (
            <button
              onClick={() => setSelectedCurrency('ARS')}
              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all"
            >
              Ver Precio
            </button>
          ) : (
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/5 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex bg-white/5 p-1 rounded-lg mb-3">
                <button 
                  onClick={() => setSelectedCurrency('ARS')}
                  className={`flex-1 py-2 rounded-md text-[9px] font-black uppercase transition-all ${selectedCurrency === 'ARS' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                >
                  Argentina
                </button>
                <button 
                  onClick={() => setSelectedCurrency('RD')}
                  className={`flex-1 py-2 rounded-md text-[9px] font-black uppercase transition-all ${selectedCurrency === 'RD' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                >
                  Rep. Dom
                </button>
              </div>

              <div className="flex justify-between items-center px-1">
                <span className="font-black text-xl text-white tracking-tighter">
                  {currentSymbol} {formatPrice(currentPrice)}
                </span>
                <button 
                  onClick={() => setSelectedCurrency(null)}
                  className="text-[10px] text-gray-500 hover:text-white uppercase font-black transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="mt-auto flex flex-col gap-2">
          <AddToCartButton product={product} calculatedArs={priceARS} calculatedRd={priceRD} />

          <button
            onClick={() => {
              if (selectedCurrency) {
                window.open(whatsAppUrl, "_blank");
              } else {
                setSelectedCurrency('ARS'); // Default or just show the selector
              }
            }}
            className={`w-full font-black py-3.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg group ${
              selectedCurrency 
                ? 'bg-[#25D366] text-white hover:bg-[#128C7E] shadow-[#25D366]/20' 
                : 'bg-white/5 text-gray-500 hover:bg-white/10 border border-white/10'
            }`}
          >
            <Zap className={`w-4 h-4 ${selectedCurrency ? 'fill-white group-hover:animate-pulse' : 'fill-gray-600'}`} />
            {selectedCurrency ? 'Compra Rápida' : 'Selecciona Región p/ Comprar'}
          </button>
        </div>
      </div>
    </article>
  );
}
