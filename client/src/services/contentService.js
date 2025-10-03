
export const contentService = {
  getAllContent: async () => {
    // Obtener artículos, videos y noticias reales del backend
    const [articlesRes, videosRes, newsRes] = await Promise.all([
      fetch('/api/articulos'),
      fetch('/api/videos'),
      fetch('/api/noticias')
    ]);
    const [rawArticles, rawVideos, rawNews] = await Promise.all([
      articlesRes.ok ? articlesRes.json() : [],
      videosRes.ok ? videosRes.json() : [],
      newsRes.ok ? newsRes.json() : [],
    ]);
    // Mapear artículos a la estructura esperada por el frontend
    const articles = rawArticles.map(a => ({
      id: a.idarticulo,
      title: a.titulo,
      autor: a.autor,
      resumen: a.resumen,
      nopaginas: a.nopaginas,
      idnumero: a.idnumero,
      idusuario: a.idusuario,
      pdfUrl: a.idarticulo ? `/api/articulos/file/articulo-${a.idarticulo}.pdf` : null,
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
  date: n.fechanoticia,
  imageUrl: n.foto ? `/api/noticias/portada/${n.idnoticia}` : null,
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