import { useState } from 'react';
import {
  Box, Card, CardContent, Grid, Typography, Chip, Avatar,
  Button, IconButton, TextField, MenuItem, Rating, Dialog,
  DialogTitle, DialogContent, DialogActions, Stack, InputAdornment,
} from '@mui/material';
import { Add, Edit, Delete, Search, CheckCircle, Cancel } from '@mui/icons-material';
import { testimonials as initialData } from '../data/dummy';
import type { Testimonial } from '../types';

const statusMap = {
  published: { label: 'Publicado', color: 'success' as const },
  pending: { label: 'Pendiente', color: 'warning' as const },
  rejected: { label: 'Rechazado', color: 'error' as const },
};

const avatarColors = ['#2E7D32', '#0288D1', '#F57C00', '#7B1FA2'];

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>(initialData);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<Partial<Testimonial>>({});

  const filtered = items.filter((t) => {
    const matchSearch = t.author.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openEdit = (t: Testimonial) => { setEditing(t); setForm(t); setOpen(true); };
  const openAdd = () => { setEditing(null); setForm({ status: 'pending', rating: 5 }); setOpen(true); };
  const handleSave = () => {
    if (editing) setItems((prev) => prev.map((t) => t.id === editing.id ? { ...t, ...form } as Testimonial : t));
    else setItems((prev) => [...prev, { ...form, id: Date.now(), avatar: (form.author ?? 'XX').substring(0, 2).toUpperCase() } as Testimonial]);
    setOpen(false);
  };
  const handleApprove = (id: number) => setItems((prev) => prev.map((t) => t.id === id ? { ...t, status: 'published' as const } : t));
  const handleDelete = (id: number) => setItems((prev) => prev.filter((t) => t.id !== id));

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small" placeholder="Buscar testimonios..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 20, color: 'text.secondary' }} /></InputAdornment> } }}
          sx={{ width: 240 }}
        />
        <TextField select size="small" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} sx={{ width: 160 }} label="Estado">
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="published">Publicados</MenuItem>
          <MenuItem value="pending">Pendientes</MenuItem>
          <MenuItem value="rejected">Rechazados</MenuItem>
        </TextField>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="contained" startIcon={<Add />} onClick={openAdd}>Nuevo Testimonio</Button>
      </Box>

      <Grid container spacing={3}>
        {filtered.map((t, i) => (
          <Grid key={t.id} size={{ xs: 12, sm: 6 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: avatarColors[i % avatarColors.length], fontWeight: 700 }}>{t.avatar}</Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{t.author}</Typography>
                      <Typography variant="caption" color="text.secondary">{t.company}</Typography>
                    </Box>
                  </Box>
                  <Chip label={statusMap[t.status].label} size="small" color={statusMap[t.status].color} />
                </Box>

                <Rating value={t.rating} readOnly size="small" sx={{ mb: 1.5 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
                  "{t.comment}"
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(t.date).toLocaleDateString('es-ES')}
                  </Typography>
                  <Box>
                    {t.status === 'pending' && (
                      <>
                        <IconButton size="small" color="success" onClick={() => handleApprove(t.id)} title="Aprobar">
                          <CheckCircle fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" title="Rechazar"
                          onClick={() => setItems((prev) => prev.map((x) => x.id === t.id ? { ...x, status: 'rejected' as const } : x))}>
                          <Cancel fontSize="small" />
                        </IconButton>
                      </>
                    )}
                    <IconButton size="small" color="primary" onClick={() => openEdit(t)}><Edit fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(t.id)}><Delete fontSize="small" /></IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Editar Testimonio' : 'Nuevo Testimonio'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Autor" fullWidth size="small" value={form.author ?? ''} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} />
            <TextField label="Empresa" fullWidth size="small" value={form.company ?? ''} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} />
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>Valoración</Typography>
              <Rating value={form.rating ?? 5} onChange={(_, v) => setForm((f) => ({ ...f, rating: v ?? 5 }))} />
            </Box>
            <TextField label="Comentario" fullWidth size="small" multiline rows={4} value={form.comment ?? ''} onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))} />
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
