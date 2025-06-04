const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3013';

export const mockApi = {
  // Crear un nuevo mock
  async createMock(jsonData, name = '') {
    try {
      const response = await fetch(`${API_URL}/api/mock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jsonData, name }),
      });

      return await response.json();
    } catch (error) {
      console.error('Error al crear mock:', error);
      throw error;
    }
  },

  // Obtener todos los mocks
  async getMocks() {
    try {
      const response = await fetch(`${API_URL}/api/mock`);
      return await response.json();
    } catch (error) {
      console.error('Error al obtener mocks:', error);
      throw error;
    }
  },

  // Eliminar un mock
  async deleteMock(mockId) {
    try {
      const response = await fetch(`${API_URL}/api/mock/${mockId}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      console.error('Error al eliminar mock:', error);
      throw error;
    }
  },

  // Obtener URL completa para un mock específico
  getMockUrl(mockId) {
    return `${API_URL}/api/mock/${mockId}`;
  }
};
