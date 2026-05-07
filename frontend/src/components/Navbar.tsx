// ============================================================
// AIDEN PLAY — Barra de Navegación
// ============================================================

import Link from "next/link";
import CartButton from "./CartButton";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative w-32 h-12 flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="Aiden Play" 
                className="w-full h-full object-contain"
              />
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <CartButton />
            
            <button
              className="md:hidden text-gray-300 hover:text-white transition-colors p-2"
              aria-label="Abrir menú"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
