"use client";

import Link from "next/link";
import CartButton from "./CartButton";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur-2xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="relative w-48 h-24 flex items-center justify-center -ml-8"
            >
              <img 
                src="/logo.png" 
                alt="Aiden Play" 
                className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              />
            </motion.div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <CartButton />
            
            <Link 
              href="/admin/login" 
              className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors hidden md:block"
            >
              Staff
            </Link>

            <button
              className="md:hidden text-gray-300 hover:text-white transition-colors p-2"
              aria-label="Abrir menú"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
