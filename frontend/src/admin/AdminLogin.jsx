import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button, Input, ErrorText } from "./components/AdminUI";

export const AdminLogin = () => {
  const { signIn } = useAuth();
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
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between bg-sidebar text-sidebar-foreground p-12 relative overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-sidebar-primary/20 blur-3xl" />
        <div className="flex items-center gap-3 relative">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground font-display text-lg font-bold">M</div>
          <p className="font-display text-lg font-semibold tracking-tight">Melfry Rent Car</p>
        </div>
        <div className="relative">
          <p className="font-display text-5xl font-semibold leading-[1.05] tracking-tight">
            Tu flota,<br />reservas y pagos<br /><span className="text-sidebar-primary">en un solo lugar.</span>
          </p>
          <p className="mt-6 max-w-sm text-sidebar-foreground/60">Panel de administración para gestionar el día a día del negocio.</p>
        </div>
        <p className="text-xs text-sidebar-foreground/40 relative">© {new Date().getFullYear()} Melfry Rent Car</p>
      </div>

      <div className="flex items-center justify-center p-6 admin-grain">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="mb-8">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary mb-5">
              <Lock size={20} />
            </div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">Bienvenido de vuelta</h1>
            <p className="text-muted-foreground mt-2">Ingresa para acceder al panel.</p>
          </div>

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

          <p className="text-center text-muted-foreground text-sm mt-8">
            <a href="/" className="hover:text-primary transition-colors">← Volver al sitio</a>
          </p>
        </div>
      </div>
    </div>
  );
};
