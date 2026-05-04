"use client";

import { useState } from "react";
import { pb, getFileUrl } from "@/lib/pocketbase";
import type { Product } from "@/types";
import { toast } from "sonner";
import { X, Upload } from "lucide-react";

interface ProductFormModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: () => void;
}

export default function ProductFormModal({ product, onClose, onSave }: ProductFormModalProps) {
  const isEditing = !!product;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    product ? getFileUrl(product, "cover_image") : null
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const fileInput = formData.get("cover_image") as File;
    
    // Si no es un archivo válido (por ejemplo, vacío al editar), eliminarlo del FormData para no sobrescribir con vacío
    if (fileInput && fileInput.size === 0) {
      formData.delete("cover_image");
    }

    // Asegurarse de que los booleanos se envíen correctamente
    formData.set("is_active", formData.get("is_active") === "true" ? "true" : "false");
    formData.set("is_featured", formData.get("is_featured") === "true" ? "true" : "false");

    try {
      if (isEditing) {
        await pb.collection("products").update(product.id, formData);
        toast.success("Producto actualizado exitosamente");
      } else {
        await pb.collection("products").create(formData);
        toast.success("Producto creado exitosamente");
      }
      onSave();
    } catch (error) {
      console.error(error);
      toast.error(isEditing ? "Error al actualizar producto" : "Error al crear producto");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-brand-card border border-brand-border rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-brand-border">
          <h3 className="text-xl font-display font-bold text-white">
            {isEditing ? "Editar Producto" : "Nuevo Producto"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Imagen */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Imagen de Portada</label>
              <div className="flex items-center gap-6">
                <div className={`w-32 h-32 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden relative ${!imagePreview ? 'border-brand-border bg-brand-bg' : 'border-neon-blue/50'}`}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="w-8 h-8 text-gray-500" />
                  )}
                  <input 
                    type="file" 
                    name="cover_image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required={!isEditing}
                  />
                </div>
                <div className="flex-1 text-sm text-gray-400">
                  <p>Recomendado: 800x600px o ratio 4:3.</p>
                  <p>Formato: JPG, PNG, WEBP. Máx: 5MB.</p>
                  <p className="mt-2 text-neon-blue cursor-pointer relative">
                    Seleccionar archivo
                    <input 
                      type="file" 
                      name="cover_image_alt" 
                      accept="image/*"
                      onChange={(e) => {
                        const fileInput = document.querySelector('input[name="cover_image"]') as HTMLInputElement;
                        if(fileInput && e.target.files) {
                           fileInput.files = e.target.files;
                           handleImageChange(e);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </p>
                </div>
              </div>
            </div>

            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Título del Producto *</label>
              <input 
                type="text" 
                name="title"
                defaultValue={product?.title || ""}
                required
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon-blue transition-colors"
                placeholder="Ej. God of War Ragnarök"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Descripción Breve</label>
              <textarea 
                name="description"
                defaultValue={product?.description || ""}
                rows={3}
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon-blue transition-colors resize-none"
                placeholder="Descripción que aparecerá en la tarjeta..."
              />
            </div>

            {/* Categoría y Tipo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Categoría *</label>
                <select 
                  name="category"
                  defaultValue={product?.category || "PS5"}
                  required
                  className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon-blue transition-colors appearance-none"
                >
                  <option value="PS5">Juegos PS5</option>
                  <option value="PS4">Juegos PS4</option>
                  <option value="PS_PLUS">Suscripciones PS Plus</option>
                  <option value="STREAMING">Cuentas Streaming</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Tipo de Cuenta *</label>
                <select 
                  name="account_type"
                  defaultValue={product?.account_type || "Primaria"}
                  required
                  className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon-blue transition-colors appearance-none"
                >
                  <option value="Primaria">Cuenta Primaria</option>
                  <option value="Secundaria">Cuenta Secundaria</option>
                  <option value="Suscripción">Suscripción Mensual</option>
                </select>
              </div>
            </div>

            {/* Precios */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-brand-bg p-4 rounded-lg border border-brand-border">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1.5">Precio Argentina (AR$)*</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-gray-500 font-bold">$</span>
                  <input 
                    type="number" 
                    name="price_ar"
                    defaultValue={product?.price_ar || ""}
                    required
                    min="0"
                    className="w-full bg-brand-card border border-brand-border rounded-lg px-4 py-2.5 pl-8 text-white focus:outline-none focus:border-neon-blue transition-colors"
                    placeholder="4500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1.5">Precio Rep. Dom (RD$)*</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-gray-500 font-bold">$</span>
                  <input 
                    type="number" 
                    name="price_rd"
                    defaultValue={product?.price_rd || ""}
                    required
                    min="0"
                    className="w-full bg-brand-card border border-brand-border rounded-lg px-4 py-2.5 pl-8 text-white focus:outline-none focus:border-neon-purple transition-colors"
                    placeholder="350"
                  />
                </div>
              </div>
            </div>

            {/* Switches */}
            <div className="flex gap-8 border-t border-brand-border pt-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="is_active" 
                  value="true"
                  defaultChecked={product ? product.is_active : true}
                  className="w-5 h-5 rounded border-brand-border bg-brand-bg text-neon-blue focus:ring-neon-blue"
                />
                <span className="text-sm text-gray-300">Producto Activo (Visible)</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="is_featured" 
                  value="true"
                  defaultChecked={product ? product.is_featured : false}
                  className="w-5 h-5 rounded border-brand-border bg-brand-bg text-neon-pink focus:ring-neon-pink"
                />
                <span className="text-sm text-gray-300">Destacar en Inicio (🔥)</span>
              </label>
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-brand-border bg-brand-bg rounded-b-xl flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-brand-border transition-colors font-medium"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            form="product-form"
            disabled={isSubmitting}
            className="bg-white text-black px-6 py-2.5 rounded-lg font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting && <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>}
            {isEditing ? "Guardar Cambios" : "Crear Producto"}
          </button>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      `}} />
    </div>
  );
}
