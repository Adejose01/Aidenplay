"use client";

import { useState, useEffect } from "react";
import { pb, getFileUrl, formatPrice } from "@/lib/pocketbase";
import type { Product } from "@/types";
import { toast } from "sonner";
import { Plus, Trash2, Edit3, Image as ImageIcon, CheckCircle, XCircle } from "lucide-react";
import ProductFormModal from "./ProductFormModal";

export default function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const records = await pb.collection("products").getFullList<Product>({
        sort: "-created",
        fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' })
      });
      setProducts(records);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar productos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      await pb.collection("products").delete(id);
      toast.success("Producto eliminado");
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar producto");
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      const updated = await pb.collection("products").update<Product>(product.id, { is_active: !product.is_active });
      setProducts(products.map(p => p.id === product.id ? updated : p));
      toast.success(`Producto ${updated.is_active ? 'activado' : 'desactivado'}`);
    } catch (error) {
      toast.error("Error al cambiar estado");
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    try {
      const updated = await pb.collection("products").update<Product>(product.id, { is_featured: !product.is_featured });
      setProducts(products.map(p => p.id === product.id ? updated : p));
      toast.success(`Producto ${updated.is_featured ? 'destacado' : 'no destacado'}`);
    } catch (error) {
      toast.error("Error al cambiar estado destacado");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white">Catálogo de Productos</h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Gestiona el inventario, precios y visibilidad.</p>
        </div>
        <button 
          onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }}
          className="w-full sm:w-auto bg-neon-blue hover:bg-[#00cce6] text-black font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Producto
        </button>
      </div>

      <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-border/30 border-b border-brand-border text-[10px] sm:text-xs uppercase text-gray-400 font-bold tracking-wider">
                <th className="p-3 sm:p-4">Producto</th>
                <th className="p-3 sm:p-4 hidden sm:table-cell">Categoría</th>
                <th className="p-3 sm:p-4 w-32 sm:w-40 text-center sm:text-left text-neon-blue">Precio USD</th>
                <th className="p-3 sm:p-4 text-center hidden md:table-cell">Estado</th>
                <th className="p-3 sm:p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    Cargando productos...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No hay productos registrados.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-brand-bg overflow-hidden flex-shrink-0 relative border border-brand-border">
                          {product.cover_image ? (
                            <img 
                              src={getFileUrl(product, "cover_image", { thumb: "100x100" }) || ""} 
                              alt={product.title} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                              <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                          )}
                        </div>
                        <div className="max-w-[100px] sm:max-w-none">
                          <p className="font-bold text-white text-xs sm:text-sm line-clamp-1">{product.title}</p>
                          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 line-clamp-1">{product.description || "Sin descripción"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 hidden sm:table-cell">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded w-max ${
                          product.category === 'PS5' ? 'bg-[#0072CE]/20 text-[#0072CE]' :
                          product.category === 'PS4' ? 'bg-[#003791]/20 text-[#609dff]' :
                          product.category === 'STREAMING' ? 'bg-neon-pink/20 text-neon-pink' :
                          'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {product.category.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-gray-400">{product.account_type}</span>
                      </div>
                    </td>
                    <td className="p-3 sm:p-4">
                      <div className="relative flex items-center">
                        <span className="absolute left-2 sm:left-3 text-gray-500 text-[10px] font-bold">$</span>
                        <input 
                          type="number" 
                          step="0.01"
                          value={product.price_usd}
                          onChange={(e) => {
                            setProducts(products.map(p => p.id === product.id ? { ...p, price_usd: Number(e.target.value) } : p));
                          }}
                          onBlur={async (e) => {
                            try {
                              const updated = await pb.collection("products").update<Product>(product.id, { price_usd: Number(e.target.value) });
                              setProducts(prev => prev.map(p => p.id === product.id ? updated : p));
                              toast.success("Precio USD actualizado", { position: "bottom-center" });
                            } catch (error) {
                              toast.error("Error al actualizar precio");
                              fetchProducts();
                            }
                          }}
                          className="w-full bg-brand-bg border border-brand-border rounded px-1.5 py-1 sm:px-2 sm:py-1.5 pl-4 sm:pl-6 text-white text-xs sm:text-sm focus:border-neon-blue focus:outline-none transition-colors"
                        />
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 text-center hidden md:table-cell">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleToggleActive(product)}
                          title={product.is_active ? "Desactivar" : "Activar"}
                          className={`p-1.5 rounded transition-colors ${product.is_active ? 'text-green-500 hover:bg-green-500/10' : 'text-gray-500 hover:bg-gray-500/10'}`}
                        >
                          {product.is_active ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                        </button>
                        <button 
                          onClick={() => handleToggleFeatured(product)}
                          title={product.is_featured ? "Quitar de destacados" : "Hacer destacado"}
                          className={`p-1.5 rounded transition-colors ${product.is_featured ? 'text-neon-pink hover:bg-neon-pink/10' : 'text-gray-500 hover:bg-gray-500/10'}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={product.is_featured ? "currentColor" : "none"} stroke="currentColor" className="w-5 h-5" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 text-right">
                      <div className="flex justify-end gap-1 sm:gap-2">
                        <button 
                          onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }}
                          className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-brand-border rounded transition-colors"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 sm:p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ProductFormModal 
          product={selectedProduct} 
          onClose={() => setIsModalOpen(false)} 
          onSave={() => { setIsModalOpen(false); fetchProducts(); }}
        />
      )}
    </div>
  );
}
