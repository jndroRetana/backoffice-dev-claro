import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

// Definir __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al archivo único de mocks
const mocksFilePath = path.join(__dirname, '../../data/mocks.json');

// Asegurar que el directorio existe
const mocksDir = path.join(__dirname, '../../data');
if (!fs.existsSync(mocksDir)) {
  fs.mkdirSync(mocksDir, { recursive: true });
}

// Asegurar que el archivo de mocks existe
if (!fs.existsSync(mocksFilePath)) {
  fs.writeFileSync(mocksFilePath, JSON.stringify([], null, 2));
}

// Generar un ID único para el mock
const generateMockId = () => {
  return crypto.randomBytes(6).toString('hex');
};

// Leer todos los mocks
const readMocks = () => {
  try {
    const data = fs.readFileSync(mocksFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error al leer mocks:', err);
    return [];
  }
};

// Guardar todos los mocks
const saveMocks = (mocks) => {
  try {
    fs.writeFileSync(mocksFilePath, JSON.stringify(mocks, null, 2));
    return true;
  } catch (err) {
    console.error('Error al guardar mocks:', err);
    return false;
  }
};

// Migrar mocks antiguos (si existen)
const migrateLegacyMocks = () => {
  const legacyMocksDir = path.join(__dirname, '../../data/mocks');
  if (!fs.existsSync(legacyMocksDir)) {
    return;
  }

  try {
    // Obtener mocks existentes
    const mocks = readMocks();
    const existingIds = new Set(mocks.map(mock => mock.id));
    
    // Leer archivos de mocks antiguos
    const files = fs.readdirSync(legacyMocksDir).filter(file => file.endsWith('.json'));
    let migratedCount = 0;
    
    for (const file of files) {
      const mockId = file.replace('.json', '');
      
      // Omitir si ya existe
      if (existingIds.has(mockId)) {
        continue;
      }
      
      try {
        const mockPath = path.join(legacyMocksDir, file);
        const mockContent = JSON.parse(fs.readFileSync(mockPath, 'utf-8'));
        
        // Determinar formato y extraer datos
        let mockData, mockName, mockCreatedAt;
        
        if (mockContent.data && mockContent.name) {
          // Formato nuevo con metadata
          mockData = mockContent.data;
          mockName = mockContent.name;
          mockCreatedAt = mockContent.createdAt || new Date().toISOString();
        } else if (mockContent.data) {
          // Formato intermedio
          mockData = mockContent.data;
          mockName = `Mock ${mockId}`;
          mockCreatedAt = new Date().toISOString();
        } else {
          // Formato antiguo
          mockData = mockContent;
          mockName = `Mock ${mockId}`;
          mockCreatedAt = new Date().toISOString();
        }
        
        // Añadir al nuevo formato
        mocks.push({
          id: mockId,
          name: mockName,
          data: mockData,
          url: `/api/mock/${mockId}`,
          createdAt: mockCreatedAt
        });
        
        migratedCount++;
      } catch (err) {
        console.error(`Error al migrar mock ${mockId}:`, err);
      }
    }
    
    if (migratedCount > 0) {
      saveMocks(mocks);
      console.log(`Se migraron ${migratedCount} mocks antiguos al nuevo formato`);
    }
  } catch (err) {
    console.error('Error durante la migración de mocks:', err);
  }
};

// Ejecutar migración al cargar el controlador
migrateLegacyMocks();

// Crear un nuevo mock
export const createMock = (req, res) => {
  try {
    const { jsonData, name } = req.body;
    
    // Validar que se ha proporcionado un JSON válido
    if (!jsonData) {
      return res.status(400).json({
        error: true,
        message: 'Se requiere proporcionar datos JSON'
      });
    }
    
    // Intentar parsear el JSON si se envía como string
    let mockData;
    try {
      mockData = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    } catch (err) {
      return res.status(400).json({
        error: true,
        message: 'El JSON proporcionado no es válido'
      });
    }
    
    // Generar ID único para el mock
    const mockId = generateMockId();
    const mockName = name || `Mock ${mockId}`;
    const createdAt = new Date().toISOString();
    const mockUrl = `/api/mock/${mockId}`;
    
    // Añadir el nuevo mock al array existente
    const mocks = readMocks();
    mocks.push({
      id: mockId,
      name: mockName,
      data: mockData,
      url: mockUrl,
      createdAt
    });
    
    // Guardar todos los mocks
    saveMocks(mocks);
    
    res.status(201).json({
      error: false,
      message: 'Mock creado exitosamente',
      mockId,
      mockUrl,
      name: mockName,
      createdAt
    });
    
  } catch (err) {
    console.error('Error al crear mock:', err);
    res.status(500).json({
      error: true,
      message: 'Error al crear el mock',
      details: process.env.NODE_ENV === 'development' ? err.message : null
    });
  }
};

// Obtener un mock por su ID
export const getMock = (req, res) => {
  try {
    const { mockId } = req.params;
    const mocks = readMocks();
    const mock = mocks.find(m => m.id === mockId);
    
    // Verificar si el mock existe
    if (!mock) {
      return res.status(404).json({
        error: true,
        message: 'Mock no encontrado'
      });
    }
    
    // Devolver el mock (solo los datos)
    res.status(200).json(mock.data);
    
  } catch (err) {
    console.error('Error al obtener mock:', err);
    res.status(500).json({
      error: true,
      message: 'Error al obtener el mock',
      details: process.env.NODE_ENV === 'development' ? err.message : null
    });
  }
};

// Listar todos los mocks disponibles
export const listMocks = (req, res) => {
  try {
    const mocks = readMocks();
    
    // Formatear para mantener la compatibilidad con el frontend existente
    const formattedMocks = mocks.map(mock => ({
      mockId: mock.id,
      mockUrl: mock.url,
      name: mock.name,
      createdAt: mock.createdAt
    }));
    
    res.status(200).json(formattedMocks);
    
  } catch (err) {
    console.error('Error al listar mocks:', err);
    res.status(500).json({
      error: true,
      message: 'Error al listar los mocks',
      details: process.env.NODE_ENV === 'development' ? err.message : null
    });
  }
};

// Eliminar un mock por su ID
export const deleteMock = (req, res) => {
  try {
    const { mockId } = req.params;
    const mocks = readMocks();
    const initialLength = mocks.length;
    
    // Filtrar para eliminar el mock con el ID especificado
    const updatedMocks = mocks.filter(mock => mock.id !== mockId);
    
    // Verificar si se encontró el mock
    if (updatedMocks.length === initialLength) {
      return res.status(404).json({
        error: true,
        message: 'Mock no encontrado'
      });
    }
    
    // Guardar la lista actualizada
    saveMocks(updatedMocks);
    
    res.status(200).json({
      error: false,
      message: 'Mock eliminado exitosamente'
    });
    
  } catch (err) {
    console.error('Error al eliminar mock:', err);
    res.status(500).json({
      error: true,
      message: 'Error al eliminar el mock',
      details: process.env.NODE_ENV === 'development' ? err.message : null
    });
  }
};
