"use client";

import type { CategoryInfo } from "@/types";
import Link from "next/link";
import { motion } from "framer-motion";

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full -mt-20 relative z-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CATEGORIES.map((cat, index) => {
          const isActive = activeCategory === cat.slug;

          return (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/catalogo/${cat.slug.toLowerCase()}`}
                className={`
                  bg-dark-card/80 backdrop-blur-md border rounded-2xl p-5 flex items-center justify-center gap-4
                  transition-all duration-300 group h-full
                  ${
                    isActive
                      ? `border-neon-pink/40 shadow-[0_0_20px_rgba(255,0,127,0.2)] relative overflow-hidden`
                      : `border-white/5 ${cat.borderHover} hover:bg-white/5`
                  }
                `}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-neon-pink/5" />
                )}

                <span
                  className={`text-4xl transition-transform group-hover:scale-110 relative z-10 ${
                    isActive ? "" : "grayscale group-hover:grayscale-0"
                  }`}
                >
                  {cat.icon}
                </span>

                <div className="text-left relative z-10">
                  <p className="font-black text-[10px] uppercase tracking-widest text-gray-500 mb-0.5">
                    {cat.sublabel}
                  </p>
                  <p
                    className={`${cat.colorClass} font-black text-xl leading-none tracking-tighter`}
                  >
                    {cat.label}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
