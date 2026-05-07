"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { pb, getFileUrl } from "@/lib/pocketbase";
import type { Product } from "@/types";
import { Search } from "lucide-react";

export default function SearchBar({ categoryFilter }: { categoryFilter?: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setIsSearching(true);
      try {
        let filter = `title ~ "${query}" && is_active = true`;
        if (categoryFilter) {
          filter += ` && category = '${categoryFilter}'`;
        }

        const records = await pb.collection("products").getList<Product>(1, 5, {
          filter: filter,
          sort: "-created",
        });

        // Agrupar resultados por título exacto para no mostrar duplicados (PS4 y PS5 del mismo juego)
        const uniqueTitles = new Map<string, Product>();
        records.items.forEach((item) => {
          if (!uniqueTitles.has(item.title)) {
            uniqueTitles.set(item.title, item);
          }
        });

        setResults(Array.from(uniqueTitles.values()));
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, categoryFilter]);

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-12">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar juegos, suscripciones..."
          className="w-full bg-dark-card border border-white/10 rounded-full py-4 pl-12 pr-4 text-white focus:outline-none focus:border-neon-blue transition-colors"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        
        {isSearching && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {results.length > 0 && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-dark-card border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
          {results.map((product) => (
            <div
              key={product.id}
              onClick={() => router.push(`/producto/${product.id}`)}
              className="flex items-center gap-4 p-4 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 transition-colors"
            >
              <div className="w-12 h-12 bg-dark rounded overflow-hidden flex-shrink-0">
                {product.cover_image ? (
                  <img
                    src={getFileUrl(product, "cover_image", { thumb: "100x100" }) || ""}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/5 text-xl">
                    🎮
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-white font-bold">{product.title}</h4>
                <p className="text-xs text-gray-400">Ver opciones de plataforma</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
