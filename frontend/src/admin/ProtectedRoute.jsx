import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Bloquea el acceso al panel si no hay sesión activa
export const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) navigate("/admin/login", { replace: true });
  }, [loading, session, navigate]);

  if (loading || !session) {
    return (
      <div className="min-h-screen admin-grain text-muted-foreground flex items-center justify-center text-sm">
        Cargando...
      </div>
    );
  }
  return children;
};
