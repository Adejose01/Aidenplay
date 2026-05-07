#!/bin/bash
# ============================================================
# AIDEN PLAY - Instalador Automatizado para Servidor VPS (Ubuntu)
# ============================================================

# Salir inmediatamente si un comando falla
set -e

echo "🚀 Iniciando instalación automatizada de Aiden Play..."

# 1. Actualizar sistema e instalar dependencias necesarias
echo "📦 Instalando dependencias del sistema (Docker, Nginx, Certbot)..."
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose-v2 nginx certbot python3-certbot-nginx git

# 2. Habilitar Docker para que inicie con el sistema
sudo systemctl enable --now docker

# 3. Copiar archivo de configuración de Nginx
echo "🌐 Configurando Nginx para aidenplay.com y db.aidenplay.com..."
sudo cp nginx/aidenplay.conf /etc/nginx/sites-available/aidenplay
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/aidenplay /etc/nginx/sites-enabled/aidenplay

# 4. Reiniciar Nginx para aplicar configuración
sudo systemctl restart nginx

# 5. Levantar contenedores Docker (Frontend y Backend)
echo "🐳 Construyendo y levantando contenedores Docker..."
# Creamos el archivo .env de producción para Next.js con el dominio real de la API
echo "NEXT_PUBLIC_PB_URL=https://db.aidenplay.com" > frontend/.env.production
sudo docker compose up -d --build

echo "============================================================"
echo "✅ ¡Instalación base completada con éxito!"
echo "============================================================"
echo ""
echo "⚠️  PASO FINAL REQUERIDO:"
echo "1. Ve a donde compraste tu dominio (aidenplay.com)."
echo "2. Crea un Registro 'A' para '@' y 'www' apuntando a la IP de este servidor."
echo "3. Crea un Registro 'A' para 'db' apuntando a la IP de este servidor."
echo ""
echo "Una vez que hayas hecho eso y los DNS se hayan propagado, ejecuta este comando para activar el candado verde (HTTPS):"
echo ""
echo "sudo certbot --nginx -d aidenplay.com -d www.aidenplay.com -d db.aidenplay.com"
echo ""
echo "¡Tu plataforma estará 100% online en unos minutos!"
echo "============================================================"
