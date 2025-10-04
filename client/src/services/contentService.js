/**
 * SERVICIO DE CONTENIDO
 * 
 * Servicio centralizado para todas las operaciones con la API de contenido
 * Maneja la comunicación con el backend y la transformación de datos
 * 
 * Funcionalidades:
 * - Obtener todo el contenido (artículos, videos, noticias)
 * - Transformación de datos del backend al formato del frontend
 * - Manejo de errores y respuestas no válidas
 * - Formateo de fechas y URLs
 */

// URL base de la API desde variables de entorno
const API_URL = import.meta.env.VITE_API_URL || '';

export const contentService = {
  
  /**
   * Obtener todo el contenido desde el backend
   * 
   * Realiza peticiones concurrentes a todos los endpoints de contenido
   * y transforma los datos al formato esperado por el frontend
   * 
   * @returns {Object} Objeto con articles, videos y news formateados
   */
  getAllContent: async () => {
    try {
      // Peticiones concurrentes para mejor rendimiento
      const [articlesRes, videosRes, newsRes] = await Promise.all([
        fetch(`${API_URL}/api/articulos`),
        fetch(`${API_URL}/api/videos`),
        fetch(`${API_URL}/api/noticias`)
      ]);

      /**
       * Función auxiliar para manejo seguro de respuestas JSON
       * Previene errores por respuestas malformadas o no válidas
       * 
       * @param {Response} res - Respuesta de fetch
       * @param {string} tipo - Tipo de contenido para logging
       * @returns {Array} Array vacío en caso de error, datos parseados si es exitoso
       */
      async function safeJson(res, tipo) {
        if (!res.ok) {
          console.warn(`[contentService] Error en respuesta de ${tipo}:`, res.status, res.statusText);
          return [];
        }
        try {
          return await res.json();
        } catch (e) {
          console.warn(`[contentService] Respuesta no es JSON válido para ${tipo}. Probable error de backend o URL:`, e);
          return [];
        }
      }

      // Parsear respuestas de manera segura
      const [rawArticles, rawVideos, rawNews] = await Promise.all([
        safeJson(articlesRes, 'articulos'),
        safeJson(videosRes, 'videos'),
        safeJson(newsRes, 'noticias'),
      ]);

      // ========================================================================================
      // TRANSFORMACIÓN DE DATOS
      // ========================================================================================

      /**
       * Formatear fecha ISO a formato local
       * @param {string} iso - Fecha en formato ISO
       * @returns {string} Fecha formateada DD/MM/YYYY
       */
      const formatDate = (iso) => {
        if (!iso) return '';
        const d = new Date(iso);
        if (isNaN(d)) return '';
        return d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
      };

      // Transformar artículos del formato backend al frontend
      const articles = rawArticles.map(a => ({
        id: a.idarticulo,
        title: a.titulo,
        autor: a.autor,
        resumen: a.resumen,
        nopaginas: a.nopaginas,
        idnumero: a.idnumero,
        idusuario: a.idusuario,
        date: formatDate(a.fecha),
        // Generar URL del PDF basada en el ID del artículo
        pdfUrl: a.idarticulo ? `${API_URL}/api/articulos/file/articulo-${a.idarticulo}.pdf` : null,
      }));

        // Transformar videos del formato backend al frontend
        const videos = rawVideos.map(v => ({
          id: v.idvideo,
          title: v.titulo,
          description: v.resumen,
          videoId: v.ruta,  // ID del video de YouTube
          ruta: v.ruta
        }));

        // Transformar noticias del formato backend al frontend  
        const news = rawNews.map(n => ({
          id: n.idnoticia,
          title: n.titulo,
          description: n.resumen,
          date: formatDate(n.fechanoticia),
          // Generar URL de la imagen de portada si existe
          imageUrl: n.foto ? `${API_URL}/api/noticias/portada/${n.idnoticia}` : null,
          author: n.autor || n.idusuario,
          content: n.contenido
        }));

        // Retornar estructura de datos normalizada
        return {
          articles,
          videos,
          news,
        };

    } catch (error) {
      console.error('[contentService] Error obteniendo contenido:', error);
      // Retornar estructura vacía en caso de error general
      return {
        articles: [],
        videos: [],
        news: []
      };
    }
  },

  /**
   * Crear nuevo contenido (no implementado - se usa el modal directo)
   * @param {Object} newItem - Nuevo elemento a crear
   * @param {string} type - Tipo de contenido
   * @returns {Object} Elemento creado
   */
  createContent: async (newItem, type) => {
    // El modal maneja directamente las peticiones de creación
    return newItem;
  },

  /**
   * Actualizar contenido existente (no implementado - se usa el modal directo)
   * @param {Object} updatedItem - Elemento actualizado
   * @param {string} type - Tipo de contenido
   * @returns {Object} Elemento actualizado
   */
  updateContent: async (updatedItem, type) => {
    // El modal maneja directamente las peticiones de actualización
    return updatedItem;
  },

  /**
   * Eliminar contenido
   * @param {string} id - ID del elemento a eliminar
   * @param {string} type - Tipo de contenido ('articulo', 'noticia', 'video' o 'Artículo', 'Noticia', 'Video')
   * @returns {Object} Resultado de la operación
   */
  deleteContent: async (id, type) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      // Normalizar tipo a minúsculas y mapear a endpoints
      const normalizedType = type.toLowerCase();
      const typeMapping = {
        'artículo': 'articulo',
        'articulo': 'articulo', 
        'noticia': 'noticia',
        'video': 'video'
      };

      const mappedType = typeMapping[normalizedType];
      if (!mappedType) {
        throw new Error(`Tipo de contenido no válido: ${type}. Tipos válidos: Artículo, Noticia, Video`);
      }

      // Mapear tipos a endpoints
      const endpoints = {
        'articulo': '/api/articulos',
        'noticia': '/api/noticias', 
        'video': '/api/videos'
      };

      const endpoint = endpoints[mappedType];

      console.log(`[DELETE] Eliminando ${type} (${mappedType}) ID: ${id}`);
      
      const response = await fetch(`${API_URL}${endpoint}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(`[DELETE] ${type} eliminado exitosamente:`, result);
      
      return { success: true, message: result.message, id: result.id };
      
    } catch (error) {
      console.error(`[DELETE ERROR] Error eliminando ${type}:`, error);
      return { success: false, error: error.message };
    }
  }
};