import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button, Input, ErrorText } from "./components/AdminUI";

export const AdminLogin = () => {
  const { signIn, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await signIn(email.trim(), password);

    if (signInError) {
      setError(
        signInError.message === "Invalid login credentials"
          ? "Correo o contraseña incorrectos."
          : signInError.message
      );
      setLoading(false);
      return;
    }

    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            <span className="text-orange-500">MELFRY</span> RENT CAR
          </h1>
          <p className="text-gray-400 mt-2">Acceso al panel de administración</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-500/15 p-3 rounded-full">
              <Lock className="text-orange-500" size={20} />
            </div>
            <h2 className="text-xl font-semibold text-white">Iniciar sesión</h2>
          </div>

          {!isSupabaseConfigured && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-sm rounded-lg p-3 mb-4">
              Faltan las credenciales de Supabase. Completa
              <code className="mx-1">REACT_APP_SUPABASE_URL</code> y
              <code className="mx-1">REACT_APP_SUPABASE_ANON_KEY</code> en el archivo .env
            </div>
          )}

          <ErrorText>{error}</ErrorText>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@melfry.com"
              required
              autoComplete="email"
            />
            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          <a href="/" className="hover:text-orange-500 transition-colors">
            ← Volver al sitio
          </a>
        </p>
      </div>
    </div>
  );
};
