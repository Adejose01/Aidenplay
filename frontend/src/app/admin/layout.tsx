"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { pb } from "@/lib/pocketbase";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import { Toaster, toast } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  // Verificación de autenticación robusta
  useEffect(() => {
    // Validar token de PocketBase
    if (!pb.authStore.isValid) {
      toast.error("Sesión inválida o expirada. Por favor ingresa de nuevo.");
      router.push("/login");
      return;
    }

    // Opcional: Podrías hacer una llamada a pb.collection('users').authRefresh() 
    // para estar 100% seguro de que el token sigue siendo válido en el servidor.
  }, [router]);

  return (
    <div className="min-h-screen bg-brand-bg flex text-white font-sans">
      <Toaster theme="dark" position="top-right" />
      
      {/* Sidebar con manejo de estado móvil */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-h-screen max-w-full overflow-hidden">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
