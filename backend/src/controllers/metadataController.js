import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Definir __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al archivo de datos
const dataFilePath = path.join(__dirname, '../../data/metadata.json');

// Asegurar que el archivo existe
const ensureDataFileExists = () => {
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2));
  }
};

// Leer datos
const readData = () => {
  ensureDataFileExists();
  const data = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(data);
};

// Escribir datos
const writeData = (data) => {
  ensureDataFileExists();
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Generar ID único
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

/**
 * Obtener todas las llaves de configuración
 */
export const getAllMetadata = (req, res) => {
  try {
    const data = readData();
    
    // Formato de salida original para uso interno del backoffice
    if (req.query.format === 'full') {
      return res.json(data);
    }
    
    // Nuevo formato: separar en translations y configurations
    const result = {
      translations: {},
      configurations: {}
    };
    
    data.forEach(item => {
      // Si es un objeto, va a configurations
      if (typeof item.value === 'object' && item.value !== null) {
        result.configurations[item.key] = JSON.stringify(item.value);
      } else {
        // Si es texto u otro tipo, va a translations
        result.translations[item.key] = item.value;
      }
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error al obtener metadata:', error);
    res.status(500).json({ error: 'Error al obtener metadata' });
  }
};

/**
 * Obtener llaves por país y dispositivo
 */
export const getMetadataByCountryAndDevice = (req, res) => {
  try {
    const { country, device } = req.params;
    const data = readData();
    
    const filteredData = data.filter(
      item => item.country.toLowerCase() === country.toLowerCase() && 
              item.device.toLowerCase() === device.toLowerCase()
    );
    
    // Formato de salida original para uso interno del backoffice
    if (req.query.format === 'full') {
      return res.json(filteredData);
    }
    
    // Nuevo formato: separar en translations y configurations
    const result = {
      translations: {},
      configurations: {}
    };
    
    filteredData.forEach(item => {
      // Si es un objeto, va a configurations
      if (typeof item.value === 'object' && item.value !== null) {
        result.configurations[item.key] = JSON.stringify(item.value);
      } else {
        // Si es texto u otro tipo, va a translations
        result.translations[item.key] = item.value;
      }
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error al obtener metadata por país y dispositivo:', error);
    res.status(500).json({ error: 'Error al obtener metadata' });
  }
};

/**
 * Obtener llaves por país
 */
export const getMetadataByCountry = (req, res) => {
  try {
    const { country } = req.params;
    const data = readData();
    
    const filteredData = data.filter(
      item => item.country.toLowerCase() === country.toLowerCase()
    );
    
    // Formato de salida original para uso interno del backoffice
    if (req.query.format === 'full') {
      return res.json(filteredData);
    }
    
    // Nuevo formato: separar en translations y configurations
    const result = {
      translations: {},
      configurations: {}
    };
    
    filteredData.forEach(item => {
      // Si es un objeto, va a configurations
      if (typeof item.value === 'object' && item.value !== null) {
        result.configurations[item.key] = JSON.stringify(item.value);
      } else {
        // Si es texto u otro tipo, va a translations
        result.translations[item.key] = item.value;
      }
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error al obtener metadata por país:', error);
    res.status(500).json({ error: 'Error al obtener metadata' });
  }
};

/**
 * Crear nueva llave de configuración
 */
export const createMetadata = (req, res) => {
  try {
    const { key, value, country, device, description } = req.body;
    
    // Validar datos requeridos
    if (!key || !value || !country || !device) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Validar si el valor es JSON válido cuando se indica
    let parsedValue = value;
    if (typeof value === 'string' && value.trim().startsWith('{')) {
      try {
        parsedValue = JSON.parse(value);
      } catch (e) {
        return res.status(400).json({ error: 'El valor JSON no es válido' });
      }
    }
    
    const data = readData();
    
    // Verificar si ya existe la llave para ese país y dispositivo
    const exists = data.some(
      item => item.key === key && 
              item.country.toLowerCase() === country.toLowerCase() && 
              item.device.toLowerCase() === device.toLowerCase()
    );
    
    if (exists) {
      return res.status(400).json({ error: 'Ya existe una llave con ese nombre para el país y dispositivo especificados' });
    }
    
    // Crear nuevo registro
    const newMetadata = {
      id: generateId(),
      key,
      value: parsedValue,
      country,
      device,
      description: description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    data.push(newMetadata);
    writeData(data);
    
    res.status(201).json(newMetadata);
  } catch (error) {
    console.error('Error al crear metadata:', error);
    res.status(500).json({ error: 'Error al crear metadata' });
  }
};

/**
 * Actualizar llave de configuración existente
 */
export const updateMetadata = (req, res) => {
  try {
    const { id } = req.params;
    const { key, value, country, device, description } = req.body;
    
    // Validar datos requeridos
    if (!key || !value || !country || !device) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Validar si el valor es JSON válido cuando se indica
    let parsedValue = value;
    if (typeof value === 'string' && value.trim().startsWith('{')) {
      try {
        parsedValue = JSON.parse(value);
      } catch (e) {
        return res.status(400).json({ error: 'El valor JSON no es válido' });
      }
    }
    
    const data = readData();
    
    // Encontrar el índice del elemento a actualizar
    const index = data.findIndex(item => item.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Llave de configuración no encontrada' });
    }
    
    // Verificar si la nueva combinación de llave, país y dispositivo ya existe (excluyendo el actual)
    const exists = data.some(
      (item, i) => i !== index && 
                  item.key === key && 
                  item.country.toLowerCase() === country.toLowerCase() && 
                  item.device.toLowerCase() === device.toLowerCase()
    );
    
    if (exists) {
      return res.status(400).json({ error: 'Ya existe una llave con ese nombre para el país y dispositivo especificados' });
    }
    
    // Actualizar registro
    data[index] = {
      ...data[index],
      key,
      value: parsedValue,
      country,
      device,
      description: description || data[index].description,
      updatedAt: new Date().toISOString()
    };
    
    writeData(data);
    
    res.json(data[index]);
  } catch (error) {
    console.error('Error al actualizar metadata:', error);
    res.status(500).json({ error: 'Error al actualizar metadata' });
  }
};

/**
 * Eliminar llave de configuración
 */
export const deleteMetadata = (req, res) => {
  try {
    const { id } = req.params;
    const data = readData();
    
    // Encontrar el índice del elemento a eliminar
    const index = data.findIndex(item => item.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Llave de configuración no encontrada' });
    }
    
    // Eliminar registro
    const deleted = data.splice(index, 1)[0];
    writeData(data);
    
    res.json({ message: 'Llave de configuración eliminada correctamente', deleted });
  } catch (error) {
    console.error('Error al eliminar metadata:', error);
    res.status(500).json({ error: 'Error al eliminar metadata' });
  }
};
