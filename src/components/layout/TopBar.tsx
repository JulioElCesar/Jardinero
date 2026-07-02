import { AppBar, Toolbar, Typography, IconButton, Badge, Box, InputBase, alpha } from '@mui/material';
import { Notifications, Search } from '@mui/icons-material';

interface Props {
  title: string;
}

export default function TopBar({ title }: Props) {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700, flexGrow: 0 }}>
          {title}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{
          display: 'flex', alignItems: 'center',
          bgcolor: (t) => alpha(t.palette.primary.main, 0.07),
          borderRadius: 2, px: 2, py: 0.5, mr: 1,
        }}>
          <Search sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
          <InputBase placeholder="Buscar..." sx={{ fontSize: '0.875rem', width: 200 }} />
        </Box>

        <IconButton>
          <Badge badgeContent={4} color="error">
            <Notifications sx={{ color: 'text.secondary' }} />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
