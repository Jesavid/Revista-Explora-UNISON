import React, { useEffect, useState } from "react";
import { useParams, Link, useOutletContext } from "react-router-dom";

export default function ArticlePage() {
  const { id } = useParams();

  const { content } = useOutletContext();
  const totalArticles = content?.articles?.length || 0;

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchArticle() {
      try {
        const res = await fetch(
          `http://localhost:4500/api/articulos/${id}`
        );
        const data = await res.json();

        const articleWithPdf = {
          ...data,
          pdfUrl: `http://localhost:4500/api/articulos/file/articulo-${id}.pdf`
        };

        setArticle(articleWithPdf);
      } catch (err) {
        console.error("Error cargando artículo:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [id]);

  if (loading) {
    return <div className="text-center p-8">Cargando artículo...</div>;
  }

  if (!article || article.message) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold">Artículo no encontrado</h2>
        <Link to="/articles" className="text-blue-500 underline">
          Volver a artículos
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <main className="container mx-auto p-4 md:p-8 max-w-4xl">
        {/* Volver */}
        <Link
          to="/articles"
          className="inline-block mb-6 bg-blue-600 text-white px-4 py-2 rounded"
        >
          ← Todos los artículos
        </Link>

        {/* Título */}
        <h1 className="text-4xl font-bold mb-4">{article.titulo}</h1>

        {/* Resumen */}
        <p className="italic text-gray-600 mb-6 border-l-4 pl-4">
          {article.resumen}
        </p>

        {/* Info */}
        <div className="space-y-2 text-lg mb-6">
          <p><strong>Autor:</strong> {article.autor}</p>
          <p><strong>Número:</strong> {article.idnumero}</p>
          <p><strong>Páginas:</strong> {article.nopaginas}</p>
          <p>
            <strong>Palabras clave:</strong>{" "}
            {article.palabras_clave || "Sin palabras clave"}
          </p>
        </div>

        {/* PDF */}
        {article.pdfUrl ? (
          <>
            <a
              href={article.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={`articulo-${id}.pdf`}
              className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 inline-block shadow-lg"
            >
              Descargar PDF
            </a>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">
                Vista previa del artículo
              </h3>
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

        {/* Navegación correcta */}
        <div className="mt-8 pt-6 border-t flex justify-between">
          {Number(id) > 1 ? (
            <Link
              to={`/article/${Number(id) - 1}`}
              className="text-gray-600 hover:text-black font-semibold"
            >
              ← Artículo anterior
            </Link>
          ) : (
            <span />
          )}

          {Number(id) < totalArticles ? (
            <Link
              to={`/article/${Number(id) + 1}`}
              className="text-gray-600 hover:text-black font-semibold"
            >
              Artículo siguiente →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </main>
    </div>
  );
}
