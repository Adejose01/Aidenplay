"use client";

import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/pocketbase";

export default function CartSidebar() {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, clearCart, totalArs, totalRd } = useCart();

  if (!isCartOpen) return null;

  // Enviar pedido por WhatsApp
  const handleCheckout = () => {
    const number = "5491112345678"; // Número de la tienda
    let text = "Hola, me gustaría comprar los siguientes productos:\n\n";
    items.forEach((item) => {
      text += `- ${item.title} (x${item.quantity}) - AR$ ${formatPrice(item.price_ar)} | RD$ ${formatPrice(item.price_rd)}\n`;
    });
    text += `\n*Total ARS*: $${formatPrice(totalArs)}\n`;
    text += `*Total RDS*: $${formatPrice(totalRd)}\n`;
    
    const url = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    clearCart();
    setIsCartOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-brand-bg border-l border-brand-border z-[70] shadow-2xl flex flex-col transform transition-transform duration-300">
        <div className="p-5 flex items-center justify-between border-b border-brand-border">
          <h2 className="text-xl font-display font-black text-white uppercase">Tu Carrito</h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">
              <span className="text-4xl mb-4 block">🛒</span>
              <p>Tu carrito está vacío.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="bg-dark-card rounded-lg p-3 border border-white/5 flex gap-3 relative">
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm pr-6">{item.title}</h4>
                  <p className="text-xs text-gray-400">Cantidad: {item.quantity}</p>
                  <p className="text-neon-blue font-bold text-sm mt-1">AR$ {formatPrice(item.price_ar)}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-brand-border bg-dark">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-sm">Total Argentina</span>
              <span className="font-bold text-neon-blue">AR$ {formatPrice(totalArs)}</span>
            </div>
            <div className="flex justify-between items-center mb-5">
              <span className="text-gray-400 text-sm">Total R. Dominicana</span>
              <span className="font-bold text-neon-purple">RD$ {formatPrice(totalRd)}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full btn-whatsapp font-bold py-3 rounded-xl flex justify-center items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Checkout por WhatsApp
          </button>
          </div>
        )}
      </div>
    </>
  );
}
