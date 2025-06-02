import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CodeIcon from '@mui/icons-material/Code';
import TextFieldsIcon from '@mui/icons-material/TextFields';

const MetadataList = ({ 
  metadata, 
  onDelete, 
  onEdit, 
  onCreate, 
  onFilterChange, 
  countries,
  devices
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMetadata, setSelectedMetadata] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    country: '',
    device: ''
  });
  
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMdScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (metadata) => {
    setSelectedMetadata(metadata);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedMetadata) {
      onDelete(selectedMetadata.id);
      setDeleteDialogOpen(false);
      setSelectedMetadata(null);
    }
  };

  const handleViewClick = (metadata) => {
    setSelectedMetadata(metadata);
    setViewDialogOpen(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
    setPage(0);
  };

  const formatValue = (value) => {
    if (typeof value === 'object') {
      return <Chip icon={<CodeIcon />} label="JSON" color="primary" size="small" />;
    }
    return <Chip icon={<TextFieldsIcon />} label="Texto" size="small" />;
  };

  // Formatear valor para visualización
  const displayValue = (value) => {
    if (value === null || value === undefined) {
      return 'null';
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    
    return value.toString();
  };

  return (
    <>
      <Paper sx={{ 
        p: { xs: 1.5, sm: 2 }, 
        mb: { xs: 2, sm: 3 },
        borderRadius: { xs: 1, sm: 2 }
      }}>
        <Grid container spacing={{ xs: 1, sm: 2 }} alignItems="center">
          <Grid item xs={12} sm={4}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontSize: { xs: '1rem', sm: '1.25rem' },
                mb: { xs: 1, sm: 0 }
              }}
            >
              Filtros
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size={isXsScreen ? "medium" : "small"}>
              <InputLabel>País</InputLabel>
              <Select
                name="country"
                value={filters.country}
                onChange={handleFilterChange}
                label="País"
              >
                <MenuItem value="">Todos</MenuItem>
                {countries.map((country) => (
                  <MenuItem key={country} value={country}>{country}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size={isXsScreen ? "medium" : "small"}>
              <InputLabel>Dispositivo</InputLabel>
              <Select
                name="device"
                value={filters.device}
                onChange={handleFilterChange}
                label="Dispositivo"
              >
                <MenuItem value="">Todos</MenuItem>
                {devices.map((device) => (
                  <MenuItem key={device} value={device}>{device}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between", 
          alignItems: { xs: "stretch", sm: "center" }, 
          mb: { xs: 1.5, sm: 2 },
          gap: { xs: 1, sm: 0 }
        }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          Llaves de Configuración
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onCreate}
          fullWidth={isXsScreen}
          size={isXsScreen ? "large" : "medium"}
          sx={{ 
            borderRadius: { xs: 1, sm: 4 },
            py: { xs: 1, sm: 'inherit' }
          }}
        >
          Nueva Llave
        </Button>
      </Box>

      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: { xs: 1, sm: 2 },
          overflow: 'hidden',
          boxShadow: { xs: 1, sm: 3 }
        }}
      >
        {isXsScreen ? (
          // Vista de tarjetas para dispositivos móviles
          <Box>
            {metadata.length === 0 ? (
              <Box p={3} textAlign="center">
                <Typography color="textSecondary">
                  No hay llaves de configuración disponibles
                </Typography>
              </Box>
            ) : (
              <>
                {metadata
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <Card 
                      key={item.id} 
                      variant="outlined" 
                      sx={{ 
                        m: 1,
                        borderRadius: 1,
                        boxShadow: 'none',
                        border: '1px solid rgba(0, 0, 0, 0.12)'
                      }}
                    >
                      <CardContent sx={{ pb: 1 }}>
                        <Typography variant="h6" sx={{ fontSize: '1rem', mb: 1 }}>
                          {item.key}
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                              Tipo
                            </Typography>
                            {formatValue(item.value)}
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                              País
                            </Typography>
                            <Typography variant="body2">{item.country}</Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                              Dispositivo
                            </Typography>
                            <Typography variant="body2">{item.device}</Typography>
                          </Grid>
                        </Grid>
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'flex-end', 
                            mt: 1,
                            borderTop: '1px solid rgba(0, 0, 0, 0.08)',
                            pt: 1
                          }}
                        >
                          <Tooltip title="Ver detalles">
                            <IconButton onClick={() => handleViewClick(item)} size="small">
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar">
                            <IconButton onClick={() => onEdit(item)} size="small" color="primary">
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton onClick={() => handleDeleteClick(item)} size="small" color="error">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CardContent>
                    </Card>
                  ))
                }
              </>
            )}
          </Box>
        ) : (
          // Vista de tabla para tablets y desktop
          <Table size={isMdScreen ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                <TableCell>Llave</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>País</TableCell>
                <TableCell>Dispositivo</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {metadata.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay llaves de configuración disponibles
                  </TableCell>
                </TableRow>
              ) : (
                metadata
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.key}</TableCell>
                      <TableCell>{formatValue(item.value)}</TableCell>
                      <TableCell>{item.country}</TableCell>
                      <TableCell>{item.device}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Ver detalles">
                          <IconButton onClick={() => handleViewClick(item)} size="small">
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton onClick={() => onEdit(item)} size="small" color="primary">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton onClick={() => handleDeleteClick(item)} size="small" color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        )}

        <TablePagination
          rowsPerPageOptions={isXsScreen ? [5, 10] : [5, 10, 25]}
          component="div"
          count={metadata.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={isXsScreen ? "Filas:" : "Filas por página:"}
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          sx={{ 
            '.MuiTablePagination-selectLabel': { 
              margin: { xs: 0 },
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            },
            '.MuiTablePagination-displayedRows': { 
              margin: { xs: 0 },
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            },
            '.MuiTablePagination-select': { 
              paddingLeft: { xs: '0.25rem', sm: '0.5rem' },
              paddingRight: { xs: '1.5rem', sm: '2rem' }
            }
          }}
        />
      </TableContainer>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        sx={{ 
          '& .MuiPaper-root': { 
            width: { xs: '100%', sm: 'auto' },
            m: { xs: 2, sm: 0 },
            borderRadius: { xs: 1, sm: 2 }
          }
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
          Confirmar eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            ¿Está seguro que desea eliminar la llave "{selectedMetadata?.key}" para {selectedMetadata?.country} / {selectedMetadata?.device}?
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 2 } }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            autoFocus
            sx={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para ver detalles de la llave */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
        sx={{ 
          '& .MuiPaper-root': { 
            width: { xs: '100%', sm: '80%', md: '100%' },
            m: { xs: 1, sm: 2, md: 3 },
            borderRadius: { xs: 1, sm: 2 }
          }
        }}
      >
        <DialogTitle sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
          Detalles de la Llave
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
          {selectedMetadata && (
            <Card variant="outlined" sx={{ mt: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Llave
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedMetadata.key}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      País
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedMetadata.country}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Dispositivo
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedMetadata.device}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Descripción
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedMetadata.description || "Sin descripción"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Valor ({typeof selectedMetadata.value === 'object' ? 'JSON' : 'Texto'})
                    </Typography>
                    <Paper
                      sx={{
                        p: 2,
                        mt: 1,
                        bgcolor: 'background.default',
                        maxHeight: '300px',
                        overflow: 'auto',
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                      }}
                    >
                      {displayValue(selectedMetadata.value)}
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Creado
                    </Typography>
                    <Typography variant="body2">
                      {new Date(selectedMetadata.createdAt).toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Última actualización
                    </Typography>
                    <Typography variant="body2">
                      {new Date(selectedMetadata.updatedAt).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Cerrar</Button>
          <Button 
            onClick={() => {
              setViewDialogOpen(false);
              onEdit(selectedMetadata);
            }} 
            color="primary"
          >
            Editar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MetadataList;
