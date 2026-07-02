import { useState } from 'react';
import {
  Box, Card, CardContent, CardMedia, Grid, Typography, Chip,
  Button, IconButton, TextField, MenuItem, Dialog, DialogTitle,
  DialogContent, DialogActions, Stack, InputAdornment,
} from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import { services as initialServices } from '../data/dummy';
import type { Service } from '../types';

const categories = ['Todos', 'Diseño', 'Mantenimiento', 'Instalación', 'Poda'];

export default function Services() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [filter, setFilter] = useState('Todos');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<Partial<Service>>({});

  const filtered = services.filter((s) => {
    const matchCat = filter === 'Todos' || s.category === filter;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const openAdd = () => { setEditing(null); setForm({ status: 'active' }); setOpen(true); };
  const openEdit = (s: Service) => { setEditing(s); setForm(s); setOpen(true); };

  const handleSave = () => {
    if (editing) {
      setServices((prev) => prev.map((s) => s.id === editing.id ? { ...s, ...form } as Service : s));
    } else {
      setServices((prev) => [...prev, { ...form, id: Date.now() } as Service]);
    }
    setOpen(false);
  };

  const handleDelete = (id: number) => setServices((prev) => prev.filter((s) => s.id !== id));

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Buscar servicios..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 20, color: 'text.secondary' }} /></InputAdornment> } }}
          sx={{ width: 240 }}
        />
        <TextField select size="small" value={filter} onChange={(e) => setFilter(e.target.value)} sx={{ width: 160 }} label="Categoría">
          {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </TextField>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="contained" startIcon={<Add />} onClick={openAdd}>Nuevo Servicio</Button>
      </Box>

      <Grid container spacing={3}>
        {filtered.map((service) => (
          <Grid key={service.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia component="img" height={180} image={service.imageUrl} alt={service.name} sx={{ objectFit: 'cover' }} />
              <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Chip label={service.category} size="small" color="primary" variant="outlined" />
                  <Chip label={service.status === 'active' ? 'Activo' : 'Inactivo'} size="small" color={service.status === 'active' ? 'success' : 'default'} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{service.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{service.description}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h5" color="primary.main" sx={{ fontWeight: 700 }}>€{service.price}</Typography>
                    <Typography variant="caption" color="text.secondary">{service.duration}</Typography>
                  </Box>
                  <Box>
                    <IconButton size="small" color="primary" onClick={() => openEdit(service)}><Edit fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(service.id)}><Delete fontSize="small" /></IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Editar Servicio' : 'Nuevo Servicio'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Nombre" fullWidth size="small" value={form.name ?? ''} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            <TextField label="Descripción" fullWidth size="small" multiline rows={3} value={form.description ?? ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            <TextField label="Precio (€)" type="number" fullWidth size="small" value={form.price ?? ''} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} />
            <TextField label="Duración" fullWidth size="small" value={form.duration ?? ''} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} />
            <TextField select label="Categoría" fullWidth size="small" value={form.category ?? ''} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
              {['Diseño', 'Mantenimiento', 'Instalación', 'Poda'].map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
            <TextField select label="Estado" fullWidth size="small" value={form.status ?? 'active'} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as 'active' | 'inactive' }))}>
              <MenuItem value="active">Activo</MenuItem>
              <MenuItem value="inactive">Inactivo</MenuItem>
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
