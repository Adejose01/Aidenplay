import type { Product } from "@/types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  title: string;
  sectionId?: string;
}

export default function ProductGrid({ products, title, sectionId }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <section id={sectionId} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-4">
          <h2 className="font-display text-2xl md:text-3xl font-black uppercase">{title}</h2>
        </div>
        <div className="text-center py-16">
          <span className="text-5xl mb-4 block">🎮</span>
          <p className="text-gray-400 text-lg">No hay productos disponibles en esta categoría.</p>
        </div>
      </section>
    );
  }

  return (
    <section id={sectionId} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
      <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-4">
        <h2 className="font-display text-2xl md:text-3xl font-black uppercase">{title}</h2>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-neon-pink/20 text-neon-pink border border-neon-pink/30 rounded-full text-xs font-bold cursor-pointer hover:bg-neon-pink/30 transition-colors">Destacados</span>
          <span className="px-3 py-1 border border-white/10 rounded-full text-xs font-medium text-gray-400 cursor-pointer hover:bg-white/10 transition-colors">Ver todo</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
