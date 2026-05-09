"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, Eye } from "lucide-react";
import type { Product } from "@/types";
import { CATEGORY_COLORS } from "@/types";
import { getFileUrl, formatPrice, buildWhatsAppLink } from "@/lib/pocketbase";
import AddToCartButton from "./AddToCartButton";
import { useSettings } from "@/context/SettingsContext";

interface ProductCardProps {
  product: Product;
  rates?: { ars: number; rd: number };
}

export default function ProductCard({ product, rates }: ProductCardProps) {
  const { settings, region: detectedRegion, whatsappNumber } = useSettings();
  const [selectedCurrency, setSelectedCurrency] = useState<'ARS' | 'RD' | null>(null);

  // Auto-seleccionar moneda según región detectada
  useEffect(() => {
    if (detectedRegion && !selectedCurrency) {
      setSelectedCurrency(detectedRegion === 'AR' ? 'ARS' : 'RD');
    }
  }, [detectedRegion, selectedCurrency]);
  
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
    selectedCurrency || 'ARS',
    product.category,
    product.account_type,
    selectedCurrency === 'ARS' ? (settings?.whatsapp_ar || whatsappNumber) : (settings?.whatsapp_rd || whatsappNumber)
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
      <Link href={`/producto/${product.id}`} className="aspect-[4/5] sm:aspect-square bg-white/5 relative overflow-hidden block">
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
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        {/* Título */}
        <Link href={`/producto/${product.id}`}>
          <h3 className="font-display font-bold text-[13px] sm:text-lg leading-tight mb-1 text-white group-hover/card:text-neon-blue transition-colors uppercase italic cursor-pointer line-clamp-2">
            {product.title}
          </h3>
        </Link>

        {/* Descripción corta */}
        <p className="text-gray-400 text-[10px] sm:text-xs mb-3 sm:mb-4 line-clamp-1 font-medium">
          {product.description}
        </p>

        {/* Bloque de precios */}
        <div className="mb-3 sm:mb-4 min-h-[80px] sm:min-h-[90px] flex flex-col justify-center">
          {selectedCurrency === null ? (
            <button
              onClick={() => setSelectedCurrency('ARS')}
              className="w-full py-2.5 sm:py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-black text-[9px] sm:text-[10px] uppercase tracking-wider sm:tracking-[0.2em] transition-all"
            >
              Ver Precio
            </button>
          ) : (
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-2 sm:p-3 border border-white/5 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex bg-white/5 p-1 rounded-lg mb-2 sm:mb-3">
                <button 
                  onClick={() => setSelectedCurrency('ARS')}
                  className={`flex-1 py-1.5 sm:py-2 rounded-md text-[8px] sm:text-[9px] font-black uppercase transition-all ${selectedCurrency === 'ARS' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                >
                  ARG
                </button>
                <button 
                  onClick={() => setSelectedCurrency('RD')}
                  className={`flex-1 py-1.5 sm:py-2 rounded-md text-[8px] sm:text-[9px] font-black uppercase transition-all ${selectedCurrency === 'RD' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                >
                  RD
                </button>
              </div>

              <div className="flex justify-between items-center px-0.5 sm:px-1">
                <span className="font-black text-sm sm:text-xl text-white tracking-tighter">
                  {currentSymbol} {formatPrice(currentPrice)}
                </span>
                <button 
                  onClick={() => setSelectedCurrency(null)}
                  className="text-[8px] sm:text-[10px] text-gray-500 hover:text-white uppercase font-black transition-colors"
                >
                  X
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="mt-auto flex flex-col gap-2">
          <AddToCartButton product={product} calculatedArs={priceARS} calculatedRd={priceRD} />

          {selectedCurrency && (
            <button
              onClick={() => {
                window.open(whatsAppUrl, "_blank");
              }}
              className="w-full font-black py-2.5 sm:py-3.5 rounded-xl text-[9px] sm:text-xs bg-[#25D366] text-white hover:bg-[#128C7E] transition-all flex items-center justify-center gap-2 uppercase tracking-tight sm:tracking-widest shadow-lg shadow-[#25D366]/20 group"
            >
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 fill-white group-hover:animate-pulse" />
              Comprar por WhatsApp
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
