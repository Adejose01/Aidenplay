"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { pb } from "@/lib/pocketbase";
import { Toaster, toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Iniciar sesión como administrador (bypass SDK para compatibilidad con backend v0.22)
      const authData = await pb.send("/api/admins/auth-with-password", {
        method: "POST",
        body: JSON.stringify({
          identity: email,
          password: password,
        }),
      });
      
      // Actualizar el authStore manualmente
      pb.authStore.save(authData.token, authData.admin);

      // Guardar el token en una cookie para que el middleware lo vea
      document.cookie = `pb_auth=${encodeURIComponent(
        JSON.stringify({ token: pb.authStore.token, model: pb.authStore.model })
      )}; path=/; max-age=86400; SameSite=Lax`;

      toast.success("Inicio de sesión exitoso");
      
      // Redirigir al panel de administración
      router.push("/admin");
    } catch (error) {
      console.error(error);
      toast.error("Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
      <Toaster theme="dark" position="top-right" />
      <div className="bg-brand-card border border-brand-border rounded-xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full border border-neon-purple flex items-center justify-center text-neon-blue mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M21 6H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h.5l.5 6h1l.5-6h1L7 18h1l.5-6h7L16 18h1l.5-6h1l.5 6h1l.5-6H21a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1zM7 11a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4-1.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zM17 11a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
              </svg>
          </div>
          <h1 className="text-2xl font-display font-bold text-white tracking-wide uppercase">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-1">Acceso restringido para personal de Aiden Play</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email de Administrador</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon-blue transition-colors"
              placeholder="admin@aidenplay.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon-blue transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-white text-black font-bold py-2.5 rounded-lg hover:bg-gray-200 transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Iniciando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
