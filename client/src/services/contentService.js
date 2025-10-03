const API_URL = import.meta.env.VITE_API_URL || '';
export const contentService = {
  getAllContent: async () => {
    // Obtener artículos, videos y noticias reales del backend
    const [articlesRes, videosRes, newsRes] = await Promise.all([
      fetch(`${API_URL}/api/articulos`),
      fetch(`${API_URL}/api/videos`),
      fetch(`${API_URL}/api/noticias`)
    ]);
    const [rawArticles, rawVideos, rawNews] = await Promise.all([
      articlesRes.ok ? articlesRes.json() : [],
      videosRes.ok ? videosRes.json() : [],
      newsRes.ok ? newsRes.json() : [],
    ]);
    // Mapear artículos a la estructura esperada por el frontend
    // Utilidad para formatear fecha a dd/mm/yyyy
    const formatDate = (iso) => {
      if (!iso) return '';
      const d = new Date(iso);
      if (isNaN(d)) return '';
      return d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };
    const articles = rawArticles.map(a => ({
      id: a.idarticulo,
      title: a.titulo,
      autor: a.autor,
      resumen: a.resumen,
      nopaginas: a.nopaginas,
      idnumero: a.idnumero,
      idusuario: a.idusuario,
      date: formatDate(a.fecha),
      pdfUrl: a.idarticulo ? `${API_URL}/api/articulos/file/articulo-${a.idarticulo}.pdf` : null,
    }));
    // Mapear videos a la estructura esperada por el frontend
    const videos = rawVideos.map(v => ({
  id: v.idvideo,
  title: v.titulo,
  description: v.resumen,
  videoId: v.ruta,
  ruta: v.ruta
    }));
    // Mapear noticias a la estructura esperada por el frontend
    const news = rawNews.map(n => ({
      id: n.idnoticia,
      title: n.titulo,
      description: n.resumen,
      date: formatDate(n.fechanoticia),
      imageUrl: n.foto ? `${API_URL}/api/noticias/portada/${n.idnoticia}` : null,
      author: n.autor || n.idusuario,
      content: n.contenido
    }));
    return {
      articles,
      videos,
      news,
    };
  },
  createContent: async (newItem, type) => {
    // No se usa en admin, el modal ya hace la petición real
    return newItem;
  },
  updateContent: async (updatedItem, type) => {
    // No se usa en admin, el modal ya hace la petición real
    return updatedItem;
  },
  deleteContent: async (id, type) => {
    // No se usa en admin, el modal ya hace la petición real
    return { success: true };
  }
};