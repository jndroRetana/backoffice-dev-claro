import { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CircularProgress, 
  Container, 
  Grid, 
  IconButton, 
  List, 
  ListItem, 
  ListItemSecondaryAction,
  ListItemText, 
  Paper, 
  Snackbar, 
  TextField, 
  Typography,
  Alert,
  Link
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CodeIcon from '@mui/icons-material/Code';
import { mockApi } from '../services/mockApi';

const MocksManagement = () => {
  const [mockData, setMockData] = useState('');
  const [mockName, setMockName] = useState('');
  const [mocks, setMocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [jsonValid, setJsonValid] = useState(true);
  const [jsonError, setJsonError] = useState('');

  // Cargar los mocks existentes al montar el componente
  useEffect(() => {
    fetchMocks();
  }, []);

  // Función para cargar los mocks
  const fetchMocks = async () => {
    try {
      setLoading(true);
      const data = await mockApi.getMocks();
      setMocks(data);
    } catch (err) {
      setError('Error al cargar los mocks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Validar el JSON
  const validateJson = (json) => {
    if (!json) {
      setJsonValid(false);
      setJsonError('El campo no puede estar vacío');
      return false;
    }

    try {
      JSON.parse(json);
      setJsonValid(true);
      setJsonError('');
      return true;
    } catch (err) {
      setJsonValid(false);
      setJsonError(`JSON inválido: ${err.message}`);
      return false;
    }
  };

  // Crear un nuevo mock
  const handleCreateMock = async () => {
    if (!validateJson(mockData)) return;

    try {
      setLoading(true);
      const result = await mockApi.createMock(mockData, mockName);
      
      if (result.error) {
        setError(result.message || 'Error al crear el mock');
      } else {
        setSuccess('Mock creado exitosamente');
        setMockData('');
        setMockName('');
        await fetchMocks();
      }
    } catch (err) {
      setError('Error al crear el mock');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar un mock
  const handleDeleteMock = async (mockId) => {
    try {
      setLoading(true);
      const result = await mockApi.deleteMock(mockId);
      
      if (result.error) {
        setError(result.message || 'Error al eliminar el mock');
      } else {
        setSuccess('Mock eliminado exitosamente');
        await fetchMocks();
      }
    } catch (err) {
      setError('Error al eliminar el mock');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Copiar URL al portapapeles
  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url).then(
      () => {
        setSuccess('URL copiada al portapapeles');
      },
      (err) => {
        setError('Error al copiar URL');
        console.error(err);
      }
    );
  };

  // Intentar dar formato al JSON ingresado
  const formatJson = () => {
    try {
      const parsedJson = JSON.parse(mockData);
      const formattedJson = JSON.stringify(parsedJson, null, 2);
      setMockData(formattedJson);
      setJsonValid(true);
      setJsonError('');
    } catch (err) {
      setJsonValid(false);
      setJsonError(`No se puede formatear: ${err.message}`);
    }
  };

  // Cerrar alertas
  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Generador de Mocks API
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Crear Nuevo Mock
              </Typography>
              
              <TextField
                label="Nombre del Mock"
                value={mockName}
                onChange={(e) => setMockName(e.target.value)}
                fullWidth
                margin="normal"
                placeholder="Mi API de Productos"
              />
              
              <TextField
                label="JSON Data"
                multiline
                rows={10}
                value={mockData}
                onChange={(e) => setMockData(e.target.value)}
                fullWidth
                margin="normal"
                error={!jsonValid}
                helperText={jsonError}
                placeholder='{"key": "value", "example": [1, 2, 3]}'
                sx={{ fontFamily: 'monospace' }}
              />
              
              <Box mt={2} display="flex" gap={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCreateMock}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  Generar Mock API
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<CodeIcon />}
                  onClick={formatJson}
                >
                  Formatear JSON
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Mocks Disponibles
            </Typography>
            
            {loading && mocks.length === 0 ? (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
              </Box>
            ) : mocks.length === 0 ? (
              <Typography color="textSecondary" align="center" my={4}>
                No hay mocks disponibles
              </Typography>
            ) : (
              <List>
                {mocks.map((mock) => (
                  <ListItem
                    key={mock.mockId}
                    divider
                    sx={{ borderRadius: 1, mb: 1 }}
                  >
                    <ListItemText
                      primary={
                        <Box>
                          <Typography variant="subtitle2" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                            {mock.name}
                          </Typography>
                          <Link
                            href={mockApi.getMockUrl(mock.mockId)}
                            target="_blank"
                            rel="noopener"
                            sx={{ wordBreak: 'break-all', fontSize: '0.875rem' }}
                          >
                            {mock.mockUrl}
                          </Link>
                        </Box>
                      }
                      secondary={`ID: ${mock.mockId}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="copy"
                        onClick={() => copyToClipboard(mockApi.getMockUrl(mock.mockId))}
                        sx={{ mr: 1 }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteMock(mock.mockId)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Alertas */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={!!success} 
        autoHideDuration={4000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MocksManagement;
