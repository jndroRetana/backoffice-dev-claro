import axios from 'axios';

// Obtener la URL de la API desde la variable de entorno o usar un valor por defecto
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3013/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Servicio para manejar países y dispositivos
export const catalogService = {
  // Países
  getCountries: async () => {
    try {
      const response = await api.get('/catalog/countries');
      return response.data;
    } catch (error) {
      console.error('Error al obtener países:', error);
      throw error;
    }
  },
  
  addCountry: async (country) => {
    try {
      const response = await api.post('/catalog/countries', { country });
      return response.data;
    } catch (error) {
      console.error('Error al agregar país:', error);
      throw error;
    }
  },
  
  updateCountry: async (oldCountry, newCountry) => {
    try {
      const response = await api.put('/catalog/countries', { oldCountry, newCountry });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar país:', error);
      throw error;
    }
  },
  
  deleteCountry: async (country) => {
    try {
      const response = await api.delete(`/catalog/countries/${country}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar país:', error);
      throw error;
    }
  },
  
  // Dispositivos
  getDevices: async () => {
    try {
      const response = await api.get('/catalog/devices');
      return response.data;
    } catch (error) {
      console.error('Error al obtener dispositivos:', error);
      throw error;
    }
  },
  
  addDevice: async (device) => {
    try {
      const response = await api.post('/catalog/devices', { device });
      return response.data;
    } catch (error) {
      console.error('Error al agregar dispositivo:', error);
      throw error;
    }
  },
  
  updateDevice: async (oldDevice, newDevice) => {
    try {
      const response = await api.put('/catalog/devices', { oldDevice, newDevice });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar dispositivo:', error);
      throw error;
    }
  },
  
  deleteDevice: async (device) => {
    try {
      const response = await api.delete(`/catalog/devices/${device}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar dispositivo:', error);
      throw error;
    }
  }
};

export const metadataService = {
  // Obtener todas las llaves
  getAllMetadata: async () => {
    try {
      // Utilizamos format=full para obtener el formato completo para el backoffice
      const response = await api.get('/metadata', {
        params: { format: 'full' }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener todas las llaves:', error);
      throw error;
    }
  },

  // Obtener llaves por país
  getMetadataByCountry: async (country) => {
    try {
      // Utilizamos format=full para obtener el formato completo para el backoffice
      const response = await api.get(`/metadata/${country}`, {
        params: { format: 'full' }
      });
      return response.data;
    } catch (error) {
      console.error(`Error al obtener llaves para el país ${country}:`, error);
      throw error;
    }
  },

  // Obtener llaves por país y dispositivo
  getMetadataByCountryAndDevice: async (country, device) => {
    try {
      // Utilizamos format=full para obtener el formato completo para el backoffice
      const response = await api.get(`/metadata/${country}/${device}`, {
        params: { format: 'full' }
      });
      return response.data;
    } catch (error) {
      console.error(`Error al obtener llaves para ${country} y ${device}:`, error);
      throw error;
    }
  },

  // Crear nueva llave
  createMetadata: async (metadataData) => {
    try {
      const response = await api.post('/metadata', metadataData);
      return response.data;
    } catch (error) {
      console.error('Error al crear llave:', error);
      throw error;
    }
  },

  // Actualizar llave existente
  updateMetadata: async (id, metadataData) => {
    try {
      const response = await api.put(`/metadata/${id}`, metadataData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar llave ${id}:`, error);
      throw error;
    }
  },

  // Eliminar llave
  deleteMetadata: async (id) => {
    try {
      const response = await api.delete(`/metadata/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar llave ${id}:`, error);
      throw error;
    }
  }
};

export default api;
