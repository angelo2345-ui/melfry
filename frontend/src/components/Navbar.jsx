import React, { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              <span className="text-orange-500">MELFRY</span>
              <span className="block text-xs md:text-sm font-normal text-gray-300 tracking-wider">AUTO GALLERY SRL</span>
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('inicio')} className="text-white hover:text-orange-500 transition-colors font-medium">
              Inicio
            </button>
            <button onClick={() => scrollToSection('inventario')} className="text-white hover:text-orange-500 transition-colors font-medium">
              Inventario
            </button>
            <button onClick={() => scrollToSection('nosotros')} className="text-white hover:text-orange-500 transition-colors font-medium">
              Nosotros
            </button>
            <button onClick={() => scrollToSection('testimonios')} className="text-white hover:text-orange-500 transition-colors font-medium">
              Testimonios
            </button>
            <button onClick={() => scrollToSection('contacto')} className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-all font-medium flex items-center gap-2">
              <Phone size={18} />
              Contactar
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/98 backdrop-blur-md">
          <div className="px-4 pt-2 pb-6 space-y-3">
            <button onClick={() => scrollToSection('inicio')} className="block w-full text-left px-4 py-3 text-white hover:bg-orange-500/20 rounded-lg transition-colors">
              Inicio
            </button>
            <button onClick={() => scrollToSection('inventario')} className="block w-full text-left px-4 py-3 text-white hover:bg-orange-500/20 rounded-lg transition-colors">
              Inventario
            </button>
            <button onClick={() => scrollToSection('nosotros')} className="block w-full text-left px-4 py-3 text-white hover:bg-orange-500/20 rounded-lg transition-colors">
              Nosotros
            </button>
            <button onClick={() => scrollToSection('testimonios')} className="block w-full text-left px-4 py-3 text-white hover:bg-orange-500/20 rounded-lg transition-colors">
              Testimonios
            </button>
            <button onClick={() => scrollToSection('contacto')} className="block w-full text-left px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
              Contactar
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
