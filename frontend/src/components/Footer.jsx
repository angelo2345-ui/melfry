import React from 'react';
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';
import { contactInfo } from '../data/mockData';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              <span className="text-orange-500">MELFRY</span>
              <span className="block text-sm font-normal text-gray-400 tracking-wider mt-1">AUTO GALLERY SRL</span>
            </h3>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Tu socio de confianza en la búsqueda del vehículo perfecto. 
              Servicio excepcional, vehículos de calidad.
            </p>
            <p className="text-orange-400 font-semibold italic text-sm">
              "Con Dios Todo es Posible"
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => document.getElementById('inicio')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('inventario')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Inventario
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('nosotros')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Sobre Nosotros
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('testimonios')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Testimonios
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Contacto
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400">
                <Phone size={18} className="text-orange-500 mt-1 flex-shrink-0" />
                <span>{contactInfo.phone}</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <Mail size={18} className="text-orange-500 mt-1 flex-shrink-0" />
                <span className="text-sm">{contactInfo.email}</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin size={18} className="text-orange-500 mt-1 flex-shrink-0" />
                <span className="text-sm">{contactInfo.address}</span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-6">
              <h5 className="text-white font-semibold mb-3 text-sm">Síguenos</h5>
              <div className="flex gap-3">
                <a
                  href={`https://instagram.com/${contactInfo.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-900 p-3 rounded-full hover:bg-orange-500 transition-colors"
                >
                  <Instagram size={20} className="text-white" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-900 p-3 rounded-full hover:bg-orange-500 transition-colors"
                >
                  <Facebook size={20} className="text-white" />
                </a>
                <a
                  href={`https://wa.me/${contactInfo.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-900 p-3 rounded-full hover:bg-green-500 transition-colors"
                >
                  <Phone size={20} className="text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            © {currentYear} Melfry Auto Gallery SRL. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-sm">
            <button className="text-gray-400 hover:text-orange-500 transition-colors">
              Política de Privacidad
            </button>
            <button className="text-gray-400 hover:text-orange-500 transition-colors">
              Términos y Condiciones
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
