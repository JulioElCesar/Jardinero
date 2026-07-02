import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/servicios': 'Servicios',
  '/proyectos': 'Proyectos',
  '/equipo': 'Equipo',
  '/testimonios': 'Testimonios',
  '/blog': 'Blog',
  '/mensajes': 'Mensajes',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const title = pageTitles[location.pathname] ?? 'El Jardinero CMS';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar title={title} />
        <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
