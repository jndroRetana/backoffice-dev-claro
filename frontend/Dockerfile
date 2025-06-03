# Stage 1: Build - Construir la aplicación
FROM node:20-alpine as build

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el código fuente
COPY . .

# Argumentos de construcción para inyectar variables de entorno
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Construir la aplicación para producción
RUN npm run build

# Stage 2: Production - Servir la aplicación con Nginx
FROM nginx:alpine

# Copiar la configuración personalizada de nginx si es necesaria
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos compilados desde la etapa de build
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
