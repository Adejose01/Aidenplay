"use client";

import type { Product } from "@/types";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";

interface ProductGridProps {
  products: Product[];
  title: string;
  sectionId?: string;
  rates?: { ars: number; rd: number };
}

export default function ProductGrid({
  products,
  title,
  sectionId,
  rates,
}: ProductGridProps) {
  return (
    <section id={sectionId} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-10">
        <h2 className="font-display text-2xl md:text-4xl font-black text-white tracking-tighter uppercase italic">
          {title}
        </h2>
        <div className="h-px bg-white/5 flex-grow ml-8 hidden md:block"></div>
      </div>

      {products.length === 0 ? (
        <div className="bg-dark-card border border-dashed border-white/10 rounded-3xl py-20 text-center">
          <span className="text-5xl mb-4 block opacity-20">🎮</span>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">
            Próximamente más productos...
          </p>
        </div>
      ) : (
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} rates={rates} />
          ))}
        </motion.div>
      )}
    </section>
  );
}
