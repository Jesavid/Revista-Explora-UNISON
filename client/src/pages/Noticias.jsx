import React from 'react';
import { useOutletContext, useNavigate, Link } from 'react-router-dom';
import placeholderImage from "../assets/placeholder-news.png"; // ¡Asegúrate de que esta ruta sea correcta!

function NewsCard({ noticia }) {
  return (
    <Link to={`/noticia/${noticia.id}`} className="block h-full">
      <div className="bg-white p-4 h-full rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer flex flex-col">
        {/* Usa la imagen real o el placeholder estático */}
        <img
          src={noticia.imageUrl || placeholderImage}
          alt={noticia.title}
          className="mb-4 rounded-lg w-full h-48 object-cover bg-gray-200"
          loading="lazy"
        />
        <h3 className="text-xl font-bold mb-2 text-gray-800">{noticia.title}</h3>
        <p className="text-gray-600 flex-grow">{noticia.description}</p>
      </div>
    </Link>
  );
}

export default function Noticias() {
  const { content, loading } = useOutletContext();
  const noticias = content.news || [];
  const navigate = useNavigate();

  if (loading) {
    return <div className="text-center p-8">Cargando noticias...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto p-4 md:p-8">
        <button 
          onClick={() => navigate(-1)} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-6"
        >
          &larr; Volver
        </button>

        <section className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Todas las Noticias</h2>
          {noticias.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {noticias.map((noticia) => (
                <NewsCard key={noticia.id} noticia={noticia} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-lg">
              No hay noticias para mostrar en este momento.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}