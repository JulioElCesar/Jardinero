import { useState } from 'react';
import {
  Box, Card, CardContent, CardMedia, Grid, Typography, Chip,
  Button, IconButton, TextField, MenuItem, Dialog, DialogTitle,
  DialogContent, DialogActions, Stack, LinearProgress, InputAdornment,
} from '@mui/material';
import { Add, Edit, Delete, Search, LocationOn, Euro } from '@mui/icons-material';
import { projects as initialProjects } from '../data/dummy';
import type { Project } from '../types';

const statusMap = {
  completed: { label: 'Completado', color: 'success' as const },
  'in-progress': { label: 'En Progreso', color: 'warning' as const },
  pending: { label: 'Pendiente', color: 'default' as const },
};

const categories = ['Todos', 'Residencial', 'Corporativo', 'Hotelería'];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [filter, setFilter] = useState('Todos');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<Partial<Project>>({});

  const filtered = projects.filter((p) => {
    const matchCat = filter === 'Todos' || p.category === filter;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.client.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const openAdd = () => { setEditing(null); setForm({ status: 'pending', featured: false }); setOpen(true); };
  const openEdit = (p: Project) => { setEditing(p); setForm(p); setOpen(true); };
  const handleSave = () => {
    if (editing) setProjects((prev) => prev.map((p) => p.id === editing.id ? { ...p, ...form } as Project : p));
    else setProjects((prev) => [...prev, { ...form, id: Date.now() } as Project]);
    setOpen(false);
  };
  const handleDelete = (id: number) => setProjects((prev) => prev.filter((p) => p.id !== id));

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small" placeholder="Buscar proyectos..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 20, color: 'text.secondary' }} /></InputAdornment> } }}
          sx={{ width: 240 }}
        />
        <TextField select size="small" value={filter} onChange={(e) => setFilter(e.target.value)} sx={{ width: 160 }} label="Categoría">
          {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </TextField>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="contained" startIcon={<Add />} onClick={openAdd}>Nuevo Proyecto</Button>
      </Box>

      <Grid container spacing={3}>
        {filtered.map((project) => (
          <Grid key={project.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ position: 'relative' }}>
                <CardMedia component="img" height={200} image={project.imageUrl} alt={project.title} />
                {project.featured && (
                  <Chip label="Destacado" size="small" color="secondary" sx={{ position: 'absolute', top: 12, right: 12 }} />
                )}
              </Box>
              <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Chip label={project.category} size="small" color="primary" variant="outlined" />
                  <Chip label={statusMap[project.status].label} size="small" color={statusMap[project.status].color} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>{project.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>{project.description}</Typography>

                {project.status === 'in-progress' && (
                  <Box sx={{ mb: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">Progreso</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>65%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={65} color="warning" sx={{ borderRadius: 4 }} />
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                  <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">{project.location}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Euro sx={{ fontSize: 16, color: 'primary.main' }} />
                    <Typography variant="body1" sx={{ fontWeight: 700 }} color="primary.main">
                      {project.budget.toLocaleString('es-ES')}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton size="small" color="primary" onClick={() => openEdit(project)}><Edit fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(project.id)}><Delete fontSize="small" /></IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Editar Proyecto' : 'Nuevo Proyecto'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Título" fullWidth size="small" value={form.title ?? ''} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            <TextField label="Cliente" fullWidth size="small" value={form.client ?? ''} onChange={(e) => setForm((f) => ({ ...f, client: e.target.value }))} />
            <TextField label="Descripción" fullWidth size="small" multiline rows={2} value={form.description ?? ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            <TextField label="Ubicación" fullWidth size="small" value={form.location ?? ''} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
            <TextField label="Presupuesto (€)" type="number" fullWidth size="small" value={form.budget ?? ''} onChange={(e) => setForm((f) => ({ ...f, budget: Number(e.target.value) }))} />
            <TextField select label="Categoría" fullWidth size="small" value={form.category ?? ''} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
              {['Residencial', 'Corporativo', 'Hotelería'].map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
            <TextField select label="Estado" fullWidth size="small" value={form.status ?? 'pending'} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Project['status'] }))}>
              <MenuItem value="pending">Pendiente</MenuItem>
              <MenuItem value="in-progress">En Progreso</MenuItem>
              <MenuItem value="completed">Completado</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 0 }}>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
