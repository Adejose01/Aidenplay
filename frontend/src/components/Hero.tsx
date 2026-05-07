"use client";

import type { SiteSettings } from "@/types";
import { motion } from "framer-motion";

interface HeroProps {
  settings: SiteSettings | null;
}

export default function Hero({ settings }: HeroProps) {
  const line1 = settings?.hero_title_line1 || "EL MEJOR CATÁLOGO";
  const line2 = settings?.hero_title_line2 || "DIGITAL PS4 & PS5";
  const subtitle =
    settings?.hero_subtitle ||
    "Servicio rápido y confiable. Encuentra los últimos lanzamientos y cuentas al mejor precio.";
  const badge = settings?.hero_badge_text || "🔥 Ofertas Semanales";

  return (
    <section className="relative h-[600px] flex items-center overflow-hidden border-b border-white/5">
      {/* Background Image with Parallax-like effect */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/hero-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="md:w-2/3"
        >
          {/* Badge */}
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-block py-1.5 px-4 rounded-full bg-neon-pink/10 border border-neon-pink/30 text-neon-pink text-[10px] font-black tracking-widest uppercase mb-6"
          >
            {badge}
          </motion.span>

          {/* Title */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[0.9] tracking-tighter">
            <span className="block text-white mb-2">{line1}</span>
            <span className="neon-text-gradient block">{line2}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-xl leading-relaxed font-medium">
            {subtitle}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-5">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#catalogo"
              className="bg-white text-black font-black py-4 px-10 rounded-xl uppercase tracking-tighter text-sm transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              Ver Catálogo
            </motion.a>
            
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://wa.me/18091234567"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-card border border-white/10 text-white font-black py-4 px-10 rounded-xl uppercase tracking-tighter text-sm transition-all hover:border-white/40 flex items-center gap-2"
            >
              Soporte VIP
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-neon-blue/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-neon-purple/20 blur-[120px] rounded-full" />
    </section>
  );
}
