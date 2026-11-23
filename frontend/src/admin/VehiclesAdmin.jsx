import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Car } from "lucide-react";
import { supabase } from "../lib/supabase";
import { formatCurrency } from "../lib/format";
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

const CATEGORIES = ["Sedán", "SUV", "Compacto", "Eléctrico", "Deportivo", "Camioneta"];
const TRANSMISSIONS = ["Automática", "Manual"];
const FUELS = ["Gasolina", "Diésel", "Eléctrico", "Híbrido"];
const STATUSES = ["disponible", "rentado", "mantenimiento"];

const statusColor = {
  disponible: "green",
  rentado: "orange",
  mantenimiento: "red",
};

const statusLabel = {
  disponible: "Disponible",
  rentado: "Rentado",
  mantenimiento: "Mantenimiento",
};

const emptyForm = {
  brand: "",
  model: "",
  year: "",
  category: "Sedán",
  transmission: "Automática",
  fuel: "Gasolina",
  seats: 5,
  plate: "",
  daily_rate: "",
  weekly_rate: "",
  deposit: "",
  status: "disponible",
  image_url: "",
  specs: "",
  featured: false,
};

// Convierte un valor vacío en null; si no, en número. Con valor por defecto opcional.
const toNumber = (value, fallback = null) => {
  if (value === "" || value === null || value === undefined) return fallback;
  const num = Number(value);
  return Number.isNaN(num) ? fallback : num;
};

export const VehiclesAdmin = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const loadVehicles = async () => {
    setLoading(true);
    setError("");

    if (!supabase) {
      setError("Supabase no está configurado. Revisa las variables de entorno.");
      setLoading(false);
      return;
    }

    const { data, error: fetchError } = await supabase
      .from("vehicles")
      .select("*")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setVehicles([]);
    } else {
      setVehicles(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (vehicle) => {
    setEditingId(vehicle.id);
    setForm({
      brand: vehicle.brand || "",
      model: vehicle.model || "",
      year: vehicle.year ?? "",
      category: vehicle.category || "Sedán",
      transmission: vehicle.transmission || "Automática",
      fuel: vehicle.fuel || "Gasolina",
      seats: vehicle.seats ?? 5,
      plate: vehicle.plate || "",
      daily_rate: vehicle.daily_rate ?? "",
      weekly_rate: vehicle.weekly_rate ?? "",
      deposit: vehicle.deposit ?? "",
      status: vehicle.status || "disponible",
      image_url: vehicle.image_url || "",
      specs: Array.isArray(vehicle.specs) ? vehicle.specs.join(", ") : vehicle.specs || "",
      featured: Boolean(vehicle.featured),
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleChange = (field) => (e) => {
    const value = field === "featured" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    const payload = {
      brand: form.brand.trim(),
      model: form.model.trim(),
      year: toNumber(form.year),
      category: form.category,
      transmission: form.transmission,
      fuel: form.fuel,
      seats: toNumber(form.seats, 5),
      plate: form.plate.trim() || null,
      daily_rate: toNumber(form.daily_rate, 0),
      weekly_rate: toNumber(form.weekly_rate),
      deposit: toNumber(form.deposit),
      status: form.status,
      image_url: form.image_url.trim() || null,
      specs: form.specs
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      featured: form.featured,
    };

    const { error: saveError } = editingId
      ? await supabase.from("vehicles").update(payload).eq("id", editingId)
      : await supabase.from("vehicles").insert([payload]);

    if (saveError) {
      setFormError(saveError.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    setModalOpen(false);
    loadVehicles();
  };

  const handleDelete = async (vehicle) => {
    const confirmed = window.confirm(
      `¿Eliminar el vehículo ${vehicle.brand} ${vehicle.model}? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    const { error: deleteError } = await supabase.from("vehicles").delete().eq("id", vehicle.id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    loadVehicles();
  };

  const filtered = vehicles.filter((v) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return [v.brand, v.model, v.plate, v.category]
      .filter(Boolean)
      .some((field) => String(field).toLowerCase().includes(term));
  });

  return (
    <div>
      <PageHeader
        title="Vehículos"
        subtitle="Administra la flota disponible para renta"
        actions={
          <Button onClick={openCreate}>
            <span className="inline-flex items-center gap-2">
              <Plus size={18} /> Nuevo vehículo
            </span>
          </Button>
        }
      />

      <Card>
        <div className="mb-6 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por marca, modelo, matrícula o categoría..."
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-500"
          />
        </div>

        {loading ? (
          <Spinner />
        ) : error ? (
          <ErrorText>{error}</ErrorText>
        ) : vehicles.length === 0 ? (
          <EmptyState
            message="Aún no hay vehículos registrados."
            action={
              <Button onClick={openCreate}>
                <span className="inline-flex items-center gap-2">
                  <Plus size={18} /> Agregar el primero
                </span>
              </Button>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState message="No se encontraron vehículos con ese criterio de búsqueda." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-800">
                  <th className="py-3 px-3 font-medium">Foto</th>
                  <th className="py-3 px-3 font-medium">Vehículo</th>
                  <th className="py-3 px-3 font-medium">Año</th>
                  <th className="py-3 px-3 font-medium">Categoría</th>
                  <th className="py-3 px-3 font-medium">Transmisión</th>
                  <th className="py-3 px-3 font-medium">Tarifa diaria</th>
                  <th className="py-3 px-3 font-medium">Estado</th>
                  <th className="py-3 px-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => (
                  <tr
                    key={v.id}
                    className="border-b border-gray-800 last:border-0 hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="py-3 px-3">
                      {v.image_url ? (
                        <img
                          src={v.image_url}
                          alt={`${v.brand} ${v.model}`}
                          className="w-14 h-10 object-cover rounded-lg border border-gray-800"
                        />
                      ) : (
                        <div className="w-14 h-10 rounded-lg border border-gray-800 bg-gray-800 flex items-center justify-center text-gray-500">
                          <Car size={18} />
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-white font-medium">
                        {v.brand} {v.model}
                      </div>
                      {v.plate && <div className="text-gray-500 text-xs">{v.plate}</div>}
                    </td>
                    <td className="py-3 px-3 text-gray-300">{v.year ?? "—"}</td>
                    <td className="py-3 px-3 text-gray-300">
                      {v.category ? <Badge color="blue">{v.category}</Badge> : "—"}
                    </td>
                    <td className="py-3 px-3 text-gray-300">{v.transmission || "—"}</td>
                    <td className="py-3 px-3 text-orange-400 font-medium">
                      {formatCurrency(v.daily_rate)}
                    </td>
                    <td className="py-3 px-3">
                      <Badge color={statusColor[v.status] || "gray"}>
                        {statusLabel[v.status] || v.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(v)}
                          className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(v)}
                          className="p-2 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-500/15 transition-colors"
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
        title={editingId ? "Editar vehículo" : "Nuevo vehículo"}
        size="max-w-2xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)} type="button">
              Cancelar
            </Button>
            <Button type="submit" form="vehicle-form" disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </>
        }
      >
        <ErrorText>{formError}</ErrorText>

        <form id="vehicle-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Marca"
              required
              value={form.brand}
              onChange={handleChange("brand")}
              placeholder="Toyota"
            />
            <Input
              label="Modelo"
              required
              value={form.model}
              onChange={handleChange("model")}
              placeholder="Corolla"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Año"
              type="number"
              value={form.year}
              onChange={handleChange("year")}
              placeholder="2023"
            />
            <Input
              label="Asientos"
              type="number"
              value={form.seats}
              onChange={handleChange("seats")}
              placeholder="5"
            />
            <Input
              label="Matrícula"
              value={form.plate}
              onChange={handleChange("plate")}
              placeholder="A123456"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Categoría" value={form.category} onChange={handleChange("category")}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            <Select
              label="Transmisión"
              value={form.transmission}
              onChange={handleChange("transmission")}
            >
              {TRANSMISSIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Combustible" value={form.fuel} onChange={handleChange("fuel")}>
              {FUELS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </Select>
            <Select label="Estado" value={form.status} onChange={handleChange("status")}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {statusLabel[s]}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Tarifa diaria (RD$)"
              required
              type="number"
              step="0.01"
              value={form.daily_rate}
              onChange={handleChange("daily_rate")}
              placeholder="2500"
            />
            <Input
              label="Tarifa semanal (RD$)"
              type="number"
              step="0.01"
              value={form.weekly_rate}
              onChange={handleChange("weekly_rate")}
              placeholder="15000"
            />
            <Input
              label="Depósito (RD$)"
              type="number"
              step="0.01"
              value={form.deposit}
              onChange={handleChange("deposit")}
              placeholder="5000"
            />
          </div>

          <Input
            label="URL de la foto"
            value={form.image_url}
            onChange={handleChange("image_url")}
            placeholder="https://..."
          />

          <Textarea
            label="Características"
            rows={3}
            value={form.specs}
            onChange={handleChange("specs")}
            placeholder="Aire acondicionado, Bluetooth, Cámara de reversa"
          />

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={handleChange("featured")}
              className="w-5 h-5 rounded bg-gray-800 border border-gray-700 text-orange-500 focus:ring-orange-500 accent-orange-500"
            />
            <span className="text-sm text-gray-300">Marcar como destacado</span>
          </label>
        </form>
      </Modal>
    </div>
  );
};
