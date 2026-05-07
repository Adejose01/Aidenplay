// ============================================================
// AIDEN PLAY — Cliente PocketBase (TypeScript)
// ============================================================

import PocketBase from "pocketbase";
import type { RecordModel } from "pocketbase";

/**
 * URL del servidor PocketBase.
 * - En el navegador (Cliente): usa la IP/dominio expuesto al usuario.
 * - En el servidor (Docker): usa la red interna de Docker.
 */
const PB_URL = typeof window !== 'undefined'
  ? "/proxy"
  : (process.env.PB_INTERNAL_URL || "http://localhost:8090");

/**
 * Instancia singleton del cliente PocketBase.
 */
export const pb = new PocketBase(PB_URL);

// Desactivar auto-cancelación para SSR/Server Components
pb.autoCancellation(false);

/**
 * Genera la URL completa de un archivo almacenado en PocketBase.
 *
 * @param record   - Registro de PocketBase con el campo de archivo
 * @param fieldName - Nombre del campo tipo `file`
 * @param options  - Opciones (ej: { thumb: "400x300" })
 * @returns URL string o null si no hay archivo
 */
export function getFileUrl(
  record: RecordModel,
  fieldName: string,
  options: { thumb?: string } = {}
): string | null {
  const filename = record[fieldName];
  if (!record || !filename) return null;
  
  // Usamos un prefijo de proxy relativo que el navegador siempre pueda resolver.
  // Esto evita que el servidor genere URLs con hostnames internos de Docker (ej: http://backend:8090)
  // que el navegador no puede entender.
  const baseUrl = "/proxy";
  const collection = record.collectionId || record.collectionName;
  const url = `${baseUrl}/api/files/${collection}/${record.id}/${filename}`;
  
  const params = new URLSearchParams();
  if (options.thumb) params.append("thumb", options.thumb);
  // Cache busting basado en la fecha de actualización del registro
  if (record.updated) {
    params.append("t", new Date(record.updated).getTime().toString());
  }
  
  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
}

/**
 * Formatea un precio numérico al formato de moneda local.
 * Ejemplo: 4500 → "4.500"
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Genera un enlace de WhatsApp con mensaje pre-llenado.
 *
 * @param productTitle - Nombre del producto
 * @param priceAR      - Precio en Pesos Argentinos
 * @param priceRD      - Precio en Pesos Dominicanos
 * @returns URL de la API de WhatsApp
 */
export function buildWhatsAppLink(
  productTitle: string,
  price: number,
  currency: 'ARS' | 'RD'
): string {
  // Número de WhatsApp del negocio
  const phone = "584241732650";
  const regionName = currency === 'ARS' ? 'Argentina 🇦🇷' : 'Rep. Dominicana 🇩🇴';
  const symbol = currency === 'ARS' ? 'AR$' : 'RD$';

  const message = encodeURIComponent(
    `¡Hola! 👋 Vengo desde *${regionName}* y quiero comprar:\n\n` +
    `🎮 *${productTitle}*\n` +
    `💰 *${symbol} ${formatPrice(price)}*\n\n` +
    `¿Está disponible?`
  );
  return `https://wa.me/${phone}?text=${message}`;
}

import type { Product, SiteSettings } from "@/types";

/**
 * Obtiene la configuración del sitio desde PocketBase.
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const records = await pb
      .collection("site_settings")
      .getList<SiteSettings>(1, 1, {
        fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' })
      });
    return records.items[0] || null;
  } catch {
    console.warn("⚠️ No se pudo conectar a PocketBase para site_settings");
    return null;
  }
}

/**
 * Obtiene productos activos filtrados por categoría.
 */
export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  try {
    const records = await pb
      .collection("products")
      .getList<Product>(1, 50, {
        filter: `category = '${category}' && is_active = true`,
        sort: "-is_featured,-created",
        fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' })
      });
    return records.items;
  } catch {
    console.warn(`⚠️ No se pudieron obtener productos (${category})`);
    return [];
  }
}

/**
 * Obtiene todos los productos destacados activos.
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const records = await pb
      .collection("products")
      .getList<Product>(1, 8, {
        filter: "is_featured = true && is_active = true",
        sort: "-created",
        fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' })
      });
    return records.items;
  } catch {
    console.warn("⚠️ No se pudieron obtener productos destacados");
    return [];
  }
}
