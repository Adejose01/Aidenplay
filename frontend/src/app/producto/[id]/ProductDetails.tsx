"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Zap, ArrowLeft } from "lucide-react";
import type { Product } from "@/types";
import { getFileUrl, formatPrice, buildWhatsAppLink } from "@/lib/pocketbase";
import AddToCartButton from "@/components/AddToCartButton";
import { motion } from "framer-motion";
import { useSettings } from "@/context/SettingsContext";

interface ProductDetailsProps {
  variants: Product[];
  rates: { ars: number; rd: number };
  baseProduct: Product;
}

export default function ProductDetails({ variants, rates, baseProduct }: ProductDetailsProps) {
  const router = useRouter();
  const { settings, country, whatsappNumber, loading } = useSettings();

  // 1. Extraer opciones únicas de las variantes
  const availablePlatforms = useMemo(() => {
    const platforms = ["PS4", "PS5", "NINTENDO"].filter(p => variants.some(v => v.category === p));
    return platforms;
  }, [variants]);

  const availableAccountTypes = useMemo(() => {
    const types = ["Primaria", "Secundaria"].filter(t => variants.some(v => v.account_type === t));
    return types;
  }, [variants]);

  // 2. Estados de selección (re-añadidos los faltantes)
  const [selectedPlatform, setSelectedPlatform] = useState<string>(baseProduct.category);
  const [selectedAccountType, setSelectedAccountType] = useState<string>(baseProduct.account_type);

  // 3. LÓGICA DE AUTO-SELECCIÓN: Si cambio de plataforma y la licencia no existe, busco la primera disponible
  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
    const exists = variants.some(v => v.category === platform && v.account_type === selectedAccountType);
    if (!exists) {
      const firstAvailable = variants.find(v => v.category === platform);
      if (firstAvailable) {
        setSelectedAccountType(firstAvailable.account_type);
      }
    }
  };

  // 4. Estado Derivado: Producto Exacto
  const currentVariant = useMemo(() => {
    return variants.find(v => v.category === selectedPlatform && v.account_type === selectedAccountType) || null;
  }, [variants, selectedPlatform, selectedAccountType]);

  const isNintendo = selectedPlatform === "NINTENDO";

  // 5. Precios dinámicos (Priorizar precio directo de la DB si existe)
  const currentPrice = useMemo(() => {
    if (!currentVariant) return 0;
    
    if (country === 'AR') {
      return currentVariant.price_ar > 0 
        ? currentVariant.price_ar 
        : Math.round((currentVariant.price_usd || 0) * rates.ars);
    } else if (country === 'DO') {
      return currentVariant.price_rd > 0 
        ? currentVariant.price_rd 
        : Math.round((currentVariant.price_usd || 0) * rates.rd);
    } else {
      return currentVariant.price_usd || 0;
    }
  }, [currentVariant, country, rates]);

  const currentSymbol = country === 'AR' ? 'AR$' : country === 'DO' ? 'RD$' : 'US$';
  const currentCurrency = country === 'AR' ? 'ARS' : country === 'DO' ? 'RD' : 'USD';

  const priceARS = currentVariant?.price_ar || Math.round((currentVariant?.price_usd || 0) * rates.ars);
  const priceRD = currentVariant?.price_rd || Math.round((currentVariant?.price_usd || 0) * rates.rd);

  const imageUrl = getFileUrl(baseProduct, "cover_image");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Botón Volver */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="font-black uppercase text-[9px] tracking-widest">Volver al catálogo</span>
      </motion.button>

      <div className="bg-dark-card/40 backdrop-blur-3xl rounded-[32px] border border-white/5 overflow-hidden shadow-2xl flex flex-col md:flex-row">
        
        {/* Imagen */}
        <div className="md:w-[45%] relative bg-black aspect-square md:aspect-auto min-h-[400px]">
          {imageUrl ? (
            <Image 
              src={imageUrl} 
              alt={baseProduct.title} 
              fill
              priority
              unoptimized={true}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl opacity-10">🎮</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          {isNintendo && (
            <div className="absolute top-5 left-5 z-20">
              <span className="bg-[#E60012] text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-full shadow-lg shadow-[#E60012]/40 tracking-widest">
                Nintendo Switch
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="md:w-[55%] p-8 md:p-12 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-3 leading-tight tracking-tight uppercase">
              {baseProduct.title}
            </h1>
            <div className="text-gray-400 text-xs md:text-sm mb-8 leading-relaxed font-medium max-w-md max-h-40 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent whitespace-pre-wrap">
              {baseProduct.description}
            </div>

            {/* Selectores */}
            <div className="space-y-6 mb-10">
              {/* Plataforma */}
              {availablePlatforms.length > 1 && (
                <div>
                  <label className="block text-[8px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Selecciona Consola</label>
                  <div className="flex flex-wrap gap-3">
                    {availablePlatforms.map(platform => (
                      <button
                        key={platform}
                        onClick={() => handlePlatformChange(platform)}
                        className={`px-6 py-3 rounded-xl font-black uppercase text-[10px] transition-all duration-300 border ${
                          selectedPlatform === platform 
                            ? 'bg-neon-blue text-black border-neon-blue shadow-[0_0_15px_rgba(0,242,255,0.3)]' 
                            : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10'
                        }`}
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Licencia */}
              <div>
                <label className="block text-[8px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Configuración de Cuenta</label>
                <div className="flex flex-wrap gap-3">
                  {availableAccountTypes.map(account => {
                    const exists = variants.some(v => v.category === selectedPlatform && v.account_type === account);
                    const isActive = selectedAccountType === account;
                    
                    return (
                      <button
                        key={account}
                        onClick={() => exists && setSelectedAccountType(account)}
                        disabled={!exists}
                        className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase transition-all duration-300 border relative overflow-hidden ${
                          isActive && exists
                            ? (isNintendo 
                                ? 'bg-[#E60012] text-white border-[#E60012] shadow-[0_0_15px_rgba(230,0,18,0.3)]' 
                                : 'bg-neon-purple text-white border-neon-purple shadow-[0_0_15px_rgba(188,19,254,0.3)]')
                            : !exists
                              ? 'bg-white/5 text-gray-800 border-white/5 cursor-not-allowed opacity-30'
                              : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10'
                        }`}
                      >
                        {account}
                        {!exists && (
                          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(255,255,255,0.02)_5px,rgba(255,255,255,0.02)_10px)]"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Precio */}
            <div className="pt-8 border-t border-white/5">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{currentSymbol}</span>
                  {loading ? (
                    <div className="animate-pulse bg-white/10 h-10 w-32 rounded-xl"></div>
                  ) : (
                    <span className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                      {currentVariant ? formatPrice(currentPrice) : "---"}
                    </span>
                  )}
                </div>
              </div>

              {/* Botones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentVariant ? (
                  <>
                    <AddToCartButton product={currentVariant} calculatedArs={priceARS} calculatedRd={priceRD} />
                    {!loading && (
                      <motion.a
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href={buildWhatsAppLink(
                          currentVariant.title,
                          currentPrice,
                          currentCurrency,
                          currentVariant.category,
                          currentVariant.account_type,
                          whatsappNumber
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#25D366] hover:bg-[#128C7E] text-white font-black py-4 rounded-xl text-[10px] transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg shadow-[#25D366]/20"
                      >
                        <Zap className="w-4 h-4 fill-white" />
                        Compra Rápida
                      </motion.a>
                    )}
                  </>
                ) : (
                  <div className="col-span-2 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                    <p className="text-red-500 font-black text-xs uppercase">No disponible para esta selección</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
