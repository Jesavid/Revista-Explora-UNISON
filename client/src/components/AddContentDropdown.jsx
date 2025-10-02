import { useState, useRef, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import AddContentModal from "./AddContentModal";

export default function AddContentDropdown({ addArticle, addVideo, addNews }) {
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleOptionClick = (type) => {
    setModalType(type);
    setOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        <PlusIcon className="w-5 h-5" />
        Agregar contenido
      </button>

      {open && (
        <div className="absolute mt-2 w-48 bg-white border rounded shadow-lg z-10">
          {["Artículo", "Video", "Noticia"].map((type) => (
            <button
              key={type}
              onClick={() => handleOptionClick(type)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              {type}
            </button>
          ))}
        </div>
      )}

      {modalType && (
        <AddContentModal
          type={modalType}
          onClose={() => setModalType(null)}
          addArticle={addArticle}
          addVideo={addVideo}
          addNews={addNews}
        />
      )}
    </div>
  );
}
