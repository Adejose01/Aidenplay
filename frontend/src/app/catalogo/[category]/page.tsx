import { getProductsByCategory, getSiteSettings } from "@/lib/pocketbase";
import ProductGrid from "@/components/ProductGrid";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";

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

export default async function CategoryPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ category: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const pageParam = resolvedSearchParams.page;
  const currentPage = typeof pageParam === 'string' ? parseInt(pageParam) : 1;
  const validPage = isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;
  
  const dbCategoryName = resolvedParams.category.toUpperCase();
  const [productsData, settings] = await Promise.all([
    getProductsByCategory(dbCategoryName, validPage),
    getSiteSettings(),
  ]);

  const { items: products, totalPages } = productsData;

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

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              {validPage > 1 ? (
                <Link
                  href={`/catalogo/${resolvedParams.category}?page=${validPage - 1}`}
                  className="px-4 py-2 bg-brand-card border border-brand-border rounded-lg text-white hover:border-neon-blue transition-colors font-medium text-sm"
                >
                  Anterior
                </Link>
              ) : (
                <button disabled className="px-4 py-2 bg-brand-card/50 border border-brand-border/50 rounded-lg text-gray-500 cursor-not-allowed font-medium text-sm">
                  Anterior
                </button>
              )}
              
              <span className="text-gray-400 font-medium text-sm">
                Página {validPage} de {totalPages}
              </span>

              {validPage < totalPages ? (
                <Link
                  href={`/catalogo/${resolvedParams.category}?page=${validPage + 1}`}
                  className="px-4 py-2 bg-brand-card border border-brand-border rounded-lg text-white hover:border-neon-blue transition-colors font-medium text-sm"
                >
                  Siguiente
                </Link>
              ) : (
                <button disabled className="px-4 py-2 bg-brand-card/50 border border-brand-border/50 rounded-lg text-gray-500 cursor-not-allowed font-medium text-sm">
                  Siguiente
                </button>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
