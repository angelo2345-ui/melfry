import React, { useEffect, useMemo, useState } from "react";
import {
  Car,
  Users,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { supabase } from "../lib/supabase";
import { formatCurrency, formatDate } from "../lib/format";
import { Card, PageHeader, Badge, Spinner, ErrorText, EmptyState } from "./components/AdminUI";

const STATUS_COLORS = {
  pendiente: "orange",
  confirmada: "blue",
  activa: "green",
  finalizada: "gray",
  cancelada: "red",
};

const STATUS_LABELS = {
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  activa: "Activa",
  finalizada: "Finalizada",
  cancelada: "Cancelada",
};

const MetricCard = ({ icon: Icon, label, value, hint }) => (
  <Card>
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-white mt-2">{value}</p>
        {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
      </div>
      <div className="p-3 rounded-xl bg-orange-500/15 text-orange-500 shrink-0">
        <Icon size={22} />
      </div>
    </div>
  </Card>
);

const monthKey = (iso) => (iso ? String(iso).slice(0, 7) : "");

const monthLabel = (date) =>
  date.toLocaleDateString("es-DO", { month: "short", year: "2-digit" });

const buildMonthlyData = (payments) => {
  const now = new Date();
  const buckets = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: monthLabel(d),
      total: 0,
    });
  }
  const index = Object.fromEntries(buckets.map((b) => [b.key, b]));
  payments.forEach((p) => {
    if (p.type === "reembolso") return;
    const bucket = index[monthKey(p.payment_date)];
    if (bucket) bucket.total += Number(p.amount) || 0;
  });
  return buckets;
};

export const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [reservations, setReservations] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!supabase) {
        setError("Supabase no está configurado.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError("");
        const [vehiclesRes, customersRes, reservationsRes, paymentsRes] = await Promise.all([
          supabase.from("vehicles").select("*"),
          supabase.from("customers").select("id", { count: "exact", head: true }),
          supabase
            .from("reservations")
            .select("*, vehicles(brand, model), customers(full_name)"),
          supabase.from("payments").select("*"),
        ]);

        const failed = [vehiclesRes, customersRes, reservationsRes, paymentsRes].find(
          (r) => r.error
        );
        if (failed) throw new Error(failed.error.message);
        if (!active) return;

        setVehicles(vehiclesRes.data || []);
        setCustomerCount(customersRes.count || 0);
        setReservations(reservationsRes.data || []);
        setPayments(paymentsRes.data || []);
      } catch (e) {
        if (active) setError(e.message || "Error al cargar los datos.");
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  const byStatus = useMemo(() => {
    const counts = { disponible: 0, rentado: 0, mantenimiento: 0 };
    vehicles.forEach((v) => {
      if (counts[v.status] !== undefined) counts[v.status] += 1;
    });
    return counts;
  }, [vehicles]);

  const today = new Date().toISOString().slice(0, 10);

  const activeOrUpcoming = reservations.filter(
    (r) => r.status === "activa" || (r.status === "confirmada" && r.start_date >= today)
  ).length;

  const collected = payments.reduce((sum, p) => {
    const amount = Number(p.amount) || 0;
    return p.type === "reembolso" ? sum - amount : sum + amount;
  }, 0);

  const pendingBalance = useMemo(() => {
    const paidByReservation = {};
    payments.forEach((p) => {
      const amount = Number(p.amount) || 0;
      paidByReservation[p.reservation_id] =
        (paidByReservation[p.reservation_id] || 0) +
        (p.type === "reembolso" ? -amount : amount);
    });
    return reservations
      .filter((r) => r.status !== "cancelada")
      .reduce((sum, r) => {
        const paid = paidByReservation[r.id] || 0;
        return sum + Math.max(0, (Number(r.total) || 0) - paid);
      }, 0);
  }, [reservations, payments]);

  const recentReservations = useMemo(
    () =>
      [...reservations]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 8),
    [reservations]
  );

  const monthlyData = useMemo(() => buildMonthlyData(payments), [payments]);

  if (loading) {
    return (
      <div>
        <PageHeader title="Dashboard" subtitle="Resumen general de Melfry Rent Car" />
        <Card>
          <Spinner label="Cargando panel..." />
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Resumen general de Melfry Rent Car" />

      <ErrorText>{error}</ErrorText>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <MetricCard
          icon={Car}
          label="Vehículos en la flota"
          value={vehicles.length}
          hint={`${byStatus.disponible} disponibles · ${byStatus.rentado} rentados · ${byStatus.mantenimiento} mantenimiento`}
        />
        <MetricCard
          icon={Users}
          label="Clientes registrados"
          value={customerCount}
          hint="Total de clientes"
        />
        <MetricCard
          icon={CalendarCheck}
          label="Reservas activas / próximas"
          value={activeOrUpcoming}
          hint="Activas y confirmadas por venir"
        />
        <MetricCard
          icon={DollarSign}
          label="Ingresos cobrados"
          value={formatCurrency(collected)}
          hint="Pagos netos (restando reembolsos)"
        />
        <MetricCard
          icon={Wallet}
          label="Saldo pendiente por cobrar"
          value={formatCurrency(pendingBalance)}
          hint="Reservas no canceladas"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Reservas recientes">
          {recentReservations.length === 0 ? (
            <EmptyState message="Aún no hay reservas registradas." />
          ) : (
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-800">
                    <th className="px-2 py-2 font-medium">Cliente</th>
                    <th className="px-2 py-2 font-medium">Vehículo</th>
                    <th className="px-2 py-2 font-medium">Fechas</th>
                    <th className="px-2 py-2 font-medium text-right">Total</th>
                    <th className="px-2 py-2 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReservations.map((r) => (
                    <tr key={r.id} className="border-b border-gray-800/60 last:border-0">
                      <td className="px-2 py-3 text-white whitespace-nowrap">
                        {r.customers?.full_name || "—"}
                      </td>
                      <td className="px-2 py-3 text-gray-300 whitespace-nowrap">
                        {r.vehicles
                          ? `${r.vehicles.brand} ${r.vehicles.model}`
                          : "—"}
                      </td>
                      <td className="px-2 py-3 text-gray-400 whitespace-nowrap">
                        {formatDate(r.start_date)} → {formatDate(r.end_date)}
                      </td>
                      <td className="px-2 py-3 text-white text-right whitespace-nowrap">
                        {formatCurrency(r.total)}
                      </td>
                      <td className="px-2 py-3">
                        <Badge color={STATUS_COLORS[r.status] || "gray"}>
                          {STATUS_LABELS[r.status] || r.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card title="Ingresos por mes">
          {payments.length === 0 ? (
            <EmptyState message="Aún no hay pagos registrados." />
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="label" stroke="#9ca3af" tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} width={70} />
                  <Tooltip
                    cursor={{ fill: "rgba(249,115,22,0.08)" }}
                    contentStyle={{
                      background: "#111827",
                      border: "1px solid #1f2937",
                      borderRadius: "0.75rem",
                      color: "#fff",
                    }}
                    labelStyle={{ color: "#9ca3af" }}
                    formatter={(value) => [formatCurrency(value), "Ingresos"]}
                  />
                  <Bar dataKey="total" fill="#f97316" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
