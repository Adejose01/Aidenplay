"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getSiteSettings } from "@/lib/pocketbase";
import type { SiteSettings } from "@/types";

interface SettingsContextType {
  settings: SiteSettings | null;
  region: "AR" | "RD";
  whatsappNumber: string;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [region, setRegion] = useState<"AR" | "RD" | null>(null); 
  const [loading, setLoading] = useState(true);
  const DEFAULT_PHONE = ""; // Respaldo vacío para forzar uso de DB

  useEffect(() => {
    async function loadData() {
      try {
        // 1. Obtener configuración de PocketBase
        const siteSettings = await getSiteSettings();
        if (siteSettings) {
          setSettings(siteSettings);
        }

        // 2. Detección de IP (Geolocalización)
        const geoResponse = await fetch("https://ipapi.co/json/").catch(() => null);
        if (geoResponse && geoResponse.ok) {
          const geoData = await geoResponse.json();
          if (geoData.country_code === "AR") {
            setRegion("AR");
          } else {
            setRegion("RD");
          }
        }
      } catch (error) {
        console.warn("⚠️ Error en detección de región o carga de settings:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Lógica de número dinámico con respaldo general configurable
  const getDynamicRegion = () => {
    if (region) return region; // Si la IP detectó algo, manda la IP
    return settings?.primary_region || "RD"; // Si no hay IP, manda la región primaria (RD por defecto)
  };

  const finalRegion = getDynamicRegion();
  const whatsappNumber = finalRegion === "AR" 
    ? (settings?.whatsapp_ar || DEFAULT_PHONE)
    : (settings?.whatsapp_rd || DEFAULT_PHONE);

  return (
    <SettingsContext.Provider value={{ settings, region: finalRegion, whatsappNumber, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings debe usarse dentro de un SettingsProvider");
  }
  return context;
}
