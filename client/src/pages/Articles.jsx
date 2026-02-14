import React, { useMemo } from "react";
import { Link, useOutletContext } from "react-router-dom";

function ArticleCard({ id, title, author, date, abstract }) {

  const shortAbstract =
    (abstract || "").split(" ").slice(0, 25).join(" ") + "...";

  return (
    <Link to={`/article/${id}`}>
      <div className="bg-white p-6 h-full rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all cursor-pointer flex flex-col">
        <h3 className="text-xl font-bold mb-2">{title}</h3>

        <p className="text-sm text-gray-500 mb-2">
          Por: <strong>{author}</strong>
        </p>

        {date && (
          <p className="text-xs text-gray-400 mb-2">
            Publicado: {date}
          </p>
        )}

        <p className="text-gray-600 flex-grow">{shortAbstract}</p>

        <span className="text-blue-600 font-semibold mt-4">
          Leer más →
        </span>
      </div>
    </Link>
  );
}

export default function Articles({ search }) {
  const { content, loading } = useOutletContext();

  const articles = content.articles || [];

  console.log("ARTÍCULO COMPLETO:", articles[0]);

  const filteredArticles = useMemo(() => {
    const normalize = (t) =>
      t?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";

    const s = normalize(search);
    if (!s) return articles;

    return articles.filter(
      (a) =>
        normalize(a.title).includes(s) ||  
        normalize(a.autor).includes(s)
    );
  }, [search, articles]);

  if (loading) {
    return <div className="text-center p-8">Cargando artículos...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto p-4 md:p-8">
        <h2 className="text-3xl font-bold mb-6">Todos los Artículos</h2>

        {filteredArticles.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((a) => (
              <ArticleCard
                key={a.id}
                id={a.id}           
                title={a.title}
                author={a.autor}
                date={a.date}
                abstract={a.resumen}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No se encontraron artículos
          </p>
        )}
      </main>
    </div>
  );
}
