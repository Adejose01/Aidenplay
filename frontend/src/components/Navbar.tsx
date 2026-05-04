// ============================================================
// AIDEN PLAY — Barra de Navegación
// ============================================================

import Link from "next/link";
import CartButton from "./CartButton";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-dark/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-dark-lighter border border-neon-purple flex items-center justify-center transition-shadow group-hover:shadow-[0_0_12px_rgba(176,38,255,0.3)]">
              <i className="fa-solid fa-gamepad text-neon-blue"></i>
            </div>
            <span className="font-display font-black text-xl tracking-wider uppercase neon-text-gradient">
              Aiden Play
            </span>
          </Link>

          {/* Menú Desktop */}
          <div className="hidden md:flex ml-10 space-x-8 text-sm font-medium">
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Inicio
            </Link>
            <Link
              href="/#catalogo"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Catálogo PS4/PS5
            </Link>
            <Link
              href="/#suscripciones"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Suscripciones
            </Link>
          </div>

          {/* Iconos */}
          <div className="flex items-center gap-5">
            <CartButton />
            {/* Botón Menú Móvil */}
            <button
              className="md:hidden text-gray-300 hover:text-white transition-colors"
              aria-label="Abrir menú"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
