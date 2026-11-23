import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { supabase } from "../lib/supabase";
import { formatCurrency, formatDate } from "../lib/format";
import {
  Card,
  PageHeader,
  Button,
  Badge,
  Modal,
  Input,
  Select,
  Textarea,
  EmptyState,
  Spinner,
  ErrorText,
} from "./components/AdminUI";

const STATUSES = ["pendiente", "confirmada", "activa", "finalizada", "cancelada"];

const STATUS_COLORS = {
  pendiente: "orange",
  confirmada: "blue",
  activa: "green",
  finalizada: "gray",
  cancelada: "red",
};

const emptyForm = {
  vehicle_id: "",
  customer_id: "",
  start_date: "",
  end_date: "",
  daily_rate: "",
  status: "pendiente",
  pickup_location: "",
  return_location: "",
  notes: "",
};

// Diferencia en días (end_date - start_date), nunca negativa
const calcDays = (start, end) => {
  if (!start || !end) return 0;
  const s = new Date(`${start}T00:00:00`);
  const e = new Date(`${end}T00:00:00`);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return 0;
  return Math.max(0, Math.round((e - s) / 86400000));
};

export const ReservationsAdmin = () => {
  const [reservations, setReservations] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!supabase) {
      setError("Supabase no está configurado.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    const { data, error: err } = await supabase
      .from("reservations")
      .select("*, vehicles(brand, model, plate), customers(full_name, phone)")
      .order("created_at", { ascending: false });
    if (err) setError(err.message);
    else setReservations(data || []);
    setLoading(false);
  }, []);

  const loadOptions = useCallback(async () => {
    if (!supabase) return;
    const [{ data: v }, { data: c }] = await Promise.all([
      supabase.from("vehicles").select("id, brand, model, plate, daily_rate, status"),
      supabase.from("customers").select("id, full_name"),
    ]);
    setVehicles(v || []);
    setCustomers(c || []);
  }, []);

  useEffect(() => {
    load();
    loadOptions();
  }, [load, loadOptions]);

  const days = useMemo(() => calcDays(form.start_date, form.end_date), [form.start_date, form.end_date]);
  const total = useMemo(() => days * (Number(form.daily_rate) || 0), [days, form.daily_rate]);

  const setField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleVehicleChange = (e) => {
    const id = e.target.value;
    const v = vehicles.find((x) => x.id === id);
    setForm((f) => ({ ...f, vehicle_id: id, daily_rate: v ? v.daily_rate ?? "" : f.daily_rate }));
  };

  // Best-effort: sincroniza el estado del vehículo según la reserva
  const syncVehicleStatus = async (vehicleId, status) => {
    if (!vehicleId || !supabase) return;
    try {
      if (status === "confirmada" || status === "activa") {
        await supabase.from("vehicles").update({ status: "rentado" }).eq("id", vehicleId);
      } else if (status === "finalizada" || status === "cancelada") {
        await supabase.from("vehicles").update({ status: "disponible" }).eq("id", vehicleId);
      }
    } catch (e) {
      // no bloquea el flujo principal
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (r) => {
    setEditing(r);
    setForm({
      vehicle_id: r.vehicle_id || "",
      customer_id: r.customer_id || "",
      start_date: r.start_date || "",
      end_date: r.end_date || "",
      daily_rate: r.daily_rate ?? "",
      status: r.status || "pendiente",
      pickup_location: r.pickup_location || "",
      return_location: r.return_location || "",
      notes: r.notes || "",
    });
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    setError("");
    const payload = {
      vehicle_id: form.vehicle_id || null,
      customer_id: form.customer_id || null,
      start_date: form.start_date,
      end_date: form.end_date,
      daily_rate: Number(form.daily_rate) || 0,
      total,
      status: form.status,
      pickup_location: form.pickup_location || null,
      return_location: form.return_location || null,
      notes: form.notes || null,
    };
    const query = editing
      ? supabase.from("reservations").update(payload).eq("id", editing.id)
      : supabase.from("reservations").insert(payload);
    const { error: err } = await query;
    if (err) {
      setError(err.message);
      setSaving(false);
      return;
    }
    await syncVehicleStatus(payload.vehicle_id, payload.status);
    setSaving(false);
    setModalOpen(false);
    load();
  };

  const handleDelete = async (r) => {
    if (!supabase) return;
    if (!window.confirm("¿Eliminar esta reserva?")) return;
    const { error: err } = await supabase.from("reservations").delete().eq("id", r.id);
    if (err) setError(err.message);
    else load();
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return reservations.filter((r) => {
      if (statusFilter && r.status !== statusFilter) return false;
      if (!term) return true;
      const name = (r.customers?.full_name || "").toLowerCase();
      const veh = `${r.vehicles?.brand || ""} ${r.vehicles?.model || ""} ${r.vehicles?.plate || ""}`.toLowerCase();
      return name.includes(term) || veh.includes(term);
    });
  }, [reservations, search, statusFilter]);

  return (
    <div>
      <PageHeader
        title="Reservas"
        subtitle="Gestiona las reservas de vehículos"
        actions={
          <Button onClick={openCreate}>
            <Plus size={18} className="inline mr-2" />
            Nueva reserva
          </Button>
        }
      />

      <ErrorText>{error}</ErrorText>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por cliente o vehículo..."
            className="w-full bg-gray-900 border border-gray-800 text-white rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:border-orange-500 placeholder-gray-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-900 border border-gray-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
        >
          <option value="">Todos los estados</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <Card className="p-0">
        {loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <EmptyState
            message="No hay reservas registradas."
            action={
              <Button onClick={openCreate}>
                <Plus size={18} className="inline mr-2" />
                Nueva reserva
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-400 border-b border-gray-800">
                  <th className="px-4 py-3 font-medium">Vehículo</th>
                  <th className="px-4 py-3 font-medium">Cliente</th>
                  <th className="px-4 py-3 font-medium">Fechas</th>
                  <th className="px-4 py-3 font-medium">Días</th>
                  <th className="px-4 py-3 font-medium">Tarifa</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-gray-800/60 hover:bg-gray-800/30">
                    <td className="px-4 py-3">
                      <div className="text-white">
                        {r.vehicles ? `${r.vehicles.brand} ${r.vehicles.model}` : "—"}
                      </div>
                      <div className="text-xs text-gray-500">{r.vehicles?.plate || ""}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-white">{r.customers?.full_name || "—"}</div>
                      <div className="text-xs text-gray-500">{r.customers?.phone || ""}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                      {formatDate(r.start_date)} – {formatDate(r.end_date)}
                    </td>
                    <td className="px-4 py-3 text-gray-300">{r.days}</td>
                    <td className="px-4 py-3 text-gray-300">{formatCurrency(r.daily_rate)}</td>
                    <td className="px-4 py-3 text-white font-medium">{formatCurrency(r.total)}</td>
                    <td className="px-4 py-3">
                      <Badge color={STATUS_COLORS[r.status] || "gray"}>{r.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(r)}
                          className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(r)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Editar reserva" : "Nueva reserva"}
        size="max-w-2xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" form="reservation-form" disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </>
        }
      >
        <ErrorText>{error}</ErrorText>
        <form id="reservation-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Vehículo" required value={form.vehicle_id} onChange={handleVehicleChange}>
              <option value="">Seleccionar vehículo...</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.brand} {v.model} · {v.plate}
                </option>
              ))}
            </Select>
            <Select label="Cliente" required value={form.customer_id} onChange={setField("customer_id")}>
              <option value="">Seleccionar cliente...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Fecha de entrega"
              type="date"
              required
              value={form.start_date}
              onChange={setField("start_date")}
            />
            <Input
              label="Fecha de devolución"
              type="date"
              required
              value={form.end_date}
              onChange={setField("end_date")}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Tarifa diaria"
              type="number"
              min="0"
              step="0.01"
              required
              value={form.daily_rate}
              onChange={setField("daily_rate")}
            />
            <Input label="Días" value={days} disabled readOnly />
            <Input label="Total" value={formatCurrency(total)} disabled readOnly />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select label="Estado" value={form.status} onChange={setField("status")}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
            <Input
              label="Lugar de entrega"
              value={form.pickup_location}
              onChange={setField("pickup_location")}
              placeholder="Ej: Aeropuerto"
            />
            <Input
              label="Lugar de devolución"
              value={form.return_location}
              onChange={setField("return_location")}
              placeholder="Ej: Oficina central"
            />
          </div>

          <Textarea label="Notas" rows="3" value={form.notes} onChange={setField("notes")} />
        </form>
      </Modal>
    </div>
  );
};
