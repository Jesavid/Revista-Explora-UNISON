import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';

function VideoCard({ video }) {
  return (
    // --- ¡CLASES HOVER AÑADIDAS! ---
    <div className="bg-white p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105">
      <iframe
        className="w-full h-48 rounded-lg mb-4"
        src={`https://www.youtube.com/embed/${video.videoId}`}
        title={video.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      ></iframe>
      <h3 className="text-xl font-bold text-gray-800">{video.title}</h3>
      <p className="text-gray-600 mt-2">{video.description}</p>
    </div>
  );
}

export default function Videos() {
  const { content, loading } = useOutletContext();
  const videos = content.videos || [];
  const navigate = useNavigate(); // Hook para la navegación

  if (loading) {
    return <div className="text-center p-8">Cargando videos...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto p-4 md:p-8">
        {/* --- ¡BOTÓN DE VOLVER AÑADIDO! --- */}
        <button 
          onClick={() => navigate(-1)} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-6"
        >
          &larr; Volver
        </button>

        <section className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Todos los Videos</h2>
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-lg">
              No hay videos para mostrar en este momento.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}