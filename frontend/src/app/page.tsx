// ============================================================
// AIDEN PLAY — Página Principal (Server Component)
// ============================================================
// Obtiene datos desde PocketBase en el servidor (SSR)
// y los pasa como props a los componentes de presentación.
// ============================================================

import { pb } from "@/lib/pocketbase";
import type { Product, SiteSettings } from "@/types";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";

import { getSiteSettings, getProductsByCategory, getFeaturedProducts } from "@/lib/pocketbase";

// Forzar renderizado dinámico para que los cambios en la DB se reflejen al instante
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch en paralelo para máximo rendimiento
  const [settings, featured, streaming, ps5, ps4, psPlus] = await Promise.all([
    getSiteSettings(),
    getFeaturedProducts(),
    getProductsByCategory("STREAMING"),
    getProductsByCategory("PS5"),
    getProductsByCategory("PS4"),
    getProductsByCategory("PS_PLUS"),
  ]);

  return (
    <>
      <Navbar />

      <main className="flex-grow">
        {/* Banner Principal */}
        <Hero settings={settings} />

        {/* Categorías Rápidas */}
        <Categories />

        {/* Sección: Productos Destacados */}
        {featured.length > 0 && (
          <ProductGrid
            products={featured}
            title="🔥 Destacados"
            sectionId="catalogo"
          />
        )}

        {/* Sección: Streaming */}
        <ProductGrid
          products={streaming}
          title="Cuentas de Streaming"
          sectionId="streaming"
        />

        {/* Sección: PS5 */}
        <ProductGrid
          products={ps5}
          title="Juegos PS5"
          sectionId="ps5"
        />

        {/* Sección: PS4 */}
        <ProductGrid
          products={ps4}
          title="Juegos PS4"
          sectionId="ps4"
        />

        {/* Sección: PS Plus */}
        <ProductGrid
          products={psPlus}
          title="Suscripciones PS Plus"
          sectionId="suscripciones"
        />
      </main>

      <Footer />
    </>
  );
}
