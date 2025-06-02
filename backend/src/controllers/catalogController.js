import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Definir __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al archivo de catálogos
const catalogFilePath = path.join(__dirname, '../../data/catalog.json');

// Asegurar que el archivo existe
const ensureCatalogFileExists = () => {
  if (!fs.existsSync(catalogFilePath)) {
    const defaultData = {
      countries: [
        "Argentina", "Brasil", "Chile", "Colombia", "Costa Rica", 
        "Ecuador", "México", "Perú", "Estados Unidos", "España"
      ],
      devices: [
        "Samsung", "LG", "Hisense", "Sony", "Panasonic", 
        "TCL", "Philips", "Sharp", "Xiaomi", "Otros"
      ]
    };
    fs.writeFileSync(catalogFilePath, JSON.stringify(defaultData, null, 2));
  }
};

// Leer datos
const readCatalog = () => {
  ensureCatalogFileExists();
  const data = fs.readFileSync(catalogFilePath, 'utf8');
  return JSON.parse(data);
};

// Escribir datos
const writeCatalog = (data) => {
  ensureCatalogFileExists();
  fs.writeFileSync(catalogFilePath, JSON.stringify(data, null, 2));
};

/**
 * Obtener todos los países
 */
export const getCountries = (req, res) => {
  try {
    const data = readCatalog();
    res.json(data.countries);
  } catch (error) {
    console.error('Error al obtener países:', error);
    res.status(500).json({ error: 'Error al obtener países' });
  }
};

/**
 * Agregar un nuevo país
 */
export const addCountry = (req, res) => {
  try {
    const { country } = req.body;
    
    if (!country || country.trim() === '') {
      return res.status(400).json({ error: 'El nombre del país es requerido' });
    }
    
    const data = readCatalog();
    
    // Verificar si ya existe
    if (data.countries.includes(country)) {
      return res.status(400).json({ error: 'El país ya existe' });
    }
    
    // Agregar país
    data.countries.push(country);
    writeCatalog(data);
    
    res.status(201).json(data.countries);
  } catch (error) {
    console.error('Error al agregar país:', error);
    res.status(500).json({ error: 'Error al agregar país' });
  }
};

/**
 * Actualizar un país
 */
export const updateCountry = (req, res) => {
  try {
    const { oldCountry, newCountry } = req.body;
    
    if (!oldCountry || !newCountry || oldCountry.trim() === '' || newCountry.trim() === '') {
      return res.status(400).json({ error: 'Los nombres de país son requeridos' });
    }
    
    const data = readCatalog();
    
    // Verificar si existe el país a actualizar
    const index = data.countries.indexOf(oldCountry);
    if (index === -1) {
      return res.status(404).json({ error: 'País no encontrado' });
    }
    
    // Verificar si ya existe el nuevo nombre
    if (data.countries.includes(newCountry) && oldCountry !== newCountry) {
      return res.status(400).json({ error: 'El nuevo nombre de país ya existe' });
    }
    
    // Actualizar país
    data.countries[index] = newCountry;
    writeCatalog(data);
    
    // También actualizar todas las referencias en los metadatos
    updateMetadataReferences('country', oldCountry, newCountry);
    
    res.json(data.countries);
  } catch (error) {
    console.error('Error al actualizar país:', error);
    res.status(500).json({ error: 'Error al actualizar país' });
  }
};

/**
 * Eliminar un país
 */
export const deleteCountry = (req, res) => {
  try {
    const { country } = req.params;
    
    const data = readCatalog();
    
    // Verificar si existe
    const index = data.countries.indexOf(country);
    if (index === -1) {
      return res.status(404).json({ error: 'País no encontrado' });
    }
    
    // Verificar si hay metadatos usando este país
    const isInUse = checkIfCatalogItemInUse('country', country);
    if (isInUse) {
      return res.status(400).json({ 
        error: 'No se puede eliminar el país porque está siendo utilizado por una o más llaves de configuración' 
      });
    }
    
    // Eliminar país
    data.countries.splice(index, 1);
    writeCatalog(data);
    
    res.json(data.countries);
  } catch (error) {
    console.error('Error al eliminar país:', error);
    res.status(500).json({ error: 'Error al eliminar país' });
  }
};

/**
 * Obtener todos los dispositivos
 */
export const getDevices = (req, res) => {
  try {
    const data = readCatalog();
    res.json(data.devices);
  } catch (error) {
    console.error('Error al obtener dispositivos:', error);
    res.status(500).json({ error: 'Error al obtener dispositivos' });
  }
};

/**
 * Agregar un nuevo dispositivo
 */
export const addDevice = (req, res) => {
  try {
    const { device } = req.body;
    
    if (!device || device.trim() === '') {
      return res.status(400).json({ error: 'El nombre del dispositivo es requerido' });
    }
    
    const data = readCatalog();
    
    // Verificar si ya existe
    if (data.devices.includes(device)) {
      return res.status(400).json({ error: 'El dispositivo ya existe' });
    }
    
    // Agregar dispositivo
    data.devices.push(device);
    writeCatalog(data);
    
    res.status(201).json(data.devices);
  } catch (error) {
    console.error('Error al agregar dispositivo:', error);
    res.status(500).json({ error: 'Error al agregar dispositivo' });
  }
};

/**
 * Actualizar un dispositivo
 */
export const updateDevice = (req, res) => {
  try {
    const { oldDevice, newDevice } = req.body;
    
    if (!oldDevice || !newDevice || oldDevice.trim() === '' || newDevice.trim() === '') {
      return res.status(400).json({ error: 'Los nombres de dispositivo son requeridos' });
    }
    
    const data = readCatalog();
    
    // Verificar si existe el dispositivo a actualizar
    const index = data.devices.indexOf(oldDevice);
    if (index === -1) {
      return res.status(404).json({ error: 'Dispositivo no encontrado' });
    }
    
    // Verificar si ya existe el nuevo nombre
    if (data.devices.includes(newDevice) && oldDevice !== newDevice) {
      return res.status(400).json({ error: 'El nuevo nombre de dispositivo ya existe' });
    }
    
    // Actualizar dispositivo
    data.devices[index] = newDevice;
    writeCatalog(data);
    
    // También actualizar todas las referencias en los metadatos
    updateMetadataReferences('device', oldDevice, newDevice);
    
    res.json(data.devices);
  } catch (error) {
    console.error('Error al actualizar dispositivo:', error);
    res.status(500).json({ error: 'Error al actualizar dispositivo' });
  }
};

/**
 * Eliminar un dispositivo
 */
export const deleteDevice = (req, res) => {
  try {
    const { device } = req.params;
    
    const data = readCatalog();
    
    // Verificar si existe
    const index = data.devices.indexOf(device);
    if (index === -1) {
      return res.status(404).json({ error: 'Dispositivo no encontrado' });
    }
    
    // Verificar si hay metadatos usando este dispositivo
    const isInUse = checkIfCatalogItemInUse('device', device);
    if (isInUse) {
      return res.status(400).json({ 
        error: 'No se puede eliminar el dispositivo porque está siendo utilizado por una o más llaves de configuración' 
      });
    }
    
    // Eliminar dispositivo
    data.devices.splice(index, 1);
    writeCatalog(data);
    
    res.json(data.devices);
  } catch (error) {
    console.error('Error al eliminar dispositivo:', error);
    res.status(500).json({ error: 'Error al eliminar dispositivo' });
  }
};

// Funciones auxiliares

/**
 * Actualiza las referencias en los metadatos cuando se cambia un país o dispositivo
 */
const updateMetadataReferences = (field, oldValue, newValue) => {
  try {
    const metadataFilePath = path.join(__dirname, '../../data/metadata.json');
    if (!fs.existsSync(metadataFilePath)) return;
    
    const metadataData = JSON.parse(fs.readFileSync(metadataFilePath, 'utf8'));
    let updated = false;
    
    metadataData.forEach(item => {
      if (item[field] === oldValue) {
        item[field] = newValue;
        item.updatedAt = new Date().toISOString();
        updated = true;
      }
    });
    
    if (updated) {
      fs.writeFileSync(metadataFilePath, JSON.stringify(metadataData, null, 2));
    }
  } catch (error) {
    console.error(`Error al actualizar referencias en metadatos para ${field}:`, error);
  }
};

/**
 * Verifica si un país o dispositivo está siendo utilizado por alguna llave de configuración
 */
const checkIfCatalogItemInUse = (field, value) => {
  try {
    const metadataFilePath = path.join(__dirname, '../../data/metadata.json');
    if (!fs.existsSync(metadataFilePath)) return false;
    
    const metadataData = JSON.parse(fs.readFileSync(metadataFilePath, 'utf8'));
    return metadataData.some(item => item[field] === value);
  } catch (error) {
    console.error(`Error al verificar uso de ${field}:`, error);
    return false;
  }
};
