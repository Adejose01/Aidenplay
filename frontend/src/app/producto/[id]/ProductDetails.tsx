"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Zap, ArrowLeft } from "lucide-react";
import type { Product } from "@/types";
import { getFileUrl, formatPrice } from "@/lib/pocketbase";
import AddToCartButton from "@/components/AddToCartButton";
import { motion, AnimatePresence } from "framer-motion";

interface ProductDetailsProps {
  variants: Product[];
  rates: { ars: number; rd: number };
  baseProduct: Product;
}

export default function ProductDetails({ variants, rates, baseProduct }: ProductDetailsProps) {
  const router = useRouter();
  const [selectedCurrency, setSelectedCurrency] = useState<'ARS' | 'RD'>('ARS');
  
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

  const [selectedPlatform, setSelectedPlatform] = useState<string>(baseProduct.category);
  const [selectedAccountType, setSelectedAccountType] = useState<string>(baseProduct.account_type);

  const currentVariant = useMemo(() => {
    return variants.find(v => v.category === selectedPlatform && v.account_type === selectedAccountType) || null;
  }, [variants, selectedPlatform, selectedAccountType]);

  const usdPrice = currentVariant?.price_usd || 0;
  const priceARS = Math.round(usdPrice * rates.ars);
  const priceRD = Math.round(usdPrice * rates.rd);
  const currentPrice = selectedCurrency === 'ARS' ? priceARS : priceRD;
  const currentSymbol = selectedCurrency === 'ARS' ? 'AR$' : 'RD$';

  const imageUrl = getFileUrl(baseProduct, "cover_image");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-black uppercase text-xs tracking-widest">Volver al catálogo</span>
      </motion.button>

      <div className="bg-dark-card/50 backdrop-blur-xl rounded-[40px] border border-white/5 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row min-h-[600px]">
        
        {/* Product Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="md:w-1/2 relative bg-black aspect-square md:aspect-auto min-h-[400px]"
        >
          {imageUrl ? (
            <Image 
              src={imageUrl} 
              alt={baseProduct.title} 
              fill
              priority
              unoptimized={true}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl opacity-10">🎮</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </motion.div>

        {/* Product Details */}
        <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-6 leading-[0.9] tracking-tighter">
              {baseProduct.title}
            </h1>
            <p className="text-gray-500 text-base md:text-lg mb-10 leading-relaxed font-medium max-w-lg">
              {baseProduct.description}
            </p>

            <div className="space-y-10 flex-grow mb-12">
              {/* Platform Selector */}
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Plataforma</label>
                <div className="flex flex-wrap gap-4">
                  {availablePlatforms.map(platform => (
                    <button
                      key={platform}
                      onClick={() => setSelectedPlatform(platform)}
                      className={`px-8 py-4 rounded-2xl font-black uppercase text-xs transition-all border ${
                        selectedPlatform === platform 
                          ? 'bg-neon-blue text-black border-neon-blue shadow-[0_0_20px_rgba(0,242,255,0.4)]' 
                          : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      {platform.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* License Selector */}
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Tipo de Licencia</label>
                <div className="flex flex-wrap gap-4">
                  {availableAccountTypes.map(account => {
                    const exists = variants.some(v => v.category === selectedPlatform && v.account_type === account);
                    return (
                      <button
                        key={account}
                        onClick={() => setSelectedAccountType(account)}
                        disabled={!exists}
                        className={`px-8 py-4 rounded-2xl font-black text-xs transition-all border relative overflow-hidden ${
                          selectedAccountType === account && exists
                            ? 'bg-neon-purple text-white border-neon-purple shadow-[0_0_20px_rgba(188,19,254,0.4)]' 
                            : !exists
                              ? 'bg-black/50 text-gray-700 border-white/5 cursor-not-allowed opacity-40'
                              : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        {account}
                        {!exists && (
                          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgoJPHJlY3Qgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0ibm9uZSI+PC9yZWN0PgoJPHBhdGggZD0iTTAgMEw4IDhaTTAgOEw4IDBaIiBzdHJva2U9IiM0NDQiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-20"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-white/5">
              <AnimatePresence mode="wait">
                {currentVariant ? (
                  <motion.div 
                    key="available"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm text-gray-500 font-black uppercase tracking-widest">{currentSymbol}</span>
                          <span className="text-5xl md:text-7xl font-black text-white tracking-tighter">{formatPrice(currentPrice)}</span>
                        </div>
                      </div>
                      
                      <div className="flex bg-black/50 p-1.5 rounded-2xl border border-white/5">
                        <button 
                          onClick={() => setSelectedCurrency('ARS')}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${selectedCurrency === 'ARS' ? 'bg-neon-blue text-black' : 'text-gray-500 hover:text-white'}`}
                        >
                          ARS
                        </button>
                        <button 
                          onClick={() => setSelectedCurrency('RD')}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${selectedCurrency === 'RD' ? 'bg-neon-purple text-white' : 'text-gray-500 hover:text-white'}`}
                        >
                          RD$
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <AddToCartButton product={currentVariant} calculatedArs={priceARS} calculatedRd={priceRD} />
                      <motion.a
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href={`https://wa.me/584241732650?text=${encodeURIComponent(`¡Hola! 👋 Vengo desde *${selectedCurrency === 'ARS' ? 'Argentina 🇦🇷' : 'Rep. Dominicana 🇩🇴'}* y quiero comprar: *${currentVariant.title}* (${currentVariant.category} - ${currentVariant.account_type}) por *${currentSymbol} ${formatPrice(currentPrice)}*`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#25D366] hover:bg-[#128C7E] text-white font-black py-5 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg shadow-[#25D366]/20 group"
                      >
                        <Zap className="w-5 h-5 fill-white group-hover:animate-pulse" />
                        Compra Rápida
                      </motion.a>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="unavailable"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-[24px] p-8 text-center"
                  >
                    <p className="text-red-400 font-black text-xl mb-2 tracking-tighter uppercase">No disponible</p>
                    <p className="text-red-400/60 text-sm font-medium">Esta combinación está agotada. Selecciona otra opción.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
