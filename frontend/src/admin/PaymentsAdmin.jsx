import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, CreditCard } from "lucide-react";
import { supabase } from "../lib/supabase";
import { formatCurrency, formatDate, todayISO } from "../lib/format";
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

const METHODS = ["efectivo", "transferencia", "tarjeta"];
const TYPES = ["abono", "total", "reembolso"];

const METHOD_COLORS = {
  efectivo: "green",
  transferencia: "blue",
  tarjeta: "orange",
};

const emptyForm = {
  reservation_id: "",
  amount: "",
  method: "efectivo",
  type: "abono",
  reference: "",
  payment_date: todayISO(),
  notes: "",
};

// signo del monto según el tipo de pago
const signedAmount = (p) => (p.type === "reembolso" ? -Number(p.amount || 0) : Number(p.amount || 0));

export const PaymentsAdmin = () => {
  const [payments, setPayments] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
      .from("payments")
      .select("*, reservations(total, status, customers(full_name), vehicles(brand, model))")
      .order("payment_date", { ascending: false });
    if (err) setError(err.message);
    else setPayments(data || []);
    setLoading(false);
  }, []);

  const loadReservations = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from("reservations")
      .select("id, total, status, customers(full_name), vehicles(brand, model)");
    setReservations(data || []);
  }, []);

  useEffect(() => {
    load();
    loadReservations();
  }, [load, loadReservations]);

  // Total pagado (neto de reembolsos) por reserva
  const paidByReservation = useMemo(() => {
    const map = {};
    payments.forEach((p) => {
      const id = p.reservation_id;
      if (!id) return;
      map[id] = (map[id] || 0) + signedAmount(p);
    });
    return map;
  }, [payments]);

  const totalCobrado = useMemo(() => payments.reduce((sum, p) => sum + signedAmount(p), 0), [payments]);

  const totalPendiente = useMemo(
    () =>
      reservations.reduce((sum, r) => {
        const paid = paidByReservation[r.id] || 0;
        return sum + Math.max(0, Number(r.total || 0) - paid);
      }, 0),
    [reservations, paidByReservation]
  );

  const reservationLabel = (r) => {
    const customer = r.customers?.full_name || "Sin cliente";
    const vehicle = r.vehicles ? `${r.vehicles.brand} ${r.vehicles.model}` : "Sin vehículo";
    return `${customer} — ${vehicle} (${formatCurrency(r.total)})`;
  };

  const pendingFor = (reservationId) => {
    const r = reservations.find((x) => x.id === reservationId);
    if (!r) return 0;
    return Math.max(0, Number(r.total || 0) - (paidByReservation[reservationId] || 0));
  };

  const setField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleReservationChange = (e) => {
    const id = e.target.value;
    setForm((f) => {
      const next = { ...f, reservation_id: id };
      if (!editing) {
        const pending = pendingFor(id);
        if (pending > 0) next.amount = String(pending);
      }
      return next;
    });
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      reservation_id: p.reservation_id || "",
      amount: p.amount ?? "",
      method: p.method || "efectivo",
      type: p.type || "abono",
      reference: p.reference || "",
      payment_date: p.payment_date || todayISO(),
      notes: p.notes || "",
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
      reservation_id: form.reservation_id || null,
      amount: Number(form.amount) || 0,
      method: form.method,
      type: form.type,
      reference: form.reference || null,
      payment_date: form.payment_date || todayISO(),
      notes: form.notes || null,
    };
    const query = editing
      ? supabase.from("payments").update(payload).eq("id", editing.id)
      : supabase.from("payments").insert(payload);
    const { error: err } = await query;
    if (err) {
      setError(err.message);
      setSaving(false);
      return;
    }
    setSaving(false);
    setModalOpen(false);
    load();
  };

  const handleDelete = async (p) => {
    if (!supabase) return;
    if (!window.confirm("¿Eliminar este pago?")) return;
    const { error: err } = await supabase.from("payments").delete().eq("id", p.id);
    if (err) setError(err.message);
    else load();
  };

  return (
    <div>
      <PageHeader
        title="Pagos"
        subtitle="Registra cobros y controla los saldos de las reservas"
        actions={
          <Button onClick={openCreate}>
            <Plus size={18} className="inline mr-2" />
            Nuevo pago
          </Button>
        }
      />

      <ErrorText>{error}</ErrorText>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Card className="p-0">
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total cobrado</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalCobrado)}</p>
            </div>
            <div className="p-3 rounded-xl bg-green-500/15 text-green-400">
              <CreditCard size={22} />
            </div>
          </div>
        </Card>
        <Card className="p-0">
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Pendiente por cobrar</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalPendiente)}</p>
            </div>
            <div className="p-3 rounded-xl bg-orange-500/15 text-orange-400">
              <CreditCard size={22} />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-0">
        {loading ? (
          <Spinner />
        ) : payments.length === 0 ? (
          <EmptyState
            message="No hay pagos registrados."
            action={
              <Button onClick={openCreate}>
                <Plus size={18} className="inline mr-2" />
                Nuevo pago
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-400 border-b border-gray-800">
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium">Cliente / Vehículo</th>
                  <th className="px-4 py-3 font-medium">Monto</th>
                  <th className="px-4 py-3 font-medium">Método</th>
                  <th className="px-4 py-3 font-medium">Tipo</th>
                  <th className="px-4 py-3 font-medium">Referencia</th>
                  <th className="px-4 py-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-gray-800/60 hover:bg-gray-800/30">
                    <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{formatDate(p.payment_date)}</td>
                    <td className="px-4 py-3">
                      <div className="text-white">{p.reservations?.customers?.full_name || "—"}</div>
                      <div className="text-xs text-gray-500">
                        {p.reservations?.vehicles
                          ? `${p.reservations.vehicles.brand} ${p.reservations.vehicles.model}`
                          : ""}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white font-medium">{formatCurrency(p.amount)}</td>
                    <td className="px-4 py-3">
                      {p.method ? <Badge color={METHOD_COLORS[p.method] || "gray"}>{p.method}</Badge> : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-300 capitalize">{p.type || "—"}</td>
                    <td className="px-4 py-3 text-gray-400">{p.reference || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
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
        title={editing ? "Editar pago" : "Nuevo pago"}
        size="max-w-xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" form="payment-form" disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </>
        }
      >
        <ErrorText>{error}</ErrorText>
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
          <Select label="Reserva" required value={form.reservation_id} onChange={handleReservationChange}>
            <option value="">Seleccionar reserva...</option>
            {reservations.map((r) => (
              <option key={r.id} value={r.id}>
                {reservationLabel(r)}
              </option>
            ))}
          </Select>

          {form.reservation_id && (
            <p className="text-xs text-gray-400">
              Saldo pendiente: <span className="text-orange-400">{formatCurrency(pendingFor(form.reservation_id))}</span>
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Monto"
              type="number"
              min="0"
              step="0.01"
              required
              value={form.amount}
              onChange={setField("amount")}
            />
            <Input
              label="Fecha"
              type="date"
              required
              value={form.payment_date}
              onChange={setField("payment_date")}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select label="Método" value={form.method} onChange={setField("method")}>
              {METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Select>
            <Select label="Tipo" value={form.type} onChange={setField("type")}>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
            <Input
              label="Referencia"
              value={form.reference}
              onChange={setField("reference")}
              placeholder="Ej: #1234"
            />
          </div>

          <Textarea label="Notas" rows="3" value={form.notes} onChange={setField("notes")} />
        </form>
      </Modal>
    </div>
  );
};
