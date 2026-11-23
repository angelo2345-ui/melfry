import React, { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { categories, contactInfo } from "../data/mockData";
import { useVehicles } from "../hooks/useVehicles";
import { formatCurrency } from "../lib/format";
import { VehicleCard } from "./VehicleCard";

export const Inventory = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const { vehicles, loading, error } = useVehicles();

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesCategory =
      selectedCategory === "Todos" || vehicle.category === selectedCategory;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (vehicle.brand || "").toLowerCase().includes(term) ||
      (vehicle.model || "").toLowerCase().includes(term) ||
      String(vehicle.year || "").includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="inventario" className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 px-4 py-2 rounded-full mb-4">
            <SlidersHorizontal size={16} className="text-orange-400" />
            <span className="text-orange-400 text-sm font-medium">Nuestra Flota</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Renta tu <span className="text-orange-500">Vehículo Ideal</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Elige entre nuestra selección de vehículos disponibles. Tarifas diarias claras y sin sorpresas.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-10">
          <div className="relative max-w-xl mx-auto mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por marca, modelo o año..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white pl-12 pr-4 py-4 rounded-full focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/50"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Estados de carga / error */}
        {loading && (
          <div className="text-center py-20 text-gray-400">Cargando flota...</div>
        )}

        {!loading && error && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl mb-2">No se pudo cargar la flota.</p>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="text-center mb-8">
              <p className="text-gray-400">
                Mostrando <span className="text-orange-500 font-bold">{filteredVehicles.length}</span> vehículo
                {filteredVehicles.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} onViewDetails={setSelectedVehicle} />
              ))}
            </div>

            {filteredVehicles.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-400 text-xl">No se encontraron vehículos con esos criterios</p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("Todos");
                  }}
                  className="mt-4 text-orange-500 hover:text-orange-400 font-medium"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de detalle */}
      {selectedVehicle && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVehicle(null)}
        >
          <div
            className="bg-gray-900 border border-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selectedVehicle.image_url}
                alt={`${selectedVehicle.brand} ${selectedVehicle.model}`}
                className="w-full h-80 object-cover rounded-t-2xl"
              />
              <button
                onClick={() => setSelectedVehicle(null)}
                className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {selectedVehicle.brand} {selectedVehicle.model}
                  </h3>
                  <p className="text-gray-400">
                    Año {selectedVehicle.year} • {selectedVehicle.category} • {selectedVehicle.transmission}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm mb-1">Tarifa diaria</p>
                  <p className="text-3xl font-bold text-orange-500">
                    {formatCurrency(selectedVehicle.daily_rate)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-800 p-4 rounded-xl">
                  <p className="text-gray-400 text-sm mb-1">Pasajeros</p>
                  <p className="text-white font-semibold">{selectedVehicle.seats || 5}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-xl">
                  <p className="text-gray-400 text-sm mb-1">Combustible</p>
                  <p className="text-white font-semibold">{selectedVehicle.fuel || "Gasolina"}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-xl">
                  <p className="text-gray-400 text-sm mb-1">Depósito</p>
                  <p className="text-white font-semibold">{formatCurrency(selectedVehicle.deposit)}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-xl">
                  <p className="text-gray-400 text-sm mb-1">Estado</p>
                  <p className="text-white font-semibold capitalize">{selectedVehicle.status}</p>
                </div>
              </div>

              {(selectedVehicle.specs || []).length > 0 && (
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Características</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedVehicle.specs.map((spec, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-300">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                        {spec}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-full bg-gray-800 text-gray-300 text-sm px-4 py-2 inline-block mb-4">
                Semanal: {formatCurrency(selectedVehicle.weekly_rate)}{" "}
                <span className="text-gray-500">(precio especial por 7 días)</span>
              </div>

              <button
                onClick={() => {
                  const msg = `Hola, estoy interesado en rentar el ${selectedVehicle.brand} ${selectedVehicle.model} ${selectedVehicle.year}. ¿Me pueden dar más información?`;
                  window.open(
                    `https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(msg)}`,
                    "_blank"
                  );
                }}
                className="w-full bg-orange-500 text-white py-4 rounded-full font-semibold hover:bg-orange-600 transition-colors"
              >
                Consultar disponibilidad por WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
