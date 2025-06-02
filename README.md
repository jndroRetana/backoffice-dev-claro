# Metadata Admin - Backoffice

Sistema de administración de llaves de configuración organizadas por país y tipo de dispositivo.

## Estructura del Proyecto

```
backoffice/
  ├── frontend/        # Frontend en React con Vite
  └── backend/         # Backend en Express.js
```

## Características

- ✅ Gestión de llaves de configuración por país y dispositivo
- ✅ Soporte para valores en formato texto y JSON 
- ✅ API REST para consultar las llaves según filtros
- ✅ Interfaz de usuario moderna y amigable
- ✅ Dashboard con estadísticas

## Requisitos

- Node.js (>= 14.x)
- npm o yarn

## Instalación

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Ejecución

### Iniciar el Backend

```bash
cd backend
npm run dev
```

El servidor se iniciará en: http://localhost:3000

### Iniciar el Frontend

```bash
cd frontend
npm run dev
```

La aplicación estará disponible en: http://localhost:5173

## API REST

El backend expone un servicio REST para acceder a las llaves de configuración:

- `GET /api/metadata` - Obtener todas las llaves
- `GET /api/metadata/:country` - Obtener llaves por país
- `GET /api/metadata/:country/:device` - Obtener llaves por país y dispositivo
- `POST /api/metadata` - Crear nueva llave
- `PUT /api/metadata/:id` - Actualizar llave existente
- `DELETE /api/metadata/:id` - Eliminar llave

## Estructura de Datos

Ejemplo de una llave de configuración:

```json
{
  "id": "12345abcde",
  "key": "app_theme",
  "value": {
    "primary": "#1976d2",
    "secondary": "#dc004e"
  },
  "country": "México",
  "device": "Samsung",
  "description": "Configuración de tema para la aplicación",
  "createdAt": "2025-05-30T14:00:00.000Z",
  "updatedAt": "2025-05-30T14:00:00.000Z"
}
```
