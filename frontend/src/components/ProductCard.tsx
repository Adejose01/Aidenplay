"use client";

import { useState } from "react";
import type { Product } from "@/types";
import { getFileUrl, formatPrice, buildWhatsAppLink } from "@/lib/pocketbase";
import AddToCartButton from "./AddToCartButton";
import { motion } from "framer-motion";

/**
 * Mapeo de categorías a colores de badge.
 */
const CATEGORY_COLORS: Record<Product["category"], string> = {
  PS4: "bg-[#003791]",
  PS5: "bg-[#0072CE]",
  PS_PLUS: "bg-yellow-600",
  STREAMING: "bg-neon-pink",
};

/**
 * Mapeo de categorías a gradientes de fondo para la imagen.
 */
const CATEGORY_GRADIENTS: Record<Product["category"], string> = {
  PS4: "from-black to-blue-950",
  PS5: "from-black to-indigo-950",
  PS_PLUS: "from-black to-yellow-950",
  STREAMING: "from-black to-pink-950",
};

/**
 * Etiquetas legibles en español para el tipo de cuenta.
 */
const ACCOUNT_LABELS: Record<Product["account_type"], string> = {
  Primaria: "Cuenta Primaria",
  Secundaria: "Cuenta Secundaria",
  Suscripcion: "Suscripción Mensual",
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
    selectedCurrency === 'ARS' ? priceARS : 0,
    selectedCurrency === 'RD' ? priceRD : 0
  );

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
      className="bg-dark-card rounded-2xl overflow-hidden border border-white/5 flex flex-col h-full shadow-xl group/card relative hover:border-white/20 transition-all duration-300"
    >
      {/* Badge de categoría */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
        <span
          className={`${CATEGORY_COLORS[product.category]} text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg uppercase tracking-widest`}
        >
          {product.category.replace("_", " ")}
        </span>
      </div>

      {/* Imagen de portada */}
      <div className="aspect-[4/3] bg-dark-lighter relative overflow-hidden">
        {/* Gradiente de fondo como fallback */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_GRADIENTS[product.category]} z-0`}
        />

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700 opacity-80 group-hover/card:opacity-100 relative z-10"
          />
        ) : (
          /* Placeholder cuando no hay imagen */
          <div className="w-full h-full flex items-center justify-center relative z-10">
            <span className="text-5xl opacity-30">🎮</span>
          </div>
        )}

        {/* Gradiente inferior */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent z-10" />

        {/* Badge de tipo de cuenta */}
        <div className="absolute bottom-3 left-3 z-20">
          <span className="bg-white/90 backdrop-blur-sm text-black text-[9px] font-black uppercase px-2 py-1 rounded shadow-lg">
            {ACCOUNT_LABELS[product.account_type]}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Título */}
        <h3 className="font-display font-black text-xl leading-tight mb-2 text-white group-hover/card:text-neon-blue transition-colors">
          {product.title}
        </h3>

        {/* Descripción corta */}
        <p className="text-gray-500 text-xs mb-6 line-clamp-2 leading-relaxed font-medium">
          {product.description}
        </p>

        {/* Bloque de precios */}
        <div className="mb-6 min-h-[85px] flex flex-col justify-center">
          {selectedCurrency === null ? (
            <button
              onClick={() => setSelectedCurrency('ARS')}
              className="w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-white font-black text-xs uppercase tracking-[0.2em] transition-all"
            >
              Consultar Precio
            </button>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/5"
            >
              {/* Selector de Moneda */}
              <div className="flex bg-white/5 p-1 rounded-xl mb-4">
                <button 
                  onClick={() => setSelectedCurrency('ARS')}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${selectedCurrency === 'ARS' ? 'bg-neon-blue text-black shadow-[0_0_15px_rgba(0,242,255,0.4)]' : 'text-gray-500 hover:text-white'}`}
                >
                  ARS
                </button>
                <button 
                  onClick={() => setSelectedCurrency('RD')}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${selectedCurrency === 'RD' ? 'bg-neon-purple text-white shadow-[0_0_15px_rgba(188,19,254,0.4)]' : 'text-gray-500 hover:text-white'}`}
                >
                  RD$
                </button>
              </div>

              {/* Precio Mostrado */}
              <div className="flex justify-between items-center px-1">
                <span className="font-black text-2xl text-white tracking-tighter">
                  <span className="text-xs text-gray-500 mr-1 font-bold">{currentSymbol}</span>
                  {formatPrice(currentPrice)}
                </span>
                <button 
                  onClick={() => setSelectedCurrency(null)}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5 text-gray-500 hover:text-neon-pink hover:bg-white/10 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="mt-auto flex flex-col gap-3">
          <AddToCartButton product={product} calculatedArs={priceARS} calculatedRd={priceRD} />

          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-brand-card hover:bg-white/5 border border-white/5 text-white font-black py-3 rounded-xl text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn"
          >
            <span className="group-hover/btn:scale-110 transition-transform duration-300">⚡</span>
            Compra Rápida
          </a>
        </div>
      </div>
    </motion.article>
  );
}
