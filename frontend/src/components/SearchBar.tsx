"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { pb, getFileUrl } from "@/lib/pocketbase";
import type { Product } from "@/types";
import { Search, Zap } from "lucide-react";

export default function SearchBar({ categoryFilter }: { categoryFilter?: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
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

        const records = await pb.collection("products").getList<Product>(1, 50, {
          filter: filter,
          sort: "-created",
        });

        // Agrupar variantes por título base para el motor de búsqueda
        const groups = new Map<string, { product: Product, platforms: Set<string>, accountTypes: Set<string>, minPrice: number }>();
        
        records.items.forEach((item) => {
          const baseTitle = item.title.trim().toLowerCase();
          // Determinar el mejor precio para mostrar (USD, ARS o RD)
          const itemPrice = item.price_usd > 0 ? item.price_usd : (item.price_ar > 0 ? item.price_ar / 1000 : (item.price_rd > 0 ? item.price_rd / 50 : 0));
          
          if (!groups.has(baseTitle)) {
            groups.set(baseTitle, {
              product: item,
              platforms: new Set([item.category]),
              accountTypes: new Set([item.account_type]),
              minPrice: itemPrice
            });
          } else {
            const group = groups.get(baseTitle)!;
            group.platforms.add(item.category);
            group.accountTypes.add(item.account_type);
            if (itemPrice > 0 && (group.minPrice === 0 || itemPrice < group.minPrice)) {
              group.minPrice = itemPrice;
            }
          }
        });

        const finalResults = Array.from(groups.values()).slice(0, 6);
        setResults(finalResults);
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
          {results.map((res: any) => (
            <div
              key={res.product.id}
              onClick={() => router.push(`/producto/${res.product.id}`)}
              className="flex items-center gap-4 p-4 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 transition-colors group"
            >
              <div className="w-14 h-14 bg-dark rounded-lg overflow-hidden flex-shrink-0 border border-white/5">
                {res.product.cover_image ? (
                  <img
                    src={getFileUrl(res.product, "cover_image", { thumb: "100x100" }) || ""}
                    alt={res.product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/5 text-xl">
                    🎮
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <h4 className="text-white font-bold text-sm mb-1">{res.product.title}</h4>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {Array.from(res.platforms).map((plat: any) => (
                        <span key={plat} className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded ${
                          plat === 'PS5' ? 'bg-white text-black' : 
                          plat === 'PS4' ? 'bg-neon-blue text-black' : 
                          plat === 'NINTENDO' ? 'bg-[#E60012] text-white' : 'bg-gray-700'
                        }`}>
                          {plat}
                        </span>
                      ))}
                    </div>
                    <span className="text-[7px] text-gray-500 font-bold uppercase tracking-widest">•</span>
                    <div className="flex gap-1">
                      {Array.from(res.accountTypes).map((type: any) => (
                        <span key={type} className="text-[7px] font-black uppercase px-1.5 py-0.5 rounded bg-white/10 text-gray-300">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-neon-blue font-black tracking-tight">Desde ${res.minPrice} USD</p>
                </div>
              </div>
              <div className="text-neon-blue opacity-0 group-hover:opacity-100 transition-opacity">
                <Zap className="w-4 h-4 fill-current" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
