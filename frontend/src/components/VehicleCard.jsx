import React from "react";
import { ArrowRight, Gauge, Settings, Users } from "lucide-react";
import { formatCurrency } from "../lib/format";
import { contactInfo } from "../data/mockData";

const statusLabel = {
  disponible: "Disponible",
  rentado: "Rentado",
  mantenimiento: "En mantenimiento",
};

const statusStyle = {
  disponible: "bg-green-500/90",
  rentado: "bg-orange-500/90",
  mantenimiento: "bg-red-500/90",
};

export const VehicleCard = ({ vehicle, onViewDetails }) => {
  const available = vehicle.status === "disponible";

  const handleConsult = () => {
    const msg = `Hola, estoy interesado en rentar el ${vehicle.brand} ${vehicle.model} ${vehicle.year}. ¿Está disponible?`;
    window.open(`https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="group bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-2">
      {/* Imagen */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={vehicle.image_url}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {vehicle.featured && (
          <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            DESTACADO
          </div>
        )}

        <div className={`absolute top-4 right-4 text-white text-xs font-semibold px-3 py-1 rounded-full ${statusStyle[vehicle.status] || "bg-gray-600/90"}`}>
          {statusLabel[vehicle.status] || vehicle.status}
        </div>

        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => onViewDetails(vehicle)}
            className="w-full bg-orange-500 text-white py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
          >
            Ver Detalles
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-white mb-1">
            {vehicle.brand} {vehicle.model}
          </h3>
          <p className="text-gray-400 text-sm">
            Año {vehicle.year} • {vehicle.category}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Settings size={16} className="text-orange-500" />
            {vehicle.transmission}
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Users size={16} className="text-orange-500" />
            {vehicle.seats || 5} pasajeros
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Gauge size={16} className="text-orange-500" />
            {vehicle.fuel || "Gasolina"}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {(vehicle.specs || []).slice(0, 2).map((spec, index) => (
              <span
                key={index}
                className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-full border border-gray-700"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <div>
            <p className="text-gray-400 text-xs mb-1">Tarifa diaria</p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(vehicle.daily_rate)}
              <span className="text-sm font-normal text-gray-400"> /día</span>
            </p>
          </div>
          <button
            onClick={handleConsult}
            disabled={!available}
            className={`px-6 py-2 rounded-full font-medium text-sm transition-colors ${
              available
                ? "bg-gray-800 text-white hover:bg-orange-500"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }`}
          >
            {available ? "Rentar" : "No disponible"}
          </button>
        </div>
      </div>
    </div>
  );
};
