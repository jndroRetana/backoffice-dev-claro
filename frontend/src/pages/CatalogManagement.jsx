import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { catalogService } from '../services/api';

const CatalogManagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const [countries, setCountries] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(''); // 'add', 'edit', 'delete'
  const [catalogType, setCatalogType] = useState(''); // 'country', 'device'
  const [formValue, setFormValue] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [countriesData, devicesData] = await Promise.all([
          catalogService.getCountries(),
          catalogService.getDevices()
        ]);
        
        setCountries(countriesData);
        setDevices(devicesData);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar catálogos:', error);
        setNotification({
          open: true,
          message: 'Error al cargar los datos de catálogos',
          severity: 'error'
        });
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Cambio de pestaña
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Abrir diálogo
  const handleOpenDialog = (type, catalogType, item = '') => {
    setDialogType(type);
    setCatalogType(catalogType);
    setSelectedItem(item);
    setFormValue(type === 'edit' ? item : '');
    setOpenDialog(true);
  };

  // Cerrar diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormValue('');
    setSelectedItem('');
  };

  // Manejar cambio en el formulario
  const handleFormChange = (e) => {
    setFormValue(e.target.value);
  };

  // Manejar submit del formulario
  const handleSubmit = async () => {
    try {
      // Solo validamos el campo vacío para las operaciones de agregar y editar, no para eliminar
      if (dialogType !== 'delete' && !formValue.trim()) {
        setNotification({
          open: true,
          message: 'El campo no puede estar vacío',
          severity: 'error'
        });
        return;
      }

      let result;
      
      if (catalogType === 'country') {
        if (dialogType === 'add') {
          result = await catalogService.addCountry(formValue);
          setCountries(result);
        } else if (dialogType === 'edit') {
          result = await catalogService.updateCountry(selectedItem, formValue);
          setCountries(result);
        } else if (dialogType === 'delete') {
          result = await catalogService.deleteCountry(selectedItem);
          setCountries(result);
        }
      } else if (catalogType === 'device') {
        if (dialogType === 'add') {
          result = await catalogService.addDevice(formValue);
          setDevices(result);
        } else if (dialogType === 'edit') {
          result = await catalogService.updateDevice(selectedItem, formValue);
          setDevices(result);
        } else if (dialogType === 'delete') {
          result = await catalogService.deleteDevice(selectedItem);
          setDevices(result);
        }
      }

      setNotification({
        open: true,
        message: `Operación realizada con éxito`,
        severity: 'success'
      });
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error en operación de catálogo:', error);
      setNotification({
        open: true,
        message: error.response?.data?.error || 'Error al realizar la operación',
        severity: 'error'
      });
    }
  };

  // Cerrar notificación
  const handleCloseNotification = () => {
    setNotification({...notification, open: false});
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Administración de Catálogos
      </Typography>
      
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Países" />
          <Tab label="Dispositivos" />
        </Tabs>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 2 }}>
        {/* Panel de Países */}
        {tabValue === 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Lista de Países
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('add', 'country')}
              >
                Agregar País
              </Button>
            </Box>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : countries.length === 0 ? (
              <Typography color="textSecondary" sx={{ textAlign: 'center', p: 2 }}>
                No hay países configurados
              </Typography>
            ) : (
              <List>
                {countries.map((country) => (
                  <ListItem 
                    key={country} 
                    divider
                    secondaryAction={
                      <Box>
                        <IconButton 
                          edge="end" 
                          aria-label="edit"
                          onClick={() => handleOpenDialog('edit', 'country', country)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          edge="end" 
                          aria-label="delete"
                          onClick={() => handleOpenDialog('delete', 'country', country)}
                          sx={{ ml: 1 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText primary={country} />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}
        
        {/* Panel de Dispositivos */}
        {tabValue === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Lista de Dispositivos
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('add', 'device')}
              >
                Agregar Dispositivo
              </Button>
            </Box>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : devices.length === 0 ? (
              <Typography color="textSecondary" sx={{ textAlign: 'center', p: 2 }}>
                No hay dispositivos configurados
              </Typography>
            ) : (
              <List>
                {devices.map((device) => (
                  <ListItem 
                    key={device} 
                    divider
                    secondaryAction={
                      <Box>
                        <IconButton 
                          edge="end" 
                          aria-label="edit"
                          onClick={() => handleOpenDialog('edit', 'device', device)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          edge="end" 
                          aria-label="delete"
                          onClick={() => handleOpenDialog('delete', 'device', device)}
                          sx={{ ml: 1 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText primary={device} />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}
      </Paper>
      
      {/* Diálogo para agregar/editar/eliminar */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogType === 'add' && `Agregar ${catalogType === 'country' ? 'País' : 'Dispositivo'}`}
          {dialogType === 'edit' && `Editar ${catalogType === 'country' ? 'País' : 'Dispositivo'}`}
          {dialogType === 'delete' && `Eliminar ${catalogType === 'country' ? 'País' : 'Dispositivo'}`}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'delete' ? (
            <Typography>
              ¿Estás seguro que deseas eliminar {selectedItem}?
            </Typography>
          ) : (
            <TextField
              autoFocus
              margin="dense"
              label={catalogType === 'country' ? 'Nombre del País' : 'Nombre del Dispositivo'}
              type="text"
              fullWidth
              value={formValue}
              onChange={handleFormChange}
              variant="outlined"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} color="primary">
            {dialogType === 'add' && 'Agregar'}
            {dialogType === 'edit' && 'Guardar'}
            {dialogType === 'delete' && 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notificaciones */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CatalogManagement;
