
export const contentService = {
  getAllContent: async () => {
    // Obtener artículos, videos y noticias reales del backend
    const [articlesRes, videosRes, newsRes] = await Promise.all([
      fetch('/api/articulos'),
      fetch('/api/videos'),
      fetch('/api/noticias')
    ]);
    const [rawArticles, videos, news] = await Promise.all([
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
      // Generar URL de descarga del PDF si existe
      pdfUrl: a.idarticulo ? `/api/articulos/file/articulo-${a.idarticulo}.pdf` : null,
      // Puedes agregar más campos si los necesitas
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