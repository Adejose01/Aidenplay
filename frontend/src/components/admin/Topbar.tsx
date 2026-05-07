"use client";

import { Bell, Search, Menu } from "lucide-react";

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="h-16 bg-brand-card border-b border-brand-border flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
      {/* Mobile Menu Button & Search */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden text-gray-400 hover:text-white"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden sm:flex items-center bg-brand-bg border border-brand-border rounded-lg px-3 py-1.5 focus-within:border-neon-blue transition-colors">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input 
            type="text" 
            placeholder="Buscar productos..." 
            className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-500 w-64"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neon-blue to-neon-purple flex items-center justify-center text-white font-bold text-xs">
          AD
        </div>
      </div>
    </header>
  );
}
