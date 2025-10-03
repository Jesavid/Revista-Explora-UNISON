import React, { useMemo } from "react";
import { Link, useOutletContext } from "react-router-dom";

// --- TARJETA REDISEÑADA ---
function ArticleCard({ id, title, author, date, abstract }) {
  // Truncamos el resumen para mostrar un fragmento
  const shortAbstract = (abstract || '').split(' ').slice(0, 25).join(' ') + '...';

  return (
    <Link to={`/article/${id}`}>
      <div className="bg-white p-6 h-full rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer flex flex-col">
        <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
        <div className="text-sm text-gray-500 mb-2">
          <span>Por: <strong>{author}</strong></span>
        </div>
        {date && (
          <div className="text-xs text-gray-400 mb-2">Publicado: {date}</div>
        )}
        <p className="text-gray-600 flex-grow">{shortAbstract}</p>
        <span className="text-blue-600 font-semibold mt-4 self-start">
          Leer más &rarr;
        </span>
      </div>
    </Link>
  );
}

export default function Articles({ search }) {
  const { content, loading } = useOutletContext();
  const articles = content.articles || [];

  const filteredArticles = useMemo(() => {
    const normalizeText = (text) => text?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";
    const normalizedSearch = normalizeText(search);
    if (!normalizedSearch) return articles;
    return articles.filter(
      (article) =>
        normalizeText(article.title).includes(normalizedSearch) ||
        normalizeText(article.autor).includes(normalizedSearch)
    );
  }, [search, articles]);

  if (loading) {
    return <div className="text-center p-8">Cargando artículos...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto p-4 md:p-8">
        <section className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6">Todos los Artículos</h2>
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  author={article.autor}
                  date={article.date}
                  abstract={article.resumen}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-lg">
              No se encontraron artículos que coincidan con tu búsqueda.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}