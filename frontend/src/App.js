import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./admin/ProtectedRoute";
import { AdminLayout } from "./admin/AdminLayout";
import { AdminLogin } from "./admin/AdminLogin";
import { Dashboard } from "./admin/Dashboard";
import { VehiclesAdmin } from "./admin/VehiclesAdmin";
import { ReservationsAdmin } from "./admin/ReservationsAdmin";
import { CustomersAdmin } from "./admin/CustomersAdmin";
import { PaymentsAdmin } from "./admin/PaymentsAdmin";
import { PublicSite } from "./pages/PublicSite";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Sitio público */}
          <Route path="/" element={<PublicSite />} />

          {/* Acceso al panel */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Panel de administración (protegido) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="vehiculos" element={<VehiclesAdmin />} />
            <Route path="reservas" element={<ReservationsAdmin />} />
            <Route path="clientes" element={<CustomersAdmin />} />
            <Route path="pagos" element={<PaymentsAdmin />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
