import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Projects from './pages/Projects';
import Team from './pages/Team';
import Testimonials from './pages/Testimonials';
import Blog from './pages/Blog';
import Messages from './pages/Messages';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/servicios" element={<Services />} />
            <Route path="/proyectos" element={<Projects />} />
            <Route path="/equipo" element={<Team />} />
            <Route path="/testimonios" element={<Testimonials />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/mensajes" element={<Messages />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
