// ============================================================
// AIDEN PLAY — Interfaces TypeScript
// ============================================================

import type { RecordModel } from "pocketbase";

/**
 * Producto del catálogo (videojuego o servicio de streaming).
 * Mapea directamente a la colección `products` de PocketBase.
 */
export interface Product extends RecordModel {
  title: string;
  description: string;
  category: "PS4" | "PS5" | "PS_PLUS" | "STREAMING" | "NINTENDO";
  account_type: "Primaria" | "Secundaria" | "Suscripcion";
  price_usd: number;
  price_ar: number;
  price_rd: number;
  cover_image: string;
  is_featured: boolean;
  is_active: boolean;
}

/**
 * Configuración dinámica del sitio.
 * Mapea a la colección `site_settings` de PocketBase.
 */
export interface SiteSettings extends RecordModel {
  hero_title_line1: string;
  hero_title_line2: string;
  hero_subtitle: string;
  hero_badge_text: string;
  exchange_rate_ars: number;
  exchange_rate_rd: number;
  whatsapp_ar?: string;
  whatsapp_rd?: string;
  primary_region?: "AR" | "RD";
}

/**
 * Categorías disponibles para el filtrado rápido.
 */
export type CategorySlug = Product["category"];

/**
 * Metadata para renderizar las tarjetas de categoría.
 */
export interface CategoryInfo {
  slug: CategorySlug;
  label: string;
  sublabel: string;
  icon: string;
  colorClass: string;
  borderHover: string;
  glowActive?: boolean;
}

/**
 * Mapeo de categorías a colores de badge (Tailwind classes).
 */
export const CATEGORY_COLORS: Record<string, string> = {
  PS4: "bg-[#003791]",
  PS5: "bg-[#0072CE]",
  PS_PLUS: "bg-yellow-600",
  STREAMING: "bg-pink-600",
  NINTENDO: "bg-[#E60012]",
};
