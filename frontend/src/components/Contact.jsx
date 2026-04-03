import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { contactInfo } from '../data/mockData';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock submission - will be connected to backend later
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', message: '' });
      setIsSubmitted(false);
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contacto" className="py-20 bg-black relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 px-4 py-2 rounded-full mb-4">
            <Phone size={16} className="text-orange-400" />
            <span className="text-orange-400 text-sm font-medium">Contáctanos</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ¿Listo Para Encontrar Tu <span className="text-orange-500">Próximo Auto?</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Comunícate con nosotros y te responderemos lo antes posible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Envíanos un Mensaje</h3>
            
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Nombre Completo</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800/50 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800/50 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="juan@ejemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Teléfono</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800/50 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="809-XXX-XXXX"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Mensaje</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full bg-gray-800/50 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-orange-500 transition-colors resize-none"
                    placeholder="¿En qué podemos ayudarte?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-4 rounded-full font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-500/50"
                >
                  Enviar Mensaje
                  <Send size={20} />
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <CheckCircle size={64} className="text-green-500 mb-4" />
                <h4 className="text-2xl font-bold text-white mb-2">¡Mensaje Enviado!</h4>
                <p className="text-gray-400 text-center">Nos pondremos en contacto contigo pronto.</p>
              </div>
            )}
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-6">
            {/* Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
                <Phone className="text-orange-500 mb-3" size={24} />
                <h4 className="text-white font-semibold mb-2">Teléfono</h4>
                <p className="text-gray-400">{contactInfo.phone}</p>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
                <Mail className="text-orange-500 mb-3" size={24} />
                <h4 className="text-white font-semibold mb-2">Email</h4>
                <p className="text-gray-400 text-sm">{contactInfo.email}</p>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
                <MapPin className="text-orange-500 mb-3" size={24} />
                <h4 className="text-white font-semibold mb-2">Ubicación</h4>
                <p className="text-gray-400 text-sm">{contactInfo.address}</p>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
                <Clock className="text-orange-500 mb-3" size={24} />
                <h4 className="text-white font-semibold mb-2">Horario</h4>
                <p className="text-gray-400 text-sm">{contactInfo.hours}</p>
              </div>
            </div>

            {/* Google Maps */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden h-80">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.206!2d-69.912!3d18.520!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDMxJzEyLjAiTiA2OcKwNTQnNDMuMiJX!5e0!3m2!1sen!2sdo!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Melfry Auto Gallery Location"
              ></iframe>
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
              <h4 className="text-xl font-bold mb-2">¿Prefieres WhatsApp?</h4>
              <p className="mb-4 text-green-50">Chatea con nosotros directamente para respuestas rápidas</p>
              <a
                href={`https://wa.me/${contactInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-full font-semibold hover:bg-green-50 transition-colors"
              >
                <Phone size={20} />
                Abrir WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
