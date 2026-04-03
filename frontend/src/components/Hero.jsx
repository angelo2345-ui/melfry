import React from 'react';
import { ArrowRight, Search } from 'lucide-react';

export const Hero = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="inicio" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/6732612/pexels-photo-6732612.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          alt="Luxury Car Showroom"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 px-4 py-2 rounded-full mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            <span className="text-orange-400 text-sm font-medium">Con Dios Todo es Posible</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
            Maneja Tu
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Sueño Hoy
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Vehículos premium. Servicio excepcional. Una experiencia de compra en la que puedes confiar.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={() => scrollToSection('inventario')}
              className="group bg-orange-500 text-white px-8 py-4 rounded-full hover:bg-orange-600 transition-all font-semibold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/50 hover:shadow-orange-500/70 hover:scale-105"
            >
              Ver Inventario
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => scrollToSection('contacto')}
              className="group bg-white/10 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-full hover:bg-white/20 transition-all font-semibold flex items-center justify-center gap-2 hover:scale-105"
            >
              Contáctanos
              <Search size={20} />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 mt-12 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="text-center md:text-left">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">500+</div>
              <div className="text-gray-400 text-sm">Vehículos Vendidos</div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">98%</div>
              <div className="text-gray-400 text-sm">Clientes Satisfechos</div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">10+</div>
              <div className="text-gray-400 text-sm">Años de Experiencia</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/70 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};
