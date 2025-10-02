import { Link, useOutletContext } from "react-router-dom";
import placeholderImage from "../assets/placeholder-news.png";

function Home() {
  const { content, loading } = useOutletContext();
  
  const videos = content.videos?.slice(0, 3) || [];
  const noticias = content.news?.slice(0, 3) || [];
  
  if (loading) {
    return <div className="text-center p-8">Cargando contenido...</div>;
  }

  return (
    <main className="container mx-auto p-4 bg-gray-50">
      {/* Intro */}
      <section className="mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Bienvenidos a la Revista Explora Unison
          </h2>
          <p className="text-lg text-gray-600">
            Somos una revista digital de divulgación científica de la Universidad
            de Sonora, enfocada en la ingeniería y el futuro.
          </p>
        </div>
      </section>

      {/* Llamado a la Acción */}
      <section className="mb-8 text-center">
        <div className="bg-blue-800 text-white p-12 rounded-lg shadow-lg">
          <h2 className="text-4xl font-extrabold mb-4">Explora Nuestros Artículos</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Descubre las últimas innovaciones, estudios y avances de la División de Ingeniería de la Universidad de Sonora.
          </p>
          <Link 
            to="/articles" 
            className="inline-block bg-white text-blue-800 font-bold text-lg px-10 py-3 rounded-full hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            Ver Publicaciones
          </Link>
        </div>
      </section>

      {/* Videos */}
      <section className="mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Videos Recientes</h2>
            <Link to="/videos" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Ver todos
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div 
                key={video.id} 
                className="bg-white p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
              >
                <iframe
                  className="mb-4 rounded-lg w-full"
                  height="200"
                  src={`https://www.youtube.com/embed/${video.videoId}`}
                  title={video.title}
                  loading="lazy"
                ></iframe>
                <h3 className="text-xl font-bold text-gray-800">{video.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Noticias */}
      <section className="mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Noticias Recientes</h2>
            <Link to="/noticias" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Ver todos
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {noticias.map((noticia) => (
              <Link to={`/noticia/${noticia.id}`} key={noticia.id} className="block h-full">
                <div className="bg-white p-4 h-full rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer">
                  <img
                    src={noticia.imageUrl || placeholderImage}
                    alt={noticia.title}
                    className="mb-4 rounded-lg object-cover w-full h-48 bg-gray-200"
                    loading="lazy"
                  />
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{noticia.title}</h3>
                  <p className="text-base text-gray-600">{noticia.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;