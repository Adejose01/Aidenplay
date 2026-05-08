"use client";

import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";

export default function AddToCartButton({ product, calculatedArs, calculatedRd }: { product: Product, calculatedArs: number, calculatedRd: number }) {
  const { addToCart } = useCart();

  return (
    <button 
      onClick={(e) => {
        e.preventDefault();
        // Override the stale database prices with the dynamically calculated ones based on current exchange rates
        const productWithRealPrices = {
          ...product,
          price_ar: calculatedArs,
          price_rd: calculatedRd
        };
        addToCart(productWithRealPrices);
      }}
      className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold py-2 sm:py-2.5 rounded-lg text-[10px] sm:text-sm transition-colors flex items-center justify-center gap-1 sm:gap-2 cursor-pointer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-3 h-3 sm:w-4 sm:h-4"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
      </svg>
      Al Carrito
    </button>
  );
}
