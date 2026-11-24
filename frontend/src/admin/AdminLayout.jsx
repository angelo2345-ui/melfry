import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Car,
  CalendarCheck,
  Users,
  CreditCard,
  LogOut,
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/vehiculos", label: "Vehículos", icon: Car },
  { to: "/admin/reservas", label: "Reservas", icon: CalendarCheck },
  { to: "/admin/clientes", label: "Clientes", icon: Users },
  { to: "/admin/pagos", label: "Pagos", icon: CreditCard },
];

export const AdminLayout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const email = user?.email || "Administrador";
  const initial = email.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const today = new Date().toLocaleDateString("es-DO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen admin-grain text-foreground flex">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[17rem] bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 pt-7 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground font-display text-lg font-bold">
              M
            </div>
            <div>
              <p className="font-display text-lg font-semibold leading-none tracking-tight">Melfry</p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-sidebar-foreground/50 mt-1">Rent Car</p>
            </div>
          </div>
          <button className="lg:hidden text-sidebar-foreground/60" aria-label="Cerrar menú" onClick={() => setMobileOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <p className="px-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-sidebar-foreground/40 mb-2">Gestión</p>
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-accent !text-sidebar-accent-foreground before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:rounded-full before:bg-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-sidebar-border space-y-1">
          <a
            href="/"
            className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            Ver sitio público
            <ArrowUpRight size={16} />
          </a>
          <div className="flex items-center gap-3 px-3 py-3 mt-1 rounded-lg bg-sidebar-accent/60">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sidebar-primary/20 text-sidebar-primary text-sm font-semibold">
              {initial}
            </div>
            <p className="flex-1 min-w-0 truncate text-xs text-sidebar-foreground/80">{email}</p>
            <button
              onClick={handleSignOut}
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
              className="grid h-8 w-8 place-items-center rounded-md text-sidebar-foreground/60 hover:bg-destructive/20 hover:text-destructive transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <div className="flex-1 lg:ml-[17rem] flex flex-col min-h-screen min-w-0">
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-4 sm:px-8 h-16 flex items-center gap-4">
          <button className="lg:hidden text-foreground" aria-label="Abrir menú" onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>
          <p className="text-sm text-muted-foreground capitalize">{today}</p>
          <span className="ml-auto inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            En línea
          </span>
        </header>

        <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
