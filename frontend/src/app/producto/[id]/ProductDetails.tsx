"use client";

import { useState, useMemo } from "react";
import type { Product } from "@/types";
import { getFileUrl, formatPrice } from "@/lib/pocketbase";
import AddToCartButton from "@/components/AddToCartButton";

interface ProductDetailsProps {
  variants: Product[];
  rates: { ars: number; rd: number };
  baseProduct: Product;
}

export default function ProductDetails({ variants, rates, baseProduct }: ProductDetailsProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<'ARS' | 'RD'>('ARS');
  
  // Extraer opciones únicas
  const availablePlatforms = useMemo(() => {
    const platforms = new Set<string>();
    variants.forEach(v => platforms.add(v.category));
    return Array.from(platforms);
  }, [variants]);

  const availableAccountTypes = useMemo(() => {
    const accounts = new Set<string>();
    variants.forEach(v => accounts.add(v.account_type));
    return Array.from(accounts);
  }, [variants]);

  // Estados seleccionados inicializados con la plataforma/cuenta de un producto existente (o el base)
  const [selectedPlatform, setSelectedPlatform] = useState<string>(baseProduct.category);
  // Si la plataforma seleccionada no tiene el account_type del baseProduct, seleccionar el primero disponible
  const [selectedAccountType, setSelectedAccountType] = useState<string>(baseProduct.account_type);

  // Encontrar la variante exacta
  const currentVariant = useMemo(() => {
    return variants.find(v => v.category === selectedPlatform && v.account_type === selectedAccountType) || null;
  }, [variants, selectedPlatform, selectedAccountType]);

  // Calcular precios
  const usdPrice = currentVariant?.price_usd || 0;
  const priceARS = Math.round(usdPrice * rates.ars);
  const priceRD = Math.round(usdPrice * rates.rd);
  const currentPrice = selectedCurrency === 'ARS' ? priceARS : priceRD;
  const currentSymbol = selectedCurrency === 'ARS' ? 'AR$' : 'RD$';

  const imageUrl = getFileUrl(baseProduct, "cover_image");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-dark-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col md:flex-row">
        
        {/* Imagen del Producto */}
        <div className="md:w-1/2 relative bg-black aspect-[4/3] md:aspect-auto">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={baseProduct.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl opacity-20">🎮</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        </div>

        {/* Detalles del Producto */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
          <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-4">
            {baseProduct.title}
          </h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            {baseProduct.description}
          </p>

          <div className="space-y-6 flex-grow">
            {/* Selector de Plataforma */}
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Plataforma</label>
              <div className="flex flex-wrap gap-3">
                {availablePlatforms.map(platform => (
                  <button
                    key={platform}
                    onClick={() => setSelectedPlatform(platform)}
                    className={`px-6 py-3 rounded-xl font-bold uppercase text-sm transition-all border ${
                      selectedPlatform === platform 
                        ? 'bg-neon-blue text-black border-neon-blue shadow-[0_0_15px_rgba(0,242,255,0.4)]' 
                        : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/30'
                    }`}
                  >
                    {platform.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de Tipo de Licencia */}
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Tipo de Licencia</label>
              <div className="flex flex-wrap gap-3">
                {availableAccountTypes.map(account => {
                  const exists = variants.some(v => v.category === selectedPlatform && v.account_type === account);
                  return (
                    <button
                      key={account}
                      onClick={() => setSelectedAccountType(account)}
                      disabled={!exists}
                      className={`px-6 py-3 rounded-xl font-bold text-sm transition-all border ${
                        selectedAccountType === account && exists
                          ? 'bg-neon-purple text-white border-neon-purple shadow-[0_0_15px_rgba(188,19,254,0.4)]' 
                          : !exists
                            ? 'bg-black/50 text-gray-600 border-white/5 cursor-not-allowed opacity-50 relative overflow-hidden'
                            : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/30'
                      }`}
                    >
                      {account}
                      {!exists && (
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgoJPHJlY3Qgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0ibm9uZSI+PC9yZWN0PgoJPHBhdGggZD0iTTAgMEw4IDhaTTAgOEw4IDBaIiBzdHJva2U9IiM0NDQiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-30"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10">
            {/* Contenedor de Precio y Compra */}
            {currentVariant ? (
              <div className="space-y-6">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-gray-400 uppercase font-bold tracking-widest mb-1">Precio Final</p>
                    <div className="flex items-center gap-3">
                      <span className="text-4xl md:text-5xl font-black text-white">{currentSymbol} {formatPrice(currentPrice)}</span>
                    </div>
                  </div>
                  
                  {/* Selector rápido de moneda */}
                  <div className="flex bg-black/40 p-1 rounded-lg">
                    <button 
                      onClick={() => setSelectedCurrency('ARS')}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${selectedCurrency === 'ARS' ? 'bg-neon-blue text-black shadow-[0_0_10px_rgba(0,242,255,0.4)]' : 'text-gray-500 hover:text-white'}`}
                    >
                      ARS
                    </button>
                    <button 
                      onClick={() => setSelectedCurrency('RD')}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${selectedCurrency === 'RD' ? 'bg-neon-purple text-white shadow-[0_0_10px_rgba(188,19,254,0.4)]' : 'text-gray-500 hover:text-white'}`}
                    >
                      RD$
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <AddToCartButton product={currentVariant} calculatedArs={priceARS} calculatedRd={priceRD} />
                  <a
                    href={`https://wa.me/18091234567?text=Hola! Quiero comprar ${currentVariant.title} (${currentVariant.category} - ${currentVariant.account_type}) por ${currentSymbol} ${formatPrice(currentPrice)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp w-full font-bold py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    Compra Rápida
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
                <p className="text-red-400 font-bold text-lg mb-1">Combinación No Disponible</p>
                <p className="text-red-400/70 text-sm">Esta versión está agotada temporalmente.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
