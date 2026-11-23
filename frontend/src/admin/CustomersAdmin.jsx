import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, Users } from "lucide-react";
import { supabase } from "../lib/supabase";
import { formatDate, todayISO } from "../lib/format";
import {
  Card,
  PageHeader,
  Button,
  Badge,
  Modal,
  Input,
  Textarea,
  EmptyState,
  Spinner,
  ErrorText,
} from "./components/AdminUI";

// Formulario vacío reutilizable (todos los campos de la tabla customers)
const emptyForm = {
  full_name: "",
  document_id: "",
  phone: "",
  email: "",
  address: "",
  license_number: "",
  license_expiry: "",
  notes: "",
};

// Convierte cadenas vacías en null para enviar a Supabase
const emptyToNull = (value) => {
  const trimmed = (value || "").trim();
  return trimmed ? trimmed : null;
};

// Elimina todo lo que no sea dígito (para el enlace de WhatsApp)
const digitsOnly = (value) => (value || "").toString().replace(/\D/g, "");

export const CustomersAdmin = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadCustomers = async () => {
    if (!supabase) {
      setError("La base de datos aún no está configurada.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const { data, error: queryError } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (queryError) setError(queryError.message);
    else setCustomers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (customer) => {
    setEditing(customer);
    setForm({
      full_name: customer.full_name || "",
      document_id: customer.document_id || "",
      phone: customer.phone || "",
      email: customer.email || "",
      address: customer.address || "",
      license_number: customer.license_number || "",
      license_expiry: customer.license_expiry || "",
      notes: customer.notes || "",
    });
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setForm(emptyForm);
    setFormError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setFormError("");

    const fullName = form.full_name.trim();
    if (!fullName) {
      setFormError("El nombre completo es obligatorio.");
      return;
    }

    const payload = {
      full_name: fullName,
      document_id: emptyToNull(form.document_id),
      phone: emptyToNull(form.phone),
      email: emptyToNull(form.email),
      address: emptyToNull(form.address),
      license_number: emptyToNull(form.license_number),
      license_expiry: form.license_expiry ? form.license_expiry : null,
      notes: emptyToNull(form.notes),
    };

    setSaving(true);

    const { error: saveError } = editing
      ? await supabase.from("customers").update(payload).eq("id", editing.id)
      : await supabase.from("customers").insert([payload]);

    if (saveError) {
      setFormError(saveError.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    closeModal();
    loadCustomers();
  };

  const handleDelete = async (customer) => {
    if (!window.confirm(`¿Eliminar a "${customer.full_name}"? Esta acción no se puede deshacer.`))
      return;

    const { error: deleteError } = await supabase
      .from("customers")
      .delete()
      .eq("id", customer.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    loadCustomers();
  };

  const term = search.trim().toLowerCase();
  const filtered = term
    ? customers.filter((c) =>
        [c.full_name, c.document_id, c.phone, c.email]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(term))
      )
    : customers;

  const renderLicense = (expiry) => {
    if (!expiry) return <span className="text-gray-500">—</span>;
    const expired = expiry < todayISO();
    return (
      <div className="flex items-center gap-2">
        <span className="text-gray-300 whitespace-nowrap">{formatDate(expiry)}</span>
        <Badge color={expired ? "red" : "green"}>{expired ? "Vencida" : "Vigente"}</Badge>
      </div>
    );
  };

  return (
    <div>
      <PageHeader
        title="Clientes"
        subtitle="Administra la información de tus clientes"
        actions={
          <Button onClick={openCreate}>
            <span className="flex items-center gap-2">
              <Plus size={18} />
              Nuevo cliente
            </span>
          </Button>
        }
      />

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, cédula, teléfono o email…"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-500"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Users size={16} />
            <span>
              {filtered.length} {filtered.length === 1 ? "cliente" : "clientes"}
            </span>
          </div>
        </div>

        <ErrorText>{error}</ErrorText>

        {loading ? (
          <Spinner label="Cargando clientes..." />
        ) : customers.length === 0 ? (
          <EmptyState
            message="Aún no tienes clientes registrados."
            action={<Button onClick={openCreate}>Agregar el primero</Button>}
          />
        ) : filtered.length === 0 ? (
          <EmptyState message="No se encontraron clientes con ese criterio." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-gray-800">
                  <th className="py-3 pr-4 font-medium">Nombre</th>
                  <th className="py-3 pr-4 font-medium">Cédula</th>
                  <th className="py-3 pr-4 font-medium">Teléfono</th>
                  <th className="py-3 pr-4 font-medium">Email</th>
                  <th className="py-3 pr-4 font-medium">Licencia</th>
                  <th className="py-3 pr-4 font-medium">Vencimiento</th>
                  <th className="py-3 pr-4 font-medium">Notas</th>
                  <th className="py-3 pl-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filtered.map((customer) => {
                  const phoneDigits = digitsOnly(customer.phone);
                  return (
                    <tr key={customer.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3 pr-4 text-white font-medium whitespace-nowrap">
                        {customer.full_name}
                      </td>
                      <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                        {customer.document_id || "—"}
                      </td>
                      <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                        {customer.phone ? (
                          <a
                            href={`https://wa.me/${phoneDigits}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-400 hover:text-orange-500 transition-colors"
                            title="Abrir en WhatsApp"
                          >
                            {customer.phone}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-3 pr-4 text-gray-300">
                        {customer.email ? (
                          <a
                            href={`mailto:${customer.email}`}
                            className="hover:text-white transition-colors"
                          >
                            {customer.email}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                        {customer.license_number || "—"}
                      </td>
                      <td className="py-3 pr-4">{renderLicense(customer.license_expiry)}</td>
                      <td className="py-3 pr-4 text-gray-400">
                        {customer.notes ? (
                          <span
                            className="inline-block max-w-[12rem] truncate align-bottom"
                            title={customer.notes}
                          >
                            {customer.notes}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-3 pl-4">
                        <div className="flex items-center justify-end gap-2">
                          {phoneDigits && (
                            <a
                              href={`https://wa.me/${phoneDigits}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 rounded-lg text-xs font-medium text-green-400 border border-green-500/30 hover:bg-green-500/10 transition-colors"
                              title="Llamar por WhatsApp"
                            >
                              WhatsApp
                            </a>
                          )}
                          <Button
                            variant="ghost"
                            onClick={() => openEdit(customer)}
                            title="Editar"
                            className="!px-2 !py-1"
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => handleDelete(customer)}
                            title="Eliminar"
                            className="!px-2 !py-1 text-red-400 hover:text-red-500 hover:bg-red-500/10"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? "Editar cliente" : "Nuevo cliente"}
        size="max-w-2xl"
        footer={
          <>
            <Button variant="secondary" onClick={closeModal} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" form="customer-form" disabled={saving}>
              {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear cliente"}
            </Button>
          </>
        }
      >
        <ErrorText>{formError}</ErrorText>

        <form id="customer-form" onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nombre completo"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Juan Pérez"
            required
            className="sm:col-span-2"
          />
          <Input
            label="Cédula"
            name="document_id"
            value={form.document_id}
            onChange={handleChange}
            placeholder="001-0000000-0"
          />
          <Input
            label="Teléfono"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="809-000-0000"
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="cliente@correo.com"
          />
          <Input
            label="Número de licencia"
            name="license_number"
            value={form.license_number}
            onChange={handleChange}
            placeholder="LIC-000000"
          />
          <Input
            label="Vencimiento de licencia"
            name="license_expiry"
            type="date"
            value={form.license_expiry}
            onChange={handleChange}
          />
          <Input
            label="Dirección"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Calle, número, ciudad"
            className="sm:col-span-2"
          />
          <Textarea
            label="Notas"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Información adicional del cliente…"
            className="sm:col-span-2"
          />
        </form>
      </Modal>
    </div>
  );
};
