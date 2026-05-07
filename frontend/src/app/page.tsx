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
import SearchBar from "@/components/SearchBar";

import { getSiteSettings, getProductsByCategory, getFeaturedProducts } from "@/lib/pocketbase";

// Forzar renderizado dinámico para que los cambios en la DB se reflejen al instante
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch solo de lo necesario
  const [settings, featured] = await Promise.all([
    getSiteSettings(),
    getFeaturedProducts(),
  ]);

  return (
    <>
      <Navbar />

      <main className="flex-grow">
        {/* Banner Principal */}
        <Hero settings={settings} />

        {/* Categorías Rápidas */}
        <Categories />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <SearchBar />
        </div>

        {/* Sección: OFERTAS DESTACADAS */}
        <ProductGrid
          products={featured}
          title="OFERTAS DESTACADAS"
          sectionId="catalogo"
          rates={{
            ars: settings?.exchange_rate_ars || 1415,
            rd: settings?.exchange_rate_rd || 58
          }}
        />
      </main>

      <Footer />
    </>
  );
}
