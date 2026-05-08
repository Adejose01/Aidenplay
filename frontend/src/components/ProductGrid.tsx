import type { Product } from "@/types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  title: string;
  sectionId?: string;
  rates?: { ars: number; rd: number };
}

export default function ProductGrid({ products, title, sectionId, rates }: ProductGridProps) {
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
    <section id={sectionId} className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 w-full">
      <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-4">
        <h2 className="font-display text-2xl md:text-3xl font-black uppercase">{title}</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} rates={rates} />
        ))}
      </div>
    </section>
  );
}
