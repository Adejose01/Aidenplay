import { getProductsByCategory, getSiteSettings } from "@/lib/pocketbase";
import ProductGrid from "@/components/ProductGrid";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const titles: Record<string, string> = {
    ps4: "Juegos de PS4",
    ps5: "Juegos de PS5",
    streaming: "Cuentas de Streaming",
    ps_plus: "Suscripciones PS Plus",
  };
  return {
    title: `${titles[resolvedParams.category] || "Catálogo"} | Aiden Play`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const dbCategoryName = resolvedParams.category.toUpperCase();
  const [products, settings] = await Promise.all([
    getProductsByCategory(dbCategoryName),
    getSiteSettings(),
  ]);

  const titles: Record<string, string> = {
    ps4: "CATÁLOGO DE PS4",
    ps5: "CATÁLOGO DE PS5",
    streaming: "CUENTAS DE STREAMING",
    ps_plus: "SUSCRIPCIONES PS PLUS",
  };

  const colors: Record<string, string> = {
    ps4: "text-neon-blue",
    ps5: "text-neon-purple",
    streaming: "text-neon-pink",
    ps_plus: "text-yellow-500",
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className={`text-4xl md:text-5xl font-display font-black tracking-tighter ${colors[resolvedParams.category] || "text-white"}`}>
              {titles[resolvedParams.category] || "CATÁLOGO"}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-neon-blue to-neon-purple mx-auto mt-6 rounded-full"></div>
          </div>
          <SearchBar categoryFilter={dbCategoryName} />
          <ProductGrid
            products={products}
            title=""
            rates={{
              ars: settings?.exchange_rate_ars || 1415,
              rd: settings?.exchange_rate_rd || 58
            }}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
