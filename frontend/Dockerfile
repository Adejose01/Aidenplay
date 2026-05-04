# ======================================================================
# FRONTEND (Next.js 14) - Multi-stage Dockerfile (Standalone)
# ======================================================================

# 1. Base image
FROM node:20-alpine AS base
# Agregar dependencias de sistema comunes
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 2. Dependencies stage
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# 3. Builder stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Configurar la variable de entorno para evitar recolectar telemetría
ENV NEXT_TELEMETRY_DISABLED 1
# Construir la aplicación
RUN npm run build

# 4. Runner stage (Production)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Crear usuario no root por seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos estáticos
COPY --from=builder /app/public ./public

# Configurar permisos para la caché
RUN mkdir .next
RUN chown nextjs:nodejs .next

# En el modo "standalone", Next.js extrae solo lo necesario
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Cambiar a usuario no privilegiado
USER nextjs

EXPOSE 3000
ENV PORT 3000
# Permite enlazar a todas las interfaces
ENV HOSTNAME "0.0.0.0"

# Iniciar servidor standalone
CMD ["node", "server.js"]
