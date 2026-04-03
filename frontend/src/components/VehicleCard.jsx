import React from 'react';
import { ArrowRight, Gauge, Settings, TrendingUp } from 'lucide-react';

export const VehicleCard = ({ vehicle, onViewDetails }) => {
  return (
    <div className="group bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={vehicle.image}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Badge */}
        {vehicle.featured && (
          <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            DESTACADO
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">
          {vehicle.category}
        </div>

        {/* Hover CTA */}
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

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-white mb-1">
            {vehicle.brand} {vehicle.model}
          </h3>
          <p className="text-gray-400 text-sm">Año {vehicle.year}</p>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Settings size={16} className="text-orange-500" />
            {vehicle.transmission}
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Gauge size={16} className="text-orange-500" />
            {vehicle.mileage}
          </div>
        </div>

        {/* Features */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {vehicle.specs.slice(0, 2).map((spec, index) => (
              <span
                key={index}
                className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-full border border-gray-700"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <div>
            <p className="text-gray-400 text-xs mb-1">Precio</p>
            <p className="text-2xl font-bold text-white flex items-center gap-1">
              {vehicle.price}
              <TrendingUp size={18} className="text-orange-500" />
            </p>
          </div>
          <button
            onClick={() => {
              window.open(`https://wa.me/18092457000?text=Hola, estoy interesado en el ${vehicle.brand} ${vehicle.model} ${vehicle.year}`, '_blank');
            }}
            className="bg-gray-800 text-white px-6 py-2 rounded-full hover:bg-orange-500 transition-colors font-medium text-sm"
          >
            Consultar
          </button>
        </div>
      </div>
    </div>
  );
};
