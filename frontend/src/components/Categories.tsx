"use client";

// ============================================================
// AIDEN PLAY — Categorías Rápidas
// ============================================================

import type { CategoryInfo } from "@/types";
import Link from "next/link";

const CATEGORIES: CategoryInfo[] = [
  {
    slug: "STREAMING",
    label: "STREAMING",
    sublabel: "Cuentas",
    icon: "📺",
    colorClass: "text-neon-pink",
    borderHover: "hover:border-neon-pink/50",
  },
  {
    slug: "PS4",
    label: "PS4",
    sublabel: "Juegos",
    icon: "🎮",
    colorClass: "text-neon-blue",
    borderHover: "hover:border-neon-blue/50",
  },
  {
    slug: "PS5",
    label: "PS5",
    sublabel: "Juegos",
    icon: "🎮",
    colorClass: "text-neon-purple",
    borderHover: "hover:border-neon-purple/50",
  },
  {
    slug: "PS_PLUS",
    label: "PS PLUS",
    sublabel: "Suscripción",
    icon: "➕",
    colorClass: "text-yellow-500",
    borderHover: "hover:border-yellow-500/50",
  },
  {
    slug: "NINTENDO",
    label: "NINTENDO",
    sublabel: "Switch",
    icon: "🕹️",
    colorClass: "text-[#E60012]",
    borderHover: "hover:border-[#E60012]/50",
  },
];

interface CategoriesProps {
  activeCategory?: string;
  onCategoryChange?: (slug: string) => void;
}

export default function Categories({
  activeCategory,
  onCategoryChange,
}: CategoriesProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full -mt-10 relative z-20">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.slug;

          return (
            <Link
              key={cat.slug}
              href={`/catalogo/${cat.slug.toLowerCase()}`}
              className={`
                bg-dark-card border rounded-xl p-4 flex items-center justify-center gap-3
                transition-all duration-300 group
                ${
                  isActive
                    ? `border-neon-pink/40 shadow-[0_0_15px_rgba(255,0,127,0.15)] relative overflow-hidden`
                    : `border-white/5 ${cat.borderHover}`
                }
              `}
            >
              {/* Fondo de glow para categoría activa */}
              {isActive && (
                <div className="absolute inset-0 bg-neon-pink/5" />
              )}

              {/* Icono */}
              <span
                className={`text-3xl transition-transform group-hover:scale-110 relative z-10 ${
                  isActive ? "" : "grayscale group-hover:grayscale-0"
                }`}
              >
                {cat.icon}
              </span>

              {/* Texto */}
              <div className="text-left relative z-10">
                <p className="font-bold text-sm uppercase text-gray-300">
                  {cat.sublabel}
                </p>
                <p
                  className={`${cat.colorClass} font-black text-lg leading-none`}
                >
                  {cat.label}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
