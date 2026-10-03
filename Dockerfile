# ==============================================================================
# Multi-stage Dockerfile - Web Chepita MTC (Next.js SPA + Nginx)
# Optimizado para Google Cloud Run (Puerto 8080)
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Builder (Compilación estática de Next.js)
# ------------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependencias necesarias para compilar módulos si aplica
RUN apk add --no-cache libc6-compat

# Copiar manifiestos de paquetes
COPY package.json package-lock.json ./

# Instalación determinística con cache limpio
RUN npm ci

# Copiar el código fuente completo del proyecto
COPY . .

# Argumentos de compilación para variables públicas en el frontend
ARG NEXT_PUBLIC_API_URL=https://project-d5c1b1cb-efd2-47ae-ad8.uc.r.appspot.com/api/v1
ARG NEXT_PUBLIC_API_BASE=https://project-d5c1b1cb-efd2-47ae-ad8.uc.r.appspot.com
ARG NEXT_PUBLIC_APP_URL=http://localhost:8080

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_API_BASE=${NEXT_PUBLIC_API_BASE}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NODE_ENV=production

# Ejecutar el build estático de Next.js (Genera el directorio /app/out)
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Runner (Servidor Web Nginx liviano para Cloud Run)
# ------------------------------------------------------------------------------
FROM nginx:alpine AS runner

# Remover la configuración por defecto de Nginx
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copiar configuración personalizada que escucha en el puerto 8080 y soporta SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar el bundle estático compilado desde la etapa de construcción
COPY --from=builder /app/out /usr/share/nginx/html

# Puerto estándar de ejecución requerido por Google Cloud Run
EXPOSE 8080

# Iniciar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
