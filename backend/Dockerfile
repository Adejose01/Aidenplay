# ======================================================================
# BACKEND (PocketBase) - Alpine Dockerfile
# ======================================================================

FROM alpine:latest

# Versión de PocketBase (puedes actualizarla según corresponda)
ARG PB_VERSION=0.22.27

# Instalar dependencias necesarias para descargar e instalar
RUN apk add --no-cache \
    unzip \
    ca-certificates \
    wget

# Descargar y descomprimir PocketBase
RUN wget -q https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip \
    -O /tmp/pb.zip \
    && unzip /tmp/pb.zip -d /pb/ \
    && rm /tmp/pb.zip

# Copiar configuración, hooks o base de datos pre-existente si las hubiera
COPY ./pb_hooks /pb/pb_hooks
COPY ./pb_migrations /pb/pb_migrations

# Exponer el puerto
EXPOSE 8090

# Punto de entrada para levantar PocketBase
# http=0.0.0.0:8090 asegura que escuche desde cualquier IP externa al contenedor
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090"]
