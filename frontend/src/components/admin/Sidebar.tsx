"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2, LayoutDashboard, Settings, LogOut, Package } from "lucide-react";
import { pb } from "@/lib/pocketbase";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    pb.authStore.clear();
    // Limpiar la cookie (si existe)
    document.cookie = 'pb_auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-brand-card border-r border-brand-border h-screen sticky top-0 flex flex-col hidden md:flex">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-brand-border">
        <div className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-brand-bg border border-neon-purple flex items-center justify-center">
            <Gamepad2 className="w-4 h-4 text-neon-blue" />
          </div>
          <span className="font-display font-bold text-white tracking-wider">AIDEN PLAY</span>
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
  );
}
