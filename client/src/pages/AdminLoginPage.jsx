// src/pages/AdminLoginPage.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        if (data.user && data.user.idusuario) {
          localStorage.setItem("idusuario", data.user.idusuario);
        }
        onLogin && onLogin(data.user);
        navigate("/admin");
      } else {
        setError(data.error || "Credenciales incorrectas");
      }
    } catch (err) {
      setError("Error de conexión");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Acceso de Administrador</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="username">Usuario</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={e => { setUsername(e.target.value); setError(""); }}
            className={`w-full px-3 py-2 border rounded-lg ${error ? 'border-red-500' : 'border-gray-300'}`}
            autoFocus
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(""); }}
            className={`w-full px-3 py-2 border rounded-lg ${error ? 'border-red-500' : 'border-gray-300'}`}
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg font-bold hover:bg-blue-600">
          Entrar
        </button>
      </form>
    </div>
  );
}