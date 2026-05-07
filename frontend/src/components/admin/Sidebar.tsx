"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2, LayoutDashboard, Settings, LogOut, Package } from "lucide-react";
import { pb } from "@/lib/pocketbase";
import { useRouter } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    pb.authStore.clear();
    // Limpiar la cookie (si existe)
    document.cookie = 'pb_auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push("/login");
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-brand-card border-r border-brand-border flex flex-col 
        transition-transform duration-300 md:translate-x-0 md:static md:h-screen
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
      {/* Brand */}
      <div className="h-24 flex items-center justify-center border-b border-brand-border px-4">
        <div className="relative w-full h-16 flex items-center justify-center">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" 
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <Link 
          href="/admin" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            pathname === "/admin" 
              ? "bg-neon-blue/10 text-neon-blue font-medium" 
              : "text-gray-400 hover:text-white hover:bg-brand-border/50"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          Catálogo Principal
        </Link>
        <Link 
          href="/admin/settings" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            pathname === "/admin/settings" 
              ? "bg-neon-purple/10 text-neon-purple font-medium" 
              : "text-gray-400 hover:text-white hover:bg-brand-border/50"
          }`}
        >
          <Settings className="w-5 h-5" />
          Configuración Sitio
        </Link>
      </nav>

      {/* User / Logout */}
      <div className="p-4 border-t border-brand-border">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
    </>
  );
}
