import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import logo from "../assets/logo_white_nobg.png";

function SearchInput({ search, setSearch }) {
  return (
    <div className="relative w-48">
      <input
        type="text"
        placeholder="Buscar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="rounded-full py-2 px-4 text-gray-900 w-full bg-white"
      />
      <button className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-4 text-gray-900">
        <MagnifyingGlassIcon className="h-5 w-5" />
      </button>
    </div>
  );
}

export default function Header({ search, setSearch }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Si el usuario escribe algo y no está en la página de artículos, lo redirige.
    if (search && location.pathname !== "/articles") {
      navigate("/articles");
    }

    // ¡NUEVA LÓGICA! Si el usuario NAVEGA FUERA de la página de artículos,
    // limpiamos la búsqueda para que no quede "atrapado".
    if (location.pathname !== "/articles") {
      setSearch("");
    }
  }, [search, location.pathname, navigate, setSearch]);

  return (
    <header className="bg-[#24398A] text-white p-4">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} alt="Logo" className="mr-3" width="50" height="50" />
          </Link>
          <h1 className="text-2xl font-bold">
            <Link to="/">Revista Explora Unison: Ingeniería y Futuro</Link>
          </h1>
        </div>
        <nav className="flex items-center space-x-4">
          <ul className="flex space-x-4">
            <li><Link className="hover:underline" to="/">Inicio</Link></li>
            <li><Link className="hover:underline" to="/articles">Artículos</Link></li>
            <li><Link className="hover:underline" to="/videos">Videos</Link></li>
            <li><Link className="hover:underline" to="/noticias">Noticias</Link></li>
          </ul>
          <SearchInput search={search} setSearch={setSearch} />
        </nav>
      </div>
    </header>
  );
}