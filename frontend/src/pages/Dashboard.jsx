import { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Typography, 
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Skeleton, Button, IconButton
} from '@mui/material';
import { metadataService } from '../services/api';
import { mockApi } from '../services/mockApi';
import StorageIcon from '@mui/icons-material/Storage';
import PublicIcon from '@mui/icons-material/Public';
import DevicesIcon from '@mui/icons-material/Devices';
import ApiIcon from '@mui/icons-material/Api';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Link as RouterLink } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalKeys: 0,
    countries: [],
    devices: [],
    recentEntries: []
  });
  const [mocks, setMocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mocksLoading, setMocksLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const allMetadata = await metadataService.getAllMetadata();
        
        // Calcular estadísticas
        const countries = [...new Set(allMetadata.map(item => item.country))];
        const devices = [...new Set(allMetadata.map(item => item.device))];
        
        // Obtener entradas más recientes (ordenadas por fecha de actualización)
        const recentEntries = [...allMetadata]
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 5);
        
        setStats({
          totalKeys: allMetadata.length,
          countries,
          devices,
          recentEntries
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar datos para el dashboard:', error);
        setLoading(false);
      }
    };
    
    // Cargar los mocks API
    const fetchMocks = async () => {
      try {
        setMocksLoading(true);
        const mocksList = await mockApi.getMocks();
        setMocks(mocksList);
      } catch (error) {
        console.error('Error al cargar mocks:', error);
      } finally {
        setMocksLoading(false);
      }
    };
    
    fetchData();
    fetchMocks();
  }, []);
  
  // Función para copiar URL al portapapeles
  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => console.error('Error al copiar URL:', err));
  };

  const StatCard = ({ icon, title, value, isLoading }) => (
    <Card elevation={3}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            {icon}
          </Grid>
          <Grid item xs>
            <Typography color="textSecondary" variant="subtitle2" gutterBottom>
              {title}
            </Typography>
            {isLoading ? (
              <Skeleton width={80} height={40} />
            ) : (
              <Typography variant="h4">{value}</Typography>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Primera fila: Estadísticas de resumen (tarjetas) */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <StatCard 
            icon={<StorageIcon sx={{ fontSize: 40, color: 'primary.main' }} />}
            title="Total de Llaves"
            value={stats.totalKeys}
            isLoading={loading}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard 
            icon={<PublicIcon sx={{ fontSize: 40, color: 'success.main' }} />}
            title="Países"
            value={stats.countries.length}
            isLoading={loading}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard 
            icon={<DevicesIcon sx={{ fontSize: 40, color: 'info.main' }} />}
            title="Dispositivos"
            value={stats.devices.length}
            isLoading={loading}
          />
        </Grid>
      </Grid>
      
      {/* Segunda fila: Países y Dispositivos */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Países Configurados
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {loading ? (
              Array(3).fill().map((_, i) => (
                <Skeleton key={i} height={40} sx={{ my: 1 }} />
              ))
            ) : stats.countries.length === 0 ? (
              <Typography color="textSecondary">
                No hay países configurados
              </Typography>
            ) : (
              <List dense>
                {stats.countries.map((country) => (
                  <ListItem key={country} divider>
                    <ListItemText primary={country} />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Dispositivos Configurados
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {loading ? (
              Array(3).fill().map((_, i) => (
                <Skeleton key={i} height={40} sx={{ my: 1 }} />
              ))
            ) : stats.devices.length === 0 ? (
              <Typography color="textSecondary">
                No hay dispositivos configurados
              </Typography>
            ) : (
              <List dense>
                {stats.devices.map((device) => (
                  <ListItem key={device} divider>
                    <ListItemText primary={device} />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Tercera fila: Mocks API - Lista simple */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>  
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>
                Mocks API Disponibles
              </Typography>
              <Button 
                component={RouterLink} 
                to="/mocks" 
                variant="contained" 
                size="small" 
                startIcon={<ApiIcon />}
                sx={{ minWidth: '140px' }}
              >
                Gestionar Mocks
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {mocksLoading ? (
              Array(3).fill().map((_, i) => (
                <Skeleton key={i} height={40} sx={{ my: 1 }} />
              ))
            ) : mocks.length === 0 ? (
              <Typography color="textSecondary" align="center" py={2}>
                No hay mocks API creados
              </Typography>
            ) : (
              <List dense sx={{ maxHeight: '300px', overflow: 'auto' }}>
                {mocks.map((mock) => {
                  const creationDate = mock.createdAt 
                    ? new Date(mock.createdAt).toLocaleDateString() + ' ' + new Date(mock.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
                    : 'Fecha no disponible';
                  
                  return (
                    <ListItem key={mock.mockId} divider>
                      <ListItemText
                        primary={mock.name}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary" display="block">
                              {mockApi.getMockUrl(mock.mockId)}
                            </Typography>
                            <Typography component="span" variant="caption" color="text.secondary">
                              Creado: {creationDate}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Cuarta fila: Llaves recientes (ancho completo) */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Llaves Recientemente Actualizadas
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {loading ? (
              Array(5).fill().map((_, i) => (
                <Skeleton key={i} height={60} sx={{ my: 1 }} />
              ))
            ) : stats.recentEntries.length === 0 ? (
              <Typography color="textSecondary">
                No hay llaves de configuración
              </Typography>
            ) : (
              <List>
                {stats.recentEntries.map((entry) => (
                  <ListItem key={entry.id} divider>
                    <ListItemText
                      primary={entry.key}
                      secondary={
                        <>
                          <span>{`${entry.country} / ${entry.device}`}</span>
                          <br />
                          <span>{`• Creado: ${new Date(entry.createdAt).toLocaleString()} • Actualizado: ${new Date(entry.updatedAt).toLocaleString()}`}</span>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
