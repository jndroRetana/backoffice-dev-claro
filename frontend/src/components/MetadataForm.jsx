import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { catalogService } from '../services/api';

const MetadataForm = ({ open, handleClose, initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    country: '',
    device: '',
    description: ''
  });
  const [isJsonValue, setIsJsonValue] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      const value = typeof initialData.value === 'object' 
        ? JSON.stringify(initialData.value, null, 2) 
        : initialData.value.toString();
      
      setFormData({
        key: initialData.key || '',
        value,
        country: initialData.country || '',
        device: initialData.device || '',
        description: initialData.description || ''
      });
      
      setIsJsonValue(typeof initialData.value === 'object');
    } else {
      resetForm();
    }
  }, [initialData, open]);

  const resetForm = () => {
    setFormData({
      key: '',
      value: '',
      country: '',
      device: '',
      description: ''
    });
    setIsJsonValue(false);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores al modificar el campo
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const toggleValueFormat = () => {
    setIsJsonValue(!isJsonValue);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.key.trim()) {
      newErrors.key = 'La llave es requerida';
    }
    
    if (!formData.value.trim()) {
      newErrors.value = 'El valor es requerido';
    } else if (isJsonValue) {
      try {
        JSON.parse(formData.value);
      } catch (e) {
        newErrors.value = 'El valor no es un JSON válido';
      }
    }
    
    if (!formData.country.trim()) {
      newErrors.country = 'El país es requerido';
    }
    
    if (!formData.device.trim()) {
      newErrors.device = 'El dispositivo es requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Preparar los datos para enviar
      const submissionData = {
        ...formData,
        value: isJsonValue ? JSON.parse(formData.value) : formData.value
      };
      
      onSubmit(submissionData);
      handleClose();
    }
  };

  // Obtener países y dispositivos de la API
  const [countries, setCountries] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        setLoadingCatalog(true);
        const [countriesData, devicesData] = await Promise.all([
          catalogService.getCountries(),
          catalogService.getDevices()
        ]);
        
        setCountries(countriesData);
        setDevices(devicesData);
        setLoadingCatalog(false);
      } catch (error) {
        console.error('Error al cargar catálogos:', error);
        setLoadingCatalog(false);
      }
    };
    
    fetchCatalogs();
  }, []);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{initialData ? 'Editar' : 'Nueva'} Llave de Configuración</DialogTitle>
      <DialogContent>
        <Box component="form" noValidate sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="key"
                label="Llave"
                value={formData.key}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.key}
                helperText={errors.key}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" required error={!!errors.country}>
                <InputLabel>País</InputLabel>
                <Select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  label="País"
                >
                  {countries.map((country) => (
                    <MenuItem key={country} value={country}>{country}</MenuItem>
                  ))}
                </Select>
                {errors.country && <FormHelperText>{errors.country}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" required error={!!errors.device}>
                <InputLabel>Dispositivo</InputLabel>
                <Select
                  name="device"
                  value={formData.device}
                  onChange={handleChange}
                  label="Dispositivo"
                >
                  {devices.map((device) => (
                    <MenuItem key={device} value={device}>{device}</MenuItem>
                  ))}
                </Select>
                {errors.device && <FormHelperText>{errors.device}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" mt={2}>
                <Typography variant="body2" mr={2}>
                  Formato del valor:
                </Typography>
                <Button 
                  variant="outlined" 
                  color={isJsonValue ? "primary" : "inherit"}
                  onClick={toggleValueFormat}
                  size="small"
                >
                  {isJsonValue ? 'JSON' : 'Texto'}
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="value"
                label="Valor"
                value={formData.value}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                rows={isJsonValue ? 4 : 2}
                error={!!errors.value}
                helperText={errors.value || (isJsonValue ? 'Ingrese un objeto JSON válido' : '')}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Descripción"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {initialData ? 'Actualizar' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MetadataForm;
