// ============================================================
// AIDEN PLAY — Sección Hero (Banner Principal)
// ============================================================

import type { SiteSettings } from "@/types";

interface HeroProps {
  settings: SiteSettings | null;
}

export default function Hero({ settings }: HeroProps) {
  // Valores por defecto si PocketBase no tiene datos aún
  const line1 = settings?.hero_title_line1 || "EL MEJOR CATÁLOGO";
  const line2 = settings?.hero_title_line2 || "DIGITAL PS4 & PS5";
  const subtitle =
    settings?.hero_subtitle ||
    "Servicio rápido y confiable. Encuentra los últimos lanzamientos, cuentas primarias/secundarias al mejor precio en Pesos Argentinos y Dominicanos.";
  const badge = settings?.hero_badge_text || "🔥 Ofertas Semanales";

  return (
    <section className="relative bg-dark-card overflow-hidden border-b border-white/5">
      {/* Imagen de fondo con overlay */}
      <div
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=2000&auto=format&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/90 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="md:w-2/3">
          {/* Badge promocional */}
          <span className="inline-block py-1 px-3 rounded bg-neon-pink/10 border border-neon-pink/50 text-neon-pink text-xs font-bold tracking-widest uppercase mb-4 animate-pulse-soft">
            {badge}
          </span>

          {/* Título principal */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight">
            {line1}
            <br />
            <span className="neon-text-gradient">{line2}</span>
          </h1>

          {/* Subtítulo */}
          <p className="text-gray-400 text-base md:text-lg mb-8 max-w-xl leading-relaxed">
            {subtitle}
          </p>

          {/* CTA */}
          <div className="flex flex-wrap gap-4">
            <a
              href="https://wa.me/5491112345678" // Número de prueba (se debe cambiar por el real del cliente)
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-8 rounded-lg uppercase tracking-wider text-sm shadow-lg shadow-[#25D366]/20 inline-flex items-center gap-2 transition-all"
            >
              <i className="fa-brands fa-whatsapp text-xl"></i>
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
