import { useState, useEffect } from "react";

// Utilidad para obtener años y números desde el backend
async function fetchVolumenes() {
  const res = await fetch('/api/articulos/volumenes');
  return res.ok ? res.json() : [];
}
async function fetchNumeros(idVolumen) {
  const res = await fetch(`/api/articulos/numeros?volumen=${idVolumen}`);
  return res.ok ? res.json() : [];
}

export default function AddContentModal({
  type,
  onClose,
  contentToEdit,
  addContent,
  updateContent
}) {
  const [formData, setFormData] = useState({});
  const [volumenes, setVolumenes] = useState([]);
  const [numeros, setNumeros] = useState([]);
  const [nuevoAnio, setNuevoAnio] = useState("");
  const [nuevoNumero, setNuevoNumero] = useState("");
  const [selectedVolumen, setSelectedVolumen] = useState("");
  const [selectedNumero, setSelectedNumero] = useState("");
  const isEditing = !!contentToEdit;

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
  const res = await fetch('/api/articulos/resolve-numero', {
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
  fd.append('titulo', formData.title);
  fd.append('autor', formData.autor);
  fd.append('idusuario', localStorage.getItem('idusuario') || '');
  fd.append('idnumero', idNumero);
  fd.append('resumen', formData.abstract);
  fd.append('nopaginas', formData.pages);
  fd.append('documento', formData.pdfFile);
      try {
        const token = localStorage.getItem('token');
        await fetch('/api/articulos/upload', {
          method: 'POST',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          body: fd
        });
      } catch (err) {
        alert('Error al subir el artículo');
      }
      onClose();
      return;
    }
    if (type === 'Noticia' && !isEditing) {
      // ...código existente para noticia...
      if (formData.imageFile) {
        const fd = new FormData();
        fd.append('titulo', formData.title);
  fd.append('username', localStorage.getItem('username') || '');
        fd.append('resumen', formData.description);
        fd.append('contenido', formData.content);
        fd.append('fechaNoticia', formData.date);
        fd.append('foto', formData.imageFile);
        try {
          const token = localStorage.getItem('token');
          await fetch('/api/noticias/upload', {
            method: 'POST',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: fd
          });
        } catch (err) {
          alert('Error al subir la noticia');
        }
        onClose();
        return;
      } else {
        addContent(formData, type);
        onClose();
        return;
      }
    }
    if (type === 'Video' && !isEditing) {
      // Guardar video embebido
      try {
        const token = localStorage.getItem('token');
        await fetch('/api/videos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            titulo: formData.title,
            resumen: formData.description,
            imagen: formData.videoId, // Aquí puedes guardar el ID o la URL embebida
            username: localStorage.getItem('username') || ''
          })
        });
      } catch (err) {
        alert('Error al subir el video');
      }
      onClose();
      return;
    }
    if (isEditing) {
      updateContent(formData, type);
    } else {
      addContent(formData, type);
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