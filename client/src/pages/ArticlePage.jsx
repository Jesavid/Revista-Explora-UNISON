import React from 'react';
import { useParams, Link, useOutletContext, useNavigate } from 'react-router-dom';

export default function ArticlePage() {
  const { id } = useParams();
  const { content, loading } = useOutletContext();
  const navigate = useNavigate();

  if (loading) {
    return <div className="text-center p-8">Cargando artículo...</div>;
  }
  
  const articles = content.articles || [];
  const article = articles.find(a => a.id === Number(id));

  if (!article) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold">Artículo no encontrado</h2>
        <Link to="/articles" className="text-blue-500 hover:underline mt-4 inline-block">
          Volver a todos los artículos
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <main className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="bg-white p-8 rounded-lg">
          <Link to="/articles" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 mb-6 inline-block">
            &larr; Todos los artículos
          </Link>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">{article.title}</h1>
          
          <p className="text-lg italic text-gray-600 mb-6 border-l-4 border-blue-200 pl-4">
            {article.resumen}
          </p>
          
          <div className="w-full">
            <div className="text-lg space-y-2">
              <p><strong>Autor:</strong> {article.autor}</p>
              <p><strong>Número:</strong> {article.idnumero}</p>
              <p><strong>Páginas:</strong> {article.nopaginas}</p>
            </div>
            {article.pdfUrl ? (
              <>
                <a 
                  href={article.pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  download={`${article.title.replace(/\s/g, '_')}.pdf`}
                  className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 inline-block shadow-lg"
                >
                  Descargar PDF
                </a>
                {/* Preview PDF */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-2">Vista previa del artículo</h3>
                  <iframe
                    src={article.pdfUrl}
                    title="Vista previa PDF"
                    width="100%"
                    height="600px"
                    className="border rounded shadow"
                  />
                </div>
              </>
            ) : (
              <button 
                disabled 
                className="mt-6 bg-gray-300 text-gray-500 px-6 py-2 rounded-lg font-bold cursor-not-allowed"
              >
                PDF no disponible
              </button>
            )}
          </div>
          <div className="mt-8 pt-6 border-t flex justify-between">
            {Number(id) > 1 ? (
              <Link to={`/article/${Number(id) - 1}`} className="text-gray-600 hover:text-black font-semibold">
                &larr; Artículo Anterior
              </Link>
            ) : (
              <div></div>
            )}
            {Number(id) < articles.length && (
              <Link to={`/article/${Number(id) + 1}`} className="text-gray-600 hover:text-black font-semibold">
                Artículo Siguiente &rarr;
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}