import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Chip, Avatar,
  IconButton, TextField, MenuItem, List, ListItem, ListItemAvatar,
  ListItemText, Divider, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Stack, InputAdornment,
} from '@mui/material';
import { Search, Email, Phone, Delete, Reply, MarkEmailRead } from '@mui/icons-material';
import { contactMessages as initialMessages } from '../data/dummy';
import type { ContactMessage } from '../types';

const statusMap = {
  new: { label: 'Nuevo', color: 'error' as const },
  read: { label: 'Leído', color: 'warning' as const },
  replied: { label: 'Respondido', color: 'success' as const },
};

export default function Messages() {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [selected, setSelected] = useState<ContactMessage | null>(initialMessages[0]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');

  const filtered = messages.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || m.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const markRead = (id: number) => {
    setMessages((prev) => prev.map((m) => m.id === id && m.status === 'new' ? { ...m, status: 'read' as const } : m));
  };

  const handleSelect = (msg: ContactMessage) => {
    setSelected(msg);
    markRead(msg.id);
  };

  const handleReply = () => {
    if (selected) {
      setMessages((prev) => prev.map((m) => m.id === selected.id ? { ...m, status: 'replied' as const } : m));
      setSelected((prev) => prev ? { ...prev, status: 'replied' } : prev);
    }
    setReplyOpen(false);
    setReplyText('');
  };

  const handleDelete = (id: number) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  return (
    <Box sx={{ display: 'flex', gap: 3, height: 'calc(100vh - 160px)' }}>
      <Card sx={{ width: 360, flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <TextField
            fullWidth size="small" placeholder="Buscar mensajes..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 20, color: 'text.secondary' }} /></InputAdornment> } }}
            sx={{ mb: 1.5 }}
          />
          <TextField select fullWidth size="small" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} label="Estado">
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="new">Nuevos</MenuItem>
            <MenuItem value="read">Leídos</MenuItem>
            <MenuItem value="replied">Respondidos</MenuItem>
          </TextField>
        </Box>
        <List sx={{ flexGrow: 1, overflow: 'auto', p: 0 }}>
          {filtered.map((msg, i) => (
            <Box key={msg.id}>
              <ListItem
                alignItems="flex-start"
                onClick={() => handleSelect(msg)}
                sx={{
                  cursor: 'pointer',
                  bgcolor: selected?.id === msg.id ? 'action.selected' : 'transparent',
                  '&:hover': { bgcolor: 'action.hover' },
                  px: 2, py: 1.5,
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: msg.status === 'new' ? 'error.main' : 'grey.400', width: 40, height: 40, fontSize: '0.8rem' }}>
                    {msg.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ fontWeight: msg.status === 'new' ? 700 : 400 }}>{msg.name}</Typography>
                      <Chip label={statusMap[msg.status].label} size="small" color={statusMap[msg.status].color} sx={{ fontSize: '0.65rem', height: 18 }} />
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>{msg.subject}</Typography>
                      <Typography variant="caption" color="text.disabled">{new Date(msg.date).toLocaleDateString('es-ES')}</Typography>
                    </>
                  }
                />
              </ListItem>
              {i < filtered.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      </Card>

      {selected ? (
        <Card sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ p: 3, flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>{selected.subject}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip label={statusMap[selected.status].label} size="small" color={statusMap[selected.status].color} />
                  <Typography variant="caption" color="text.secondary">{new Date(selected.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
                </Box>
              </Box>
              <Box>
                {selected.status !== 'replied' && (
                  <IconButton color="success" onClick={() => markRead(selected.id)} title="Marcar como leído">
                    <MarkEmailRead />
                  </IconButton>
                )}
                <IconButton color="error" onClick={() => handleDelete(selected.id)}>
                  <Delete />
                </IconButton>
              </Box>
            </Box>

            <Card variant="outlined" sx={{ p: 2.5, mb: 3, bgcolor: 'background.default' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                  {selected.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{selected.name}</Typography>
                  <Stack direction="row" spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Email sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">{selected.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Phone sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">{selected.phone}</Typography>
                    </Box>
                  </Stack>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>{selected.message}</Typography>
            </Card>

            <Button variant="contained" startIcon={<Reply />} onClick={() => setReplyOpen(true)}>Responder</Button>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="text.secondary">Selecciona un mensaje para ver el detalle</Typography>
        </Card>
      )}

      <Dialog open={replyOpen} onClose={() => setReplyOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Responder a {selected?.name}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Para" fullWidth size="small" value={selected?.email ?? ''} disabled />
            <TextField label="Asunto" fullWidth size="small" defaultValue={`RE: ${selected?.subject}`} />
            <TextField label="Mensaje" fullWidth size="small" multiline rows={6} value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Escribe tu respuesta..." />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 0 }}>
          <Button onClick={() => setReplyOpen(false)}>Cancelar</Button>
          <Button variant="contained" startIcon={<Reply />} onClick={handleReply}>Enviar Respuesta</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
