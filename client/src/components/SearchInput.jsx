import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

export default function SearchInput({ search, setSearch }) {
  return (
    <div className="relative">
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