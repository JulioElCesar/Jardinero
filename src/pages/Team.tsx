import { useState } from 'react';
import {
  Box, Card, CardContent, Grid, Typography, Chip, Avatar,
  Button, IconButton, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, Stack, Divider, InputAdornment,
} from '@mui/material';
import { Add, Edit, Delete, Search, Email, Phone } from '@mui/icons-material';
import { teamMembers as initialTeam } from '../data/dummy';
import type { TeamMember } from '../types';

export default function Team() {
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState<Partial<TeamMember>>({});

  const filtered = team.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase()),
  );

  const openAdd = () => { setEditing(null); setForm({ status: 'active', specialties: [] }); setOpen(true); };
  const openEdit = (m: TeamMember) => { setEditing(m); setForm(m); setOpen(true); };
  const handleSave = () => {
    if (editing) setTeam((prev) => prev.map((m) => m.id === editing.id ? { ...m, ...form } as TeamMember : m));
    else setTeam((prev) => [...prev, { ...form, id: Date.now(), avatar: (form.name ?? 'XX').substring(0, 2).toUpperCase() } as TeamMember]);
    setOpen(false);
  };
  const handleDelete = (id: number) => setTeam((prev) => prev.filter((m) => m.id !== id));

  const avatarColors = ['#2E7D32', '#8BC34A', '#0288D1', '#F57C00', '#7B1FA2', '#D32F2F'];

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <TextField
          size="small" placeholder="Buscar miembros..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 20, color: 'text.secondary' }} /></InputAdornment> } }}
          sx={{ width: 280 }}
        />
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="contained" startIcon={<Add />} onClick={openAdd}>Nuevo Miembro</Button>
      </Box>

      <Grid container spacing={3}>
        {filtered.map((member, index) => (
          <Grid key={member.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: avatarColors[index % avatarColors.length], width: 56, height: 56, fontSize: '1.1rem', fontWeight: 700 }}>
                      {member.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{member.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{member.role}</Typography>
                    </Box>
                  </Box>
                  <Chip label={member.status === 'active' ? 'Activo' : 'Inactivo'} color={member.status === 'active' ? 'success' : 'default'} size="small" />
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Stack spacing={1} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">{member.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">{member.phone}</Typography>
                  </Box>
                </Stack>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>ESPECIALIDADES</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {member.specialties.map((s) => (
                      <Chip key={s} label={s} size="small" variant="outlined" color="primary" sx={{ fontSize: '0.7rem' }} />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Desde {new Date(member.joinDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' })}
                  </Typography>
                  <Box>
                    <IconButton size="small" color="primary" onClick={() => openEdit(member)}><Edit fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(member.id)}><Delete fontSize="small" /></IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Editar Miembro' : 'Nuevo Miembro'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Nombre" fullWidth size="small" value={form.name ?? ''} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            <TextField label="Cargo" fullWidth size="small" value={form.role ?? ''} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} />
            <TextField label="Email" fullWidth size="small" value={form.email ?? ''} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            <TextField label="Teléfono" fullWidth size="small" value={form.phone ?? ''} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            <TextField
              label="Fecha de incorporación" type="date" fullWidth size="small"
              value={form.joinDate ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, joinDate: e.target.value }))}
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
