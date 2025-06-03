import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Definir __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Asegurar que el directorio de datos existe
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Rutas
import metadataRoutes from './routes/metadata.js';
import catalogRoutes from './routes/catalog.js';

const app = express();
const PORT = process.env.PORT || 3013;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Rutas API
app.use('/api/metadata', metadataRoutes);
app.use('/api/catalog', catalogRoutes);

// Ruta de verificación de estado
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Servicio funcionando correctamente' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: true,
    message: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : null
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});

export default app;
