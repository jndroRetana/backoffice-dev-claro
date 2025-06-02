# Despliegue con Docker Compose

Este documento explica cómo desplegar la aplicación de Backoffice usando Docker Compose.

## Requisitos previos

- Docker instalado (versión 20.10.0 o superior)
- Docker Compose instalado (versión 2.0.0 o superior)

## Estructura de archivos

El proyecto incluye los siguientes archivos para el despliegue con Docker:

- `docker-compose.yml` - Configuración principal para orquestar los servicios
- `backend/Dockerfile` - Instrucciones para construir la imagen del backend
- `frontend/Dockerfile` - Instrucciones para construir la imagen del frontend

## Instrucciones de despliegue

### 1. Construir y arrancar los contenedores

Desde el directorio raíz del proyecto, ejecuta:

```bash
docker-compose up -d
```

Este comando construirá las imágenes si no existen y arrancará los contenedores en modo "detached".

### 2. Verificar que los servicios están funcionando

```bash
docker-compose ps
```

Deberías ver dos servicios ejecutándose:
- `backoffice-backend` en el puerto 3000
- `backoffice-frontend` en el puerto 8080

### 3. Acceder a la aplicación

- Frontend: http://localhost:8080
- API Backend: http://localhost:3000

### 4. Ver logs de los contenedores

```bash
# Ver logs de todos los servicios
docker-compose logs

# Ver logs de un servicio específico
docker-compose logs backend
docker-compose logs frontend

# Ver logs en tiempo real
docker-compose logs -f
```

### 5. Detener los contenedores

```bash
docker-compose down
```

Para eliminar también las imágenes, volúmenes y redes creadas:

```bash
docker-compose down --rmi all -v
```

## Variables de entorno

### Backend
- `NODE_ENV`: Entorno de ejecución (production, development)
- `PORT`: Puerto en el que se ejecutará el servidor (3000 por defecto)

### Frontend
- `VITE_API_URL`: URL del backend (http://backend:3000 dentro de la red de Docker)

## Personalización

Si necesitas personalizar la configuración de Docker Compose, puedes modificar los siguientes archivos:

- `docker-compose.yml`: Para cambiar puertos, variables de entorno o configuraciones de red
- `backend/Dockerfile`: Para modificar la construcción de la imagen del backend
- `frontend/Dockerfile`: Para modificar la construcción de la imagen del frontend

## Solución de problemas

### El frontend no puede conectarse al backend

Asegúrate de que la variable de entorno `VITE_API_URL` esté configurada correctamente en el servicio frontend del archivo `docker-compose.yml`.

### Los cambios en el código no se reflejan

Los contenedores no actualizan automáticamente el código. Necesitas reconstruir las imágenes:

```bash
docker-compose up -d --build
```
