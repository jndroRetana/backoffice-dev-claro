import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          py: { xs: 2, sm: 3 },
          px: { xs: 1, sm: 2, md: 3 },
          maxWidth: { xs: '100%', xl: '1600px' }
        }}
        disableGutters={isMobile}
      >
        <Outlet />
      </Container>
      <Box 
        component="footer" 
        sx={{ 
          py: { xs: 1.5, sm: 2 }, 
          px: { xs: 2, sm: 3 },
          textAlign: 'center', 
          bgcolor: 'background.paper', 
          borderTop: 1, 
          borderColor: 'divider',
          fontSize: { xs: '0.75rem', sm: '0.875rem' }
        }}
      >
        © {new Date().getFullYear()} Metadata Admin Dashboard
      </Box>
    </Box>
  );
};

export default Layout;
