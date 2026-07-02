import {
  Grid, Card, CardContent, Typography, Box, Avatar,
  List, ListItem, ListItemText, ListItemAvatar, Chip, Divider,
} from '@mui/material';
import {
  TrendingUp, Spa, People, Message,
  AttachMoney, Assignment, ArrowUpward,
} from '@mui/icons-material';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { revenueData, serviceDistribution, projects, contactMessages } from '../data/dummy';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  change?: string;
}

function StatCard({ title, value, icon, color, change }: StatCardProps) {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{title}</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{value}</Typography>
            {change && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 0.5 }}>
                <ArrowUpward sx={{ fontSize: 14, color: 'success.main' }} />
                <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>{change}</Typography>
              </Box>
            )}
          </Box>
          <Avatar sx={{ bgcolor: color, width: 52, height: 52 }}>{icon}</Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}

const statusColor: Record<string, 'success' | 'warning' | 'default'> = {
  completed: 'success',
  'in-progress': 'warning',
  pending: 'default',
};
const statusLabel: Record<string, string> = {
  completed: 'Completado',
  'in-progress': 'En Progreso',
  pending: 'Pendiente',
};
const msgStatusColor: Record<string, 'error' | 'warning' | 'success'> = {
  new: 'error',
  read: 'warning',
  replied: 'success',
};

export default function Dashboard() {
  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Proyectos Totales" value={5} icon={<Assignment />} color="#2E7D32" change="+12% este mes" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Servicios Activos" value={5} icon={<Spa />} color="#8BC34A" change="+2 nuevos" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Miembros del Equipo" value={6} icon={<People />} color="#0288D1" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Mensajes Nuevos" value={2} icon={<Message />} color="#F57C00" />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <TrendingUp color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Ingresos Mensuales (2024)</Typography>
            </Box>
            <BarChart
              xAxis={[{ scaleType: 'band', data: revenueData.map((d) => d.month) }]}
              series={[{
                data: revenueData.map((d) => d.revenue),
                label: 'Ingresos (€)',
                color: '#2E7D32',
              }]}
              height={280}
              margin={{ left: 70 }}
            />
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <AttachMoney color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Distribución de Servicios</Typography>
            </Box>
            <PieChart
              series={[{
                data: serviceDistribution.map((d, i) => ({
                  id: i,
                  value: d.value,
                  label: d.label,
                  color: ['#2E7D32', '#8BC34A', '#0288D1', '#F57C00'][i],
                })),
                innerRadius: 50,
                outerRadius: 100,
              }]}
              height={280}
            />
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Proyectos Recientes</Typography>
              <List disablePadding>
                {projects.slice(0, 4).map((project, i) => (
                  <Box key={project.id}>
                    <ListItem disablePadding sx={{ py: 1.5 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.light', fontSize: '0.75rem', width: 40, height: 40 }}>
                          {project.client.substring(0, 2).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>{project.title}</Typography>}
                        secondary={<Typography variant="caption" color="text.secondary">{project.location}</Typography>}
                      />
                      <Chip
                        label={statusLabel[project.status]}
                        color={statusColor[project.status]}
                        size="small"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    </ListItem>
                    {i < 3 && <Divider />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Mensajes Recientes</Typography>
              <List disablePadding>
                {contactMessages.slice(0, 4).map((msg, i) => (
                  <Box key={msg.id}>
                    <ListItem disablePadding sx={{ py: 1.5 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40, fontSize: '0.8rem' }}>
                          {msg.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>{msg.name}</Typography>}
                        secondary={<Typography variant="caption" color="text.secondary" noWrap>{msg.subject}</Typography>}
                      />
                      <Chip
                        label={msg.status === 'new' ? 'Nuevo' : msg.status === 'read' ? 'Leído' : 'Respondido'}
                        color={msgStatusColor[msg.status]}
                        size="small"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    </ListItem>
                    {i < 3 && <Divider />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
