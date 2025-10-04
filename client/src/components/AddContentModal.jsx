/**
 * MODAL DE GESTIÓN DE CONTENIDO
 * 
 * Componente modal universal para agregar y editar artículos, noticias y videos
 * Maneja diferentes tipos de contenido con formularios específicos y validaciones
 * 
 * Funcionalidades:
 * - Formularios dinámicos según tipo de contenido
 * - Upload de archivos (PDFs para artículos, imágenes para noticias)
 * - Gestión de volúmenes y números para artículos
 * - Integración con YouTube para videos
 * - Validación de datos y manejo de errores
 */

import { useState, useEffect } from "react";

// URL base de la API desde variables de entorno
const API_URL = import.meta.env.VITE_API_URL || '';

// ========================================================================================
// FUNCIONES AUXILIARES PARA ARTÍCULOS
// ========================================================================================

/**
 * Obtener años (volúmenes) disponibles desde el backend
 * @returns {Array} Lista de volúmenes con idvolumen y anio
 */
async function fetchVolumenes() {
  const res = await fetch(`${API_URL}/api/articulos/volumenes`);
  return res.ok ? res.json() : [];
}

/**
 * Obtener números disponibles para un volumen específico
 * @param {string} idVolumen - ID del volumen
 * @returns {Array} Lista de números con idnumero y numero
 */
async function fetchNumeros(idVolumen) {
  const res = await fetch(`${API_URL}/api/articulos/numeros?volumen=${idVolumen}`);
  return res.ok ? res.json() : [];
}

// ========================================================================================
// COMPONENTE PRINCIPAL
// ========================================================================================

/**
 * Modal de gestión de contenido
 * 
 * @param {string} type - Tipo de contenido ('Artículo', 'Video', 'Noticia')
 * @param {Function} onClose - Callback para cerrar el modal
 * @param {Object} contentToEdit - Contenido a editar (null para crear nuevo)
 * @param {Function} addContent - Callback para agregar contenido
 * @param {Function} updateContent - Callback para actualizar contenido
 */
export default function AddContentModal({
  type,
  onClose,
  contentToEdit,
  addContent,
  updateContent
}) {
  // ========================================================================================
  // ESTADO DEL COMPONENTE
  // ========================================================================================
  
  // Datos del formulario
  const [formData, setFormData] = useState({});
  
  // Estado específico para artículos (volúmenes y números)
  const [volumenes, setVolumenes] = useState([]);
  const [numeros, setNumeros] = useState([]);
  const [nuevoAnio, setNuevoAnio] = useState("");
  const [nuevoNumero, setNuevoNumero] = useState("");
  const [selectedVolumen, setSelectedVolumen] = useState("");
  const [selectedNumero, setSelectedNumero] = useState("");
  
  // Determinar si estamos editando o creando
  const isEditing = !!contentToEdit;

  // ========================================================================================
  // EFECTOS DE INICIALIZACIÓN
  // ========================================================================================

  useEffect(() => {
    if (isEditing) {
      setFormData({ ...contentToEdit });
    } else {
      setFormData({
        title: "", autor: "", volume: "", number: "", date: "", pages: "", abstract: "",
        description: "", videoId: "", imageUrl: "", content: "", pdfFile: null,
      });
    }
    // Cargar volúmenes al abrir modal
    fetchVolumenes().then(setVolumenes);
  }, [contentToEdit, isEditing, type]);

  useEffect(() => {
    if (selectedVolumen && selectedVolumen !== 'nuevo') {
      fetchNumeros(selectedVolumen).then(setNumeros);
    } else {
      setNumeros([]);
    }
  }, [selectedVolumen]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };


  const handleSubmit = async () => {
  if (type === 'Artículo' && !isEditing) {
      // Resolver año y número
      let anio = selectedVolumen === 'nuevo' ? nuevoAnio : (volumenes.find(v => v.idvolumen == selectedVolumen)?.anio || "");
      let numero = selectedNumero === 'nuevo' ? nuevoNumero : (numeros.find(n => n.idnumero == selectedNumero)?.numero || "");
      if (!anio || !numero) {
        alert('Selecciona o ingresa año y número');
        return;
      }
      // Obtener idnumero
      let idNumero;
      try {
        const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/api/articulos/resolve-numero`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ anio, numero })
        });
        const data = await res.json();
        if (!res.ok || !data.idnumero) throw new Error('No se pudo resolver el número');
        idNumero = data.idnumero;
      } catch (err) {
        alert('Error resolviendo año/número');
        return;
      }
    // Subir artículo
    const fd = new FormData();
    const fechaEnviar = formData.date ? formData.date.substring(0, 10) : '';
    fd.append('titulo', formData.title);
    fd.append('autor', formData.autor);
    fd.append('idusuario', localStorage.getItem('idusuario') || '');
    fd.append('idnumero', idNumero);
    fd.append('resumen', formData.abstract);
    fd.append('nopaginas', formData.pages);
    fd.append('fecha', fechaEnviar);
    fd.append('documento', formData.pdfFile);
    // DEBUG: Mostrar datos enviados
    console.log('[ARTICULO MODAL] Enviando:', {
      titulo: formData.title,
      autor: formData.autor,
      idusuario: localStorage.getItem('idusuario') || '',
      idnumero: idNumero,
      resumen: formData.abstract,
      nopaginas: formData.pages,
      fecha: fechaEnviar,
      documento: formData.pdfFile
    });
      try {
        const token = localStorage.getItem('token');
  await fetch(`${API_URL}/api/articulos/upload`, {
          method: 'POST',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          body: fd
        });
      } catch (err) {
        alert('Error al subir el artículo');
      }
      // Esperar a que el padre recargue el contenido antes de cerrar
      if (addContent) await addContent({ ...formData, date: formData.date ? formData.date.substring(0, 10) : '' }, type);
      onClose();
      return;
    }
          {type === 'Noticia' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input name="title" value={formData.title || ''} onChange={handleChange} className="border-gray-300 p-2 rounded-lg w-full shadow-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
                <input name="autor" value={formData.autor || ''} onChange={handleChange} className="border-gray-300 p-2 rounded-lg w-full shadow-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Resumen</label>
                <textarea name="description" value={formData.description || ''} onChange={handleChange} className="border-gray-300 p-2 rounded-lg w-full shadow-sm" rows="3"></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
                <textarea name="content" value={formData.content || ''} onChange={handleChange} className="border-gray-300 p-2 rounded-lg w-full shadow-sm" rows="5"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input type="date" name="date" value={formData.date || ''} onChange={handleChange} className="border-gray-300 p-2 rounded-lg w-full shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Portada (imagen)</label>
                <input type="file" name="imageFile" accept="image/*" onChange={handleChange} className="border-gray-300 p-2 rounded-lg w-full shadow-sm" />
              </div>
            </div>
          )}
  if (type === 'Video' && !isEditing) {
      // Guardar video embebido
      try {
        const token = localStorage.getItem('token');
        const idUsuario = localStorage.getItem('idusuario');
  await fetch(`${API_URL}/api/videos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            idUsuario: idUsuario ? Number(idUsuario) : null,
            titulo: formData.title,
            resumen: formData.description,
            ruta: formData.videoId
          })
        });
      } catch (err) {
        alert('Error al subir el video');
      }
      // Esperar a que el padre recargue el contenido antes de cerrar
      if (addContent) await addContent({ ...formData, date: formData.date || new Date().toISOString().split('T')[0] }, type);
      onClose();
      return;
    }
    if (type === 'Noticia') {
      // Usar FormData para noticia (agregar o editar)
      const fd = new FormData();
      const fechaNoticiaEnviar = formData.date ? formData.date.substring(0, 10) : '';
      fd.append('titulo', formData.title);
      fd.append('autor', formData.autor);
      fd.append('resumen', formData.description);
      fd.append('contenido', formData.content);
      fd.append('fechaNoticia', fechaNoticiaEnviar);
      fd.append('idUsuario', localStorage.getItem('idusuario') || '');
      if (formData.imageFile) {
        fd.append('foto', formData.imageFile);
      }
      // DEBUG: Mostrar datos enviados
      console.log('[NOTICIA MODAL] Enviando:', {
        titulo: formData.title,
        autor: formData.autor,
        resumen: formData.description,
        contenido: formData.content,
        fechaNoticia: fechaNoticiaEnviar,
        idUsuario: localStorage.getItem('idusuario') || '',
        foto: formData.imageFile
      });
      try {
        const token = localStorage.getItem('token');
  await fetch(`${API_URL}/api/noticias/upload`, {
          method: 'POST',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          body: fd
        });
      } catch (err) {
        alert('Error al subir la noticia');
      }
      // Esperar a que el padre recargue el contenido antes de cerrar
      if (addContent) await addContent({ ...formData, date: formData.date ? formData.date.substring(0, 10) : '' }, type);
      onClose();
      return;
    }
    if (isEditing && type === 'Artículo') {
      // Editar artículo (PUT)
      const fd = new FormData();
      const fechaEnviar = formData.date ? formData.date.substring(0, 10) : '';
      fd.append('titulo', formData.title);
      fd.append('autor', formData.autor);
      fd.append('idusuario', formData.idusuario || localStorage.getItem('idusuario') || '');
      fd.append('idnumero', formData.idnumero);
      fd.append('resumen', formData.abstract);
      fd.append('nopaginas', formData.pages);
      fd.append('fecha', fechaEnviar);
      if (formData.pdfFile) fd.append('documento', formData.pdfFile);
      // DEBUG: Mostrar datos enviados
      console.log('[ARTICULO MODAL][EDIT] Enviando:', {
        titulo: formData.title,
        autor: formData.autor,
        idusuario: formData.idusuario || localStorage.getItem('idusuario') || '',
        idnumero: formData.idnumero,
        resumen: formData.abstract,
        nopaginas: formData.pages,
        fecha: fechaEnviar,
        documento: formData.pdfFile
      });
      try {
        const token = localStorage.getItem('token');
  await fetch(`${API_URL}/api/articulos/${formData.id}`, {
          method: 'PUT',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          body: fd
        });
      } catch (err) {
        alert('Error al editar el artículo');
      }
      if (updateContent) await updateContent({ ...formData, date: fechaEnviar }, type);
      onClose();
      return;
    }
    if (isEditing) {
      if (updateContent) await updateContent({ ...formData, date: formData.date ? formData.date.substring(0, 10) : '' }, type);
    } else {
      if (addContent) await addContent(formData, type);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{isEditing ? `Editar ${type}` : `Agregar ${type}`}</h2>
        <div className="space-y-4">
          
          {type === 'Artículo' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input name="title" value={formData.title || ''} onChange={handleChange} className="border-gray-300 p-2 rounded-lg w-full shadow-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
                <input name="autor" value={formData.autor || ''} onChange={handleChange} className="border-gray-300 p-2 rounded-lg w-full shadow-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Abstract (Resumen)</label>
                <textarea name="abstract" value={formData.abstract || ''} onChange={handleChange} className="border-gray-300 p-2 rounded-lg w-full shadow-sm" rows="4"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Año (Volumen)</label>
                <select value={selectedVolumen} onChange={e => setSelectedVolumen(e.target.value)} className="border-gray-300 p-2 rounded-lg w-full shadow-sm">
                  <option value="">Selecciona año</option>
                  {volumenes.map(v => (
                    <option key={v.idvolumen} value={v.idvolumen}>{v.anio}</option>
                  ))}
                  <option value="nuevo">Nuevo año...</option>
                </select>
                {selectedVolumen === 'nuevo' && (
                  <input type="number" placeholder="Año nuevo" value={nuevoAnio} onChange={e => setNuevoAnio(e.target.value)} className="mt-2 border-gray-300 p-2 rounded-lg w-full shadow-sm" />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número (Edición)</label>
                <select value={selectedNumero} onChange={e => setSelectedNumero(e.target.value)} className="border-gray-300 p-2 rounded-lg w-full shadow-sm">
                  <option value="">Selecciona número</option>
                  {numeros.map(n => (
                    <option key={n.idnumero} value={n.idnumero}>{n.numero}</option>
                  ))}
                  <option value="nuevo">Nuevo número...</option>
                </select>
                {selectedNumero === 'nuevo' && (
                  <input type="number" placeholder="Nuevo número" value={nuevoNumero} onChange={e => setNuevoNumero(e.target.value)} className="mt-2 border-gray-300 p-2 rounded-lg w-full shadow-sm" />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Publicación</label>
                <input name="date" type="date" value={formData.date || ''} onChange={handleChange} className="border-gray-300 p-2 rounded-lg w-full shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Páginas</label>
                <input name="pages" type="number" value={formData.pages || ''} onChange={handleChange} className="border-gray-300 p-2 rounded-lg w-full shadow-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Artículo (PDF)</label>
                <input name="pdfFile" type="file" accept="application/pdf" onChange={handleChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
              </div>
            </div>
          )}

          {type === 'Video' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título del Video</label>
                <input name="title" value={formData.title || ''} onChange={handleChange} className="border-gray-300 p-2 rounded-lg w-full shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Breve</label>
                <textarea name="description" value={formData.description || ''} onChange={handleChange} className="border-gray-300 p-2 rounded-lg w-full shadow-sm" rows="3"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID del Video de YouTube</label>
                <input name="videoId" value={formData.videoId || ''} onChange={handleChange} className="border-gray-300 p-2 rounded-lg w-full shadow-sm" />
              </div>
            </div>
          )}

          {type === 'Noticia' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título de la Noticia</label>
                <input name="title" value={formData.title || ''} onChange={handleChange} className="border-gray-300 p-2 rounded-lg w-full shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
                <input name="autor" value={formData.autor || ''} onChange={handleChange} className="border-gray-300 p-2 rounded-lg w-full shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input name="date" type="date" value={formData.date || ''} onChange={handleChange} className="border-gray-300 p-2 rounded-lg w-full shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Breve (Resumen)</label>
                <textarea name="description" value={formData.description || ''} onChange={handleChange} className="border-gray-300 p-2 rounded-lg w-full shadow-sm" rows="3"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen de portada (opcional)</label>
                <input name="imageFile" type="file" accept="image/*" onChange={handleChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenido Completo de la Noticia</label>
                <textarea name="content" value={formData.content || ''} onChange={handleChange} className="border-gray-300 p-2 rounded-lg w-full shadow-sm" rows="6"></textarea>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300">Cancelar</button>
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700">{isEditing ? 'Guardar Cambios' : 'Agregar'}</button>
        </div>
      </div>
    </div>
  );
}