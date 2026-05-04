import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Solo proteger rutas que empiecen con /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const pbAuth = request.cookies.get('pb_auth');
    
    // Si no hay token de autenticación (o si queremos ser más estrictos, validar que sea admin)
    if (!pbAuth) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Intentar parsear la cookie pb_auth (normalmente es un string JSON guardado por el cliente)
      // PocketBase guarda por defecto el modelo en la cookie si se configura exportToCookie
      const authData = JSON.parse(decodeURIComponent(pbAuth.value));
      
      // Simple verificación si el modelo guardado indica que es admin (PocketBase admin no tiene "collectionId")
      // Esto depende de cómo se guarde la cookie al iniciar sesión.
      // Por seguridad básica, asumimos que si hay cookie pb_auth válida y tiene token, permite pasar.
      // La verdadera validación siempre ocurre en el servidor PocketBase al hacer peticiones.
      if (!authData.token) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (e) {
      // Si la cookie no es un JSON válido o hubo error, redirigir
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Configurar el matcher para aplicar el middleware solo a /admin y sub-rutas
export const config = {
  matcher: ['/admin/:path*'],
};
