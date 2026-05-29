"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getSiteSettings } from "@/lib/pocketbase";
import type { SiteSettings } from "@/types";

interface SettingsContextType {
  settings: SiteSettings | null;
  region: "AR" | "RD";
  country: "AR" | "DO" | "OTHER";
  whatsappNumber: string;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [country, setCountry] = useState<"AR" | "DO" | "OTHER" | null>(null);
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
        const geoResponse = await fetch("https://get.geojs.io/v1/ip/country.json").catch(() => null);
        
        if (geoResponse && geoResponse.ok) {
          const geoData = await geoResponse.json();
          const countryCode = geoData?.country;
          
          if (countryCode === "AR") {
            setCountry("AR");
          } else if (countryCode === "DO") {
            setCountry("DO");
          } else {
            setCountry("OTHER");
          }
        } else {
          setCountry("OTHER");
        }
      } catch (error) {
        console.error("Error en detección de región o carga de settings:", error);
        setCountry("OTHER");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Lógica de región para WhatsApp (mantiene compatibilidad: AR → AR, todo lo demás → RD)
  const getDynamicRegion = (): "AR" | "RD" => {
    if (country === "AR") return "AR";
    if (country === "DO" || country === "OTHER") return "RD";
    return settings?.primary_region || "RD";
  };

  // País real detectado (para precios)
  const getDynamicCountry = (): "AR" | "DO" | "OTHER" => {
    if (country) return country;
    return "OTHER"; // Fallback absoluto a USD
  };

  const finalCountry = getDynamicCountry();
  
  // Lógica del número de WhatsApp: Si es AR o DO, usa el suyo. Si es OTHER, usa el primary_region
  const getWhatsAppNumber = () => {
    if (finalCountry === "AR") return settings?.whatsapp_ar || DEFAULT_PHONE;
    if (finalCountry === "DO") return settings?.whatsapp_rd || DEFAULT_PHONE;
    return settings?.primary_region === "AR" ? (settings?.whatsapp_ar || DEFAULT_PHONE) : (settings?.whatsapp_rd || DEFAULT_PHONE);
  };

  const whatsappNumber = getWhatsAppNumber();

  return (
    <SettingsContext.Provider value={{ settings, region: finalCountry === "AR" ? "AR" : "RD", country: finalCountry, whatsappNumber, loading }}>
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
