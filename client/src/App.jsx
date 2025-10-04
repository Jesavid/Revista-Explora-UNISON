/**
 * EXPLORA UNISON - Frontend Principal
 * 
 * Aplicación React para la revista académica Explora UNISON
 * Sistema de gestión de contenido con autenticación administrativa
 * 
 * Tecnologías: React 19, React Router, Vite, TailwindCSS
 * Despliegue: Vercel
 * 
 * Funcionalidades:
 * - Visualización pública de artículos, noticias y videos
 * - Panel administrativo protegido con JWT
 * - Búsqueda de contenido
 * - Responsive design
 */

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { contentService } from "./services/contentService";

// Componentes de navegación y layout
import ScrollToTop from "./components/ScrollToTop";
import Layout from "./components/Layout";

// Páginas públicas
import Home from "./pages/Home";
import Articles from "./pages/Articles";
import ArticlePage from "./pages/ArticlePage";
import Videos from "./pages/Videos";
import Noticias from "./pages/Noticias";
import NoticiaPage from "./pages/NoticiaPage";

// Páginas administrativas
import Admin from "./pages/Admin";
import AdminLoginPage from "./pages/AdminLoginPage";

function App() {
  // ========================================================================================
  // ESTADO DE LA APLICACIÓN
  // ========================================================================================
  
  // Estado de búsqueda global
  const [search, setSearch] = useState("");
  
  // Estado de autenticación (persistido en localStorage)
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("token"));
  
  // Hook de navegación
  const navigate = useNavigate();

  // Estado del contenido principal (artículos, videos, noticias)
  const [content, setContent] = useState({ articles: [], videos: [], news: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ========================================================================================
  // GESTIÓN DE CONTENIDO
  // ========================================================================================

  /**
   * Cargar todo el contenido desde el backend
   * Función central que mantiene sincronizado el estado con la API
   */
  const loadContent = async () => {
    try {
      setLoading(true);
      const initialContent = await contentService.getAllContent();
      setContent(initialContent);
      setError(null);
    } catch (err) {
      setError("No se pudo cargar el contenido.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar contenido al iniciar la aplicación
  useEffect(() => {
    loadContent();
  }, []);

  // Mapeo de tipos de contenido para el backend
  const keyMap = { Artículo: 'articles', Video: 'videos', Noticia: 'news' };

  // ========================================================================================
  // HANDLERS DE CONTENIDO ADMINISTRATIVO
  // ========================================================================================

  /**
   * Handler para agregar nuevo contenido
   * Recarga todo el contenido para mantener sincronización
   */
  const handleAddContent = async (newContent, type) => {
    await loadContent();
  };

  /**
   * Handler para actualizar contenido existente
   * Recarga todo el contenido para mantener sincronización
   */
  const handleUpdateContent = async (updatedContent, type) => {
    await loadContent();
  };
  const handleDeleteContent = async (id, type) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar este ${type.toLowerCase()}?`)) {
      // Aquí deberías hacer la petición real de borrado si la implementas
      await loadContent();
    }
  };

  // Persistencia de autenticación admin tras refresh
  // Validar token con el backend al cargar la app para persistencia segura
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }
      try {
  const API_URL = import.meta.env.VITE_API_URL || '';
  const res = await fetch(`${API_URL}/api/validate-token`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem("token");
          localStorage.removeItem("idusuario");
        }
      } catch {
        setIsAuthenticated(false);
        localStorage.removeItem("token");
        localStorage.removeItem("idusuario");
      }
    };
    checkToken();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate("/admin");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("idusuario");
    navigate("/login");
  };

  return (
    <Routes>
      <Route path="/login" element={<AdminLoginPage onLogin={handleLogin} />} />
      <Route path="/" element={<Layout search={search} setSearch={setSearch} content={content} loading={loading} />}>
        <Route index element={<Home />} />
        <Route path="articles" element={<Articles search={search} />} />
        <Route path="article/:id" element={<ArticlePage />} />
        <Route path="videos" element={<Videos />} />
        <Route path="noticias" element={<Noticias />} />
        <Route path="noticia/:id" element={<NoticiaPage />} />
      </Route>
      <Route
        path="/admin"
        element={
          isAuthenticated
            ? <Admin
                onLogout={handleLogout}
                content={content}
                loading={loading}
                onAddContent={handleAddContent}
                onUpdateContent={handleUpdateContent}
                onDeleteContent={handleDeleteContent}
              />
            : <Navigate to="/login" />
        }
      />
    </Routes>
  );
}

function AppWrapper() {
  return (
    <Router>
      <ScrollToTop />
      <App />
    </Router>
  );
}

export default AppWrapper;