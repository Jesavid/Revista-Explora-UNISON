import { useState } from "react";
import AdminHeader from "../components/AdminHeader";
import AddContentModal from "../components/AddContentModal";

// Pequeños componentes de íconos para la verificación del PDF
function CheckIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
}

function XIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
}

export default function Admin({ onLogout, content, loading, onAddContent, onUpdateContent, onDeleteContent }) {
  const [activeTab, setActiveTab] = useState("articulos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contentToEdit, setContentToEdit] = useState(null);

  const keyMap = { articulos: 'articles', videos: 'videos', noticias: 'news' };

  const handleOpenEditModal = (item) => {
    setContentToEdit(item);
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setContentToEdit(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setContentToEdit(null);
  };
  
  const getModalType = () => {
    if (activeTab === 'articulos') return 'Artículo';
    if (activeTab === 'videos') return 'Video';
    if (activeTab === 'noticias') return 'Noticia';
  };

  const handleDelete = (id) => {
    onDeleteContent(id, getModalType());
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <AdminHeader onLogout={onLogout} />
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Contenido</h1>
          <button onClick={handleOpenAddModal} className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 shadow">
            + Agregar contenido
          </button>
        </div>
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-4">
            <button onClick={() => setActiveTab("articulos")} className={`py-2 px-4 font-semibold ${activeTab === 'articulos' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Artículos</button>
            <button onClick={() => setActiveTab("videos")} className={`py-2 px-4 font-semibold ${activeTab === 'videos' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Videos</button>
            <button onClick={() => setActiveTab("noticias")} className={`py-2 px-4 font-semibold ${activeTab === 'noticias' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Noticias</button>
          </nav>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {loading ? <p>Cargando...</p> : (
            <>
              {activeTab === 'articulos' && (
                <table className="min-w-full text-left table-auto">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="p-4 uppercase text-xs font-bold text-gray-500 w-2/5">Título</th>
                      <th className="p-4 uppercase text-xs font-bold text-gray-500">Autor</th>
                      <th className="p-4 uppercase text-xs font-bold text-gray-500">Fecha</th>
                      <th className="p-4 uppercase text-xs font-bold text-gray-500 text-center">PDF</th>
                      <th className="p-4 uppercase text-xs font-bold text-gray-500 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(content.articles || []).map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">{item.title}</td>
                        <td className="p-4 text-gray-600">{item.autor}</td>
                        <td className="p-4 text-gray-600">{item.date}</td>
                        <td className="p-4 flex justify-center">
                          {item.pdfUrl || item.pdfFile ? <CheckIcon /> : <XIcon />}
                        </td>
                        <td className="p-4 space-x-4 text-right">
                          <button onClick={() => handleOpenEditModal(item)} className="text-blue-600 hover:underline font-semibold">Editar</button>
                          <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline font-semibold">Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {activeTab === 'videos' && (
                <table className="min-w-full text-left">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="p-4 uppercase text-xs font-bold text-gray-500">Título</th>
                      <th className="p-4 uppercase text-xs font-bold text-gray-500 text-right">Acciones</th>
                    </tr>
                  </thead>
                   <tbody>
                    {(content.videos || []).map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">{item.title}</td>
                        <td className="p-4 space-x-4 text-right">
                          <button onClick={() => handleOpenEditModal(item)} className="text-blue-600 hover:underline font-semibold">Editar</button>
                          <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline font-semibold">Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {activeTab === 'noticias' && (
                 <table className="min-w-full text-left">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="p-4 uppercase text-xs font-bold text-gray-500">Título</th>
                      <th className="p-4 uppercase text-xs font-bold text-gray-500">Autor</th>
                      <th className="p-4 uppercase text-xs font-bold text-gray-500">Fecha</th>
                      <th className="p-4 uppercase text-xs font-bold text-gray-500 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(content.news || []).map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">{item.title}</td>
                        <td className="p-4 text-gray-600">{item.author}</td>
                        <td className="p-4 text-gray-600">{item.date}</td>
                        <td className="p-4 space-x-4 text-right">
                          <button onClick={() => handleOpenEditModal(item)} className="text-blue-600 hover:underline font-semibold">Editar</button>
                          <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline font-semibold">Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>
      {isModalOpen && (
        <AddContentModal
          type={getModalType()}
          onClose={handleCloseModal}
          contentToEdit={contentToEdit}
          addContent={onAddContent}
          updateContent={onUpdateContent}
        />
      )}
    </div>
  );
}