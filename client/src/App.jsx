import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { contentService } from "./services/contentService";
import ScrollToTop from "./components/ScrollToTop";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Articles from "./pages/Articles";
import ArticlePage from "./pages/ArticlePage";
import Admin from "./pages/Admin";
import AdminLoginPage from "./pages/AdminLoginPage";
import Videos from "./pages/Videos";
import Noticias from "./pages/Noticias";
import NoticiaPage from "./pages/NoticiaPage";


function App() {
  const [search, setSearch] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("token"));
  const navigate = useNavigate();

  const [content, setContent] = useState({ articles: [], videos: [], news: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar contenido desde el backend
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

  useEffect(() => {
    loadContent();
  }, []);

  const keyMap = { Artículo: 'articles', Video: 'videos', Noticia: 'news' };

  // Forzar recarga de contenido tras agregar/editar/eliminar
  const handleAddContent = async (newContent, type) => {
    await loadContent();
  };
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
        const res = await fetch("/api/validate-token", {
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