"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useSettings } from "@/context/SettingsContext";
import { formatPrice } from "@/lib/pocketbase";

export default function CartSidebar() {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, clearCart, totalArs, totalRd } = useCart();
  const { region: detectedRegion, whatsappNumber, settings } = useSettings();
  const [region, setRegion] = useState<'AR' | 'RD' | null>(null);

  // Sincronizar región detectada al abrir el carrito por primera vez si no hay una seleccionada
  useEffect(() => {
    if (detectedRegion && !region) {
      setRegion(detectedRegion);
    }
  }, [detectedRegion, region]);

  if (!isCartOpen) return null;

  // Enviar pedido por WhatsApp
  const handleCheckout = () => {
    if (!region || !settings) return;

    // Seleccionar el número correcto basado en la región elegida en el carrito
    const rawNumber = region === 'AR' 
      ? (settings.whatsapp_ar || "") 
      : (settings.whatsapp_rd || "");
      
    const number = rawNumber.replace(/\D/g, ""); // Limpiar espacios y símbolos
    
    if (!number) {
      alert("Lo sentimos, no hay un número de contacto configurado para esta región.");
      return;
    }

    const regionName = region === 'AR' ? 'Argentina 🇦🇷' : 'Rep. Dominicana 🇩🇴';
    const total = region === 'AR' ? `AR$ ${formatPrice(totalArs)}` : `RD$ ${formatPrice(totalRd)}`;

    let text = `¡Hola! 👋 Vengo desde *${regionName}* y me gustaría comprar:\n\n`;
    items.forEach((item) => {
      text += `- ${item.title} (x${item.quantity})\n`;
    });
    text += `\n*Total a pagar*: ${total}\n`;
    text += `\n¿Me confirman disponibilidad?`;
    
    const url = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    clearCart();
    setIsCartOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] animate-in fade-in duration-300"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-[#0a0a0a] border-l border-white/10 z-[70] shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col transform transition-all duration-300 animate-in slide-in-from-right">
        <div className="p-6 flex items-center justify-between border-b border-white/5 bg-black/20">
          <h2 className="text-xl font-display font-black text-white uppercase tracking-tighter italic">Tu Carrito</h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 custom-scrollbar">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🛒</span>
              </div>
              <p className="font-bold uppercase tracking-widest text-[10px]">Tu carrito está vacío</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="bg-white/5 rounded-2xl p-4 border border-white/5 flex gap-4 relative group transition-all hover:bg-white/[0.08] hover:border-white/10">
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/0 text-gray-600 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-xl shrink-0 border border-white/5">🎮</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-white text-sm pr-6 uppercase italic truncate">{item.title}</h4>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Cantidad: {item.quantity}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-white/5 bg-black/40 space-y-6">
            {/* Region Selector */}
            <div className="space-y-3">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-center">¿Desde dónde nos escribes?</p>
              <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                <button 
                  onClick={() => setRegion('AR')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${region === 'AR' ? 'bg-neon-blue text-black shadow-[0_0_20px_rgba(0,242,255,0.3)]' : 'text-gray-500 hover:text-white'}`}
                >
                  Argentina 🇦🇷
                </button>
                <button 
                  onClick={() => setRegion('RD')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${region === 'RD' ? 'bg-neon-purple text-white shadow-[0_0_20px_rgba(188,19,254,0.3)]' : 'text-gray-500 hover:text-white'}`}
                >
                  Rep. Dom 🇩🇴
                </button>
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Argentina</span>
                <span className="font-black text-lg text-neon-blue tracking-tighter">AR$ {formatPrice(totalArs)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Dominicana</span>
                <span className="font-black text-lg text-neon-purple tracking-tighter">RD$ {formatPrice(totalRd)}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={!region}
              className={`w-full font-black py-5 rounded-2xl flex justify-center items-center gap-3 transition-all uppercase tracking-widest text-xs ${
                region 
                  ? 'bg-[#25D366] text-white hover:scale-[1.02] active:scale-[0.98] shadow-[0_10px_30px_rgba(37,211,102,0.3)]' 
                  : 'bg-white/5 text-gray-600 cursor-not-allowed'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {region ? 'Proceder al Pago' : 'Selecciona tu Región'}
            </button>
          </div>
        )}
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </>
  );
}
