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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="md:w-3/4 lg:w-2/3 pt-10"
        >
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <span className="inline-block py-2 px-5 rounded-full bg-neon-pink/20 border border-neon-pink/40 text-neon-pink text-xs font-black tracking-widest uppercase shadow-[0_0_20px_rgba(255,0,127,0.2)]">
              {badge}
            </span>
          </motion.div>

          {/* Title */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[0.85] tracking-tighter uppercase italic">
            <span className="block text-white mb-2">{line1}</span>
            <span className="neon-text-gradient block">{line2}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-2xl leading-relaxed font-medium">
            {subtitle}
          </p>
        </motion.div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-neon-blue/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-neon-purple/20 blur-[120px] rounded-full" />
    </section>
  );
}
