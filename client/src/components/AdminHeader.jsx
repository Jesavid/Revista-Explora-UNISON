// src/components/AdminHeader.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo_white_nobg.png';

export default function AdminHeader({ onLogout }) {
  return (
    <header className="bg-[#24398A] text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo de Explora Unison" className="h-12 w-12" />
          <h1 className="text-xl font-bold">Panel de Administrador</h1>
        </div>
        <nav className="flex items-center space-x-6">
          <a href="/" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">
            Ver Sitio
          </a>
          <button
            onClick={onLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors"
          >
            Cerrar Sesión
          </button>
        </nav>
      </div>
    </header>
  );
}