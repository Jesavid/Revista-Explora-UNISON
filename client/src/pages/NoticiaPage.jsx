import React from 'react';
import { useParams, Link, useOutletContext, useNavigate } from 'react-router-dom';

export default function NoticiaPage() {
  const { id } = useParams();
  const { content, loading } = useOutletContext();
  const navigate = useNavigate();

  if (loading) {
    return <div className="text-center p-8">Cargando noticia...</div>;
  }

  const noticia = content.news?.find(n => n.id === Number(id));

  if (!noticia) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold">Noticia no encontrada</h2>
        <Link to="/noticias" className="text-blue-500 hover:underline mt-4 inline-block">
          Volver a todas las noticias
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(noticia.date).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  });

  return (
    <div className="bg-white min-h-screen">
      <main className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="text-blue-600 font-semibold hover:underline mb-4"
          >
            &larr; Volver
          </button>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            {noticia.title}
          </h1>
          <div className="flex items-center text-md text-gray-500 font-medium mt-2">
            <span>Por: <strong>{noticia.author}</strong></span>
            <span className="mx-2">|</span>
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* --- CAMBIO CRÍTICO: Esta sección se oculta completamente si 'noticia.imageUrl' no existe --- */}
        {noticia.imageUrl && (
          <img
            src={noticia.imageUrl}
            alt={noticia.title}
            className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-lg mb-8 bg-gray-200"
          />
        )}

        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
          <p className="whitespace-pre-wrap">
            {noticia.content}
          </p>
        </div>
      </main>
    </div>
  );
}