import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Typography, Divider, Avatar,
} from '@mui/material';
import {
  Dashboard, Spa, PhotoLibrary, People, Star,
  Article, Message, Settings, Logout,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const DRAWER_WIDTH = 260;

const navItems = [
  { label: 'Dashboard', icon: <Dashboard />, path: '/' },
  { label: 'Servicios', icon: <Spa />, path: '/servicios' },
  { label: 'Proyectos', icon: <PhotoLibrary />, path: '/proyectos' },
  { label: 'Equipo', icon: <People />, path: '/equipo' },
  { label: 'Testimonios', icon: <Star />, path: '/testimonios' },
  { label: 'Blog', icon: <Article />, path: '/blog' },
  { label: 'Mensajes', icon: <Message />, path: '/mensajes' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          bgcolor: 'primary.dark',
          color: 'white',
        },
      }}
    >
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: 'secondary.main', width: 44, height: 44 }}>
          <Spa />
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ color: 'white', lineHeight: 1.2, fontWeight: 700 }}>
            El Jardinero
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            Panel CMS
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

      <List sx={{ px: 1.5, pt: 2, flexGrow: 1 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  bgcolor: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                  py: 1.2,
                }}
              >
                <ListItemIcon sx={{ color: active ? 'secondary.light' : 'rgba(255,255,255,0.7)', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: active ? 600 : 400, color: active ? 'white' : 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                      {item.label}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

      <List sx={{ px: 1.5, py: 1.5 }}>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton sx={{ borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }, py: 1.2 }}>
            <ListItemIcon sx={{ color: 'rgba(255,255,255,0.7)', minWidth: 40 }}><Settings /></ListItemIcon>
            <ListItemText primary={<Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Configuración</Typography>} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }, py: 1.2 }}>
            <ListItemIcon sx={{ color: 'rgba(255,255,255,0.7)', minWidth: 40 }}><Logout /></ListItemIcon>
            <ListItemText primary={<Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Cerrar Sesión</Typography>} />
          </ListItemButton>
        </ListItem>
      </List>

      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36, fontSize: '0.85rem' }}>AV</Avatar>
        <Box>
          <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>Alejandro Vega</Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>Administrador</Typography>
        </Box>
      </Box>
    </Drawer>
  );
}
