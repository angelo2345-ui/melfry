import React from 'react';
import { ShieldCheck, Car, FileText, Heart } from 'lucide-react';
import { whyChooseUs, teamImage } from '../data/mockData';

const iconMap = {
  'shield-check': ShieldCheck,
  'car': Car,
  'file-text': FileText,
  'heart': Heart
};

export const WhyChooseUs = () => {
  return (
    <section id="nosotros" className="py-20 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* About Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 px-4 py-2 rounded-full mb-4">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              <span className="text-orange-400 text-sm font-medium">Sobre Nosotros</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Una Galería en la Que <span className="text-orange-500">Puedes Confiar</span>
            </h2>
            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
              En Melfry Auto Gallery SRL, no solo vendemos vehículos, creamos relaciones duraderas basadas en la confianza y el respeto mutuo.
            </p>
            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
              Con más de 10 años de experiencia en el mercado automotriz, nos enorgullece ofrecer un servicio personalizado donde cada cliente es tratado como parte de nuestra familia.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-transparent"></div>
              <p className="text-orange-400 font-semibold italic">"Con Dios Todo es Posible"</p>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={teamImage}
                alt="Melfry Auto Gallery Team"
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-2xl shadow-orange-500/50">
              <div className="text-3xl font-bold mb-1">10+</div>
              <div className="text-sm opacity-90">Años Sirviendo</div>
              <div className="text-sm opacity-90">a la Comunidad</div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ¿Por Qué <span className="text-orange-500">Elegirnos?</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Nos diferenciamos por nuestro compromiso genuino con cada cliente
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {whyChooseUs.map((item) => {
            const IconComponent = iconMap[item.icon];
            return (
              <div
                key={item.id}
                className="group bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 hover:border-orange-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-2"
              >
                <div className="bg-orange-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors">
                  <IconComponent className="text-orange-500" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>

        {/* Mission Statement */}
        <div className="mt-16 bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-transparent border border-orange-500/30 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
          <div className="max-w-3xl">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Nuestra Misión
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              Proporcionar vehículos de calidad excepcional acompañados de un servicio honesto, transparente y personalizado. 
              Queremos que cada cliente se sienta valorado, respetado y satisfecho con su experiencia de compra, 
              construyendo relaciones que perduren más allá de la transacción.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
