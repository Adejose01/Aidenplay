"use client";

import { useState, useEffect } from "react";
import { pb } from "@/lib/pocketbase";
import type { SiteSettings } from "@/types";
import { toast } from "sonner";
import { Save } from "lucide-react";

export default function SettingsForm() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const records = await pb.collection("site_settings").getList<SiteSettings>(1, 1, {
          fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' })
        });
        if (records.items.length > 0) {
          setSettings(records.items[0]);
        }
      } catch (error) {
        console.error(error);
        toast.error("Error al cargar configuración");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      if (settings?.id) {
        await pb.collection("site_settings").update(settings.id, data);
        setSettings({ ...settings, ...data } as SiteSettings);
      } else {
        // En caso de que no exista el registro inicial
        const created = await pb.collection("site_settings").create<SiteSettings>(data);
        setSettings(created);
      }
      toast.success("Configuración guardada exitosamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar configuración");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Cargando configuración...</div>;
  }

  return (
    <div className="max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="mb-6">
          <h2 className="text-2xl font-display font-bold text-white">Landing Page</h2>
          <p className="text-gray-400 text-sm mt-1">Modifica los textos principales que ven tus clientes al entrar a la tienda.</p>
        </div>

        <div className="bg-brand-card border border-brand-border rounded-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="bg-brand-bg border border-neon-pink/30 rounded-lg p-5">
              <label className="block text-sm font-bold text-neon-pink mb-1.5">Texto del Badge (Etiqueta superior)</label>
              <input 
                type="text" 
                name="hero_badge_text"
                value={settings?.hero_badge_text || ""}
                onChange={(e) => setSettings(prev => prev ? { ...prev, hero_badge_text: e.target.value } : null)}
                className="w-full bg-brand-card border border-brand-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon-pink transition-colors"
                placeholder="🔥 Ofertas Semanales"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Título Principal (Línea 1)</label>
              <input 
                type="text" 
                name="hero_title_line1"
                value={settings?.hero_title_line1 || ""}
                onChange={(e) => setSettings(prev => prev ? { ...prev, hero_title_line1: e.target.value } : null)}
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon-blue transition-colors font-display font-bold text-lg"
                placeholder="EL MEJOR CATÁLOGO"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Título Principal (Línea 2) <span className="text-neon-purple text-xs font-normal ml-2">Se mostrará con gradiente neón</span>
              </label>
              <input 
                type="text" 
                name="hero_title_line2"
                value={settings?.hero_title_line2 || ""}
                onChange={(e) => setSettings(prev => prev ? { ...prev, hero_title_line2: e.target.value } : null)}
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-2.5 text-neon-purple focus:outline-none focus:border-neon-purple transition-colors font-display font-bold text-lg"
                placeholder="DIGITAL PS4 & PS5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Subtítulo Descriptivo</label>
              <textarea 
                name="hero_subtitle"
                value={settings?.hero_subtitle || ""}
                onChange={(e) => setSettings(prev => prev ? { ...prev, hero_subtitle: e.target.value } : null)}
                rows={4}
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-2.5 text-gray-300 focus:outline-none focus:border-neon-blue transition-colors resize-none"
                placeholder="Servicio rápido y confiable..."
              />
            </div>

            <div className="pt-4 border-t border-brand-border flex justify-end">
              <button 
                type="submit" 
                disabled={isSaving}
                className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {isSaving ? "Guardando..." : "Guardar Configuración"}
              </button>
            </div>

          </form>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="mb-6">
          <h2 className="text-2xl font-display font-bold text-white">Finanzas</h2>
          <p className="text-gray-400 text-sm mt-1">Tasas de cambio y conversión.</p>
        </div>

        <div className="bg-brand-card border border-brand-border rounded-xl p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Tasa USD ➔ ARS (Arg)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
              <input 
                type="number" 
                step="0.01"
                value={settings?.exchange_rate_ars || 0}
                onChange={(e) => setSettings(prev => prev ? { ...prev, exchange_rate_ars: parseFloat(e.target.value) || 0 } : null)}
                className="w-full bg-brand-bg border border-brand-border rounded-lg pl-8 pr-4 py-2.5 text-white focus:outline-none focus:border-neon-blue transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Tasa USD ➔ RD (Dom)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
              <input 
                type="number" 
                step="0.01"
                value={settings?.exchange_rate_rd || 0}
                onChange={(e) => setSettings(prev => prev ? { ...prev, exchange_rate_rd: parseFloat(e.target.value) || 0 } : null)}
                className="w-full bg-brand-bg border border-brand-border rounded-lg pl-8 pr-4 py-2.5 text-white focus:outline-none focus:border-neon-purple transition-colors"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-brand-border">
            <button 
              onClick={async () => {
                if (!settings?.id) return;
                setIsSaving(true);
                try {
                  const updated = await pb.collection("site_settings").update<SiteSettings>(settings.id, {
                    exchange_rate_ars: settings.exchange_rate_ars,
                    exchange_rate_rd: settings.exchange_rate_rd
                  });
                  setSettings(updated);
                  toast.success("Tasas financieras actualizadas");
                } catch (e) {
                  toast.error("Error al guardar tasas");
                } finally {
                  setIsSaving(false);
                }
              }}
              disabled={isSaving}
              className="w-full bg-white text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
            >
              <Save className="w-4 h-4" />
              Guardar Tasas
            </button>
          </div>
        </div>

        <div className="mt-8 bg-neon-blue/5 border border-neon-blue/20 rounded-lg p-5">
          <h4 className="text-neon-blue font-bold text-sm mb-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
            </svg>
            Cálculo en tiempo real
          </h4>
          <p className="text-xs text-gray-400">
            Los precios de la tienda se calculan automáticamente multiplicando el valor USD de cada producto por las tasas definidas aquí.
          </p>
        </div>
      </div>
    </div>
  );
}
