import { useState } from 'react';
import {
  Box, Card, CardContent, CardMedia, Grid, Typography, Chip,
  Button, IconButton, TextField, MenuItem, Dialog, DialogTitle,
  DialogContent, DialogActions, Stack, Avatar, InputAdornment,
} from '@mui/material';
import { Add, Edit, Delete, Search, Visibility } from '@mui/icons-material';
import { blogPosts as initialPosts } from '../data/dummy';
import type { BlogPost } from '../types';

const statusMap = {
  published: { label: 'Publicado', color: 'success' as const },
  draft: { label: 'Borrador', color: 'default' as const },
  scheduled: { label: 'Programado', color: 'info' as const },
};

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<Partial<BlogPost>>({});

  const filtered = posts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openAdd = () => { setEditing(null); setForm({ status: 'draft', tags: [] }); setOpen(true); };
  const openEdit = (p: BlogPost) => { setEditing(p); setForm(p); setOpen(true); };
  const handleSave = () => {
    if (editing) setPosts((prev) => prev.map((p) => p.id === editing.id ? { ...p, ...form } as BlogPost : p));
    else setPosts((prev) => [...prev, { ...form, id: Date.now(), views: 0 } as BlogPost]);
    setOpen(false);
  };
  const handleDelete = (id: number) => setPosts((prev) => prev.filter((p) => p.id !== id));

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small" placeholder="Buscar artículos..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 20, color: 'text.secondary' }} /></InputAdornment> } }}
          sx={{ width: 240 }}
        />
        <TextField select size="small" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} sx={{ width: 160 }} label="Estado">
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="published">Publicados</MenuItem>
          <MenuItem value="draft">Borradores</MenuItem>
          <MenuItem value="scheduled">Programados</MenuItem>
        </TextField>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="contained" startIcon={<Add />} onClick={openAdd}>Nuevo Artículo</Button>
      </Box>

      <Grid container spacing={3}>
        {filtered.map((post) => (
          <Grid key={post.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia component="img" height={180} image={post.imageUrl} alt={post.title} />
              <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Chip label={post.category} size="small" color="primary" variant="outlined" />
                  <Chip label={statusMap[post.status].label} size="small" color={statusMap[post.status].color} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{post.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{post.excerpt}</Typography>

                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                  {post.tags.map((tag) => (
                    <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 22 }} />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.65rem', bgcolor: 'primary.main' }}>
                      {post.author.split(' ').map((n) => n[0]).join('')}
                    </Avatar>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>{post.author}</Typography>
                      {post.views > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                          <Visibility sx={{ fontSize: 12, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">{post.views.toLocaleString()}</Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                  <Box>
                    <IconButton size="small" color="primary" onClick={() => openEdit(post)}><Edit fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(post.id)}><Delete fontSize="small" /></IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Editar Artículo' : 'Nuevo Artículo'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Título" fullWidth size="small" value={form.title ?? ''} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            <TextField label="Extracto" fullWidth size="small" multiline rows={3} value={form.excerpt ?? ''} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} />
            <TextField label="Autor" fullWidth size="small" value={form.author ?? ''} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} />
            <TextField label="Categoría" fullWidth size="small" value={form.category ?? ''} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
            <TextField select label="Estado" fullWidth size="small" value={form.status ?? 'draft'} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as BlogPost['status'] }))}>
              <MenuItem value="draft">Borrador</MenuItem>
              <MenuItem value="scheduled">Programado</MenuItem>
              <MenuItem value="published">Publicado</MenuItem>
            </TextField>
            <TextField
              label="Fecha de publicación" type="date" fullWidth size="small"
              value={form.publishDate ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, publishDate: e.target.value }))}
              slotProps={{ inputLabel: { shrink: true } }}
            />
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
