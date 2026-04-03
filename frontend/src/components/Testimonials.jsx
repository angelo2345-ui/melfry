import React from 'react';
import { Star } from 'lucide-react';
import { testimonials } from '../data/mockData';

export const Testimonials = () => {
  return (
    <section id="testimonios" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 px-4 py-2 rounded-full mb-4">
            <Star size={16} className="text-orange-400" />
            <span className="text-orange-400 text-sm font-medium">Testimonios</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Lo Que Dicen Nuestros <span className="text-orange-500">Clientes</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            La satisfacción de nuestros clientes es nuestra mejor carta de presentación
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="group bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 hover:border-orange-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-2"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={20} className="fill-orange-500 text-orange-500" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                “{testimonial.text}”
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-800">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-orange-500/50"
                />
                <div>
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-gray-400 text-sm">Cliente Verificado</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
            <div className="text-4xl font-bold text-orange-500 mb-2">4.9/5</div>
            <p className="text-gray-400">Calificación Promedio</p>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
            <div className="text-4xl font-bold text-orange-500 mb-2">500+</div>
            <p className="text-gray-400">Clientes Felices</p>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
            <div className="text-4xl font-bold text-orange-500 mb-2">98%</div>
            <p className="text-gray-400">Tasa de Satisfacción</p>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
            <div className="text-4xl font-bold text-orange-500 mb-2">10+</div>
            <p className="text-gray-400">Años de Experiencia</p>
          </div>
        </div>
      </div>
    </section>
  );
};
