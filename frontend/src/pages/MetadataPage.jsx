import { useState, useEffect } from 'react';
import { 
  Alert,
  Box, 
  Snackbar, 
  Typography,
  CircularProgress
} from '@mui/material';
import { metadataService } from '../services/api';
import MetadataList from '../components/MetadataList';
import MetadataForm from '../components/MetadataForm';

const MetadataPage = () => {
  const [metadata, setMetadata] = useState([]);
  const [filteredMetadata, setFilteredMetadata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [currentMetadata, setCurrentMetadata] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [countries, setCountries] = useState([]);
  const [devices, setDevices] = useState([]);
  const [filters, setFilters] = useState({
    country: '',
    device: ''
  });

  // Cargar datos
  const fetchMetadata = async () => {
    try {
      setLoading(true);
      const data = await metadataService.getAllMetadata();
      setMetadata(data);
      
      // Extraer países y dispositivos únicos
      const uniqueCountries = [...new Set(data.map(item => item.country))];
      const uniqueDevices = [...new Set(data.map(item => item.device))];
      
      setCountries(uniqueCountries);
      setDevices(uniqueDevices);
      
      // Aplicar filtros actuales
      applyFilters(data, filters);
      
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar metadata:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar los datos',
        severity: 'error'
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  // Aplicar filtros a los datos
  const applyFilters = (data, currentFilters) => {
    let filtered = [...data];
    
    if (currentFilters.country) {
      filtered = filtered.filter(item => 
        item.country.toLowerCase() === currentFilters.country.toLowerCase()
      );
    }
    
    if (currentFilters.device) {
      filtered = filtered.filter(item => 
        item.device.toLowerCase() === currentFilters.device.toLowerCase()
      );
    }
    
    setFilteredMetadata(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    applyFilters(metadata, newFilters);
  };

  // Crear nueva llave
  const handleCreate = async (data) => {
    try {
      const newMetadata = await metadataService.createMetadata(data);
      setMetadata([...metadata, newMetadata]);
      applyFilters([...metadata, newMetadata], filters);
      
      setSnackbar({
        open: true,
        message: 'Llave creada exitosamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al crear llave:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Error al crear la llave',
        severity: 'error'
      });
    }
  };

  // Actualizar llave existente
  const handleUpdate = async (data) => {
    try {
      const updatedMetadata = await metadataService.updateMetadata(currentMetadata.id, data);
      
      const updatedList = metadata.map(item => 
        item.id === currentMetadata.id ? updatedMetadata : item
      );
      
      setMetadata(updatedList);
      applyFilters(updatedList, filters);
      
      setSnackbar({
        open: true,
        message: 'Llave actualizada exitosamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al actualizar llave:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Error al actualizar la llave',
        severity: 'error'
      });
    }
  };

  // Eliminar llave
  const handleDelete = async (id) => {
    try {
      await metadataService.deleteMetadata(id);
      
      const updatedList = metadata.filter(item => item.id !== id);
      setMetadata(updatedList);
      applyFilters(updatedList, filters);
      
      setSnackbar({
        open: true,
        message: 'Llave eliminada exitosamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al eliminar llave:', error);
      setSnackbar({
        open: true,
        message: 'Error al eliminar la llave',
        severity: 'error'
      });
    }
  };

  // Abrir formulario para crear
  const handleOpenCreateForm = () => {
    setCurrentMetadata(null);
    setFormOpen(true);
  };

  // Abrir formulario para editar
  const handleOpenEditForm = (metadata) => {
    setCurrentMetadata(metadata);
    setFormOpen(true);
  };

  // Cerrar formulario
  const handleCloseForm = () => {
    setFormOpen(false);
    setCurrentMetadata(null);
  };

  // Manejar envío del formulario
  const handleFormSubmit = (data) => {
    if (currentMetadata) {
      handleUpdate(data);
    } else {
      handleCreate(data);
    }
  };

  // Cerrar snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Administración de Llaves
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <MetadataList
          metadata={filteredMetadata}
          onDelete={handleDelete}
          onEdit={handleOpenEditForm}
          onCreate={handleOpenCreateForm}
          onFilterChange={handleFilterChange}
          countries={countries}
          devices={devices}
        />
      )}

      {/* Formulario de creación/edición */}
      <MetadataForm
        open={formOpen}
        handleClose={handleCloseForm}
        initialData={currentMetadata}
        onSubmit={handleFormSubmit}
      />

      {/* Notificaciones */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MetadataPage;
